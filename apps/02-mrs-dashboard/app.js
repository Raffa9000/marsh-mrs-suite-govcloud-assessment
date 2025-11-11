// GovCloud Migration Readiness Score (MRS) Application
// Data storage (in-memory, no localStorage due to sandbox restrictions)
let rfpRecords = [];
let weights = { C: 0.4, R: 0.25, B: 0.25, O: 0.1, L: 0.1 };
let thresholds = { migrateNow: 4.5, migrateSoon: 3.5, migrateLater: 2.5 };
let charts = { donut: null, scatter: null, bar: null };
let uploadedData = null;

// Field mapping rules
const MAPPINGS = {
  compliance: {
    'FedRAMP Required': 5,
    'CMS ARS Required': 5,
    'NIST 800-53 Required': 4,
    'StateRAMP': 4,
    'IL4/IL5': 3,
    'Compliance preferred': 3,
    'Best practices expected': 2,
    'None specified': 1
  },
  readiness: {
    'Complete': 5,
    'In Progress (>75%)': 4,
    'In Progress (50-75%)': 3,
    'In Progress (<50%)': 2,
    'None': 1,
    'Expired': 1
  },
  businessValue: {
    'Very High': 5,
    'High': 4,
    'Medium': 3,
    'Low': 2
  },
  operationalFriction: {
    'High': 5,
    'Moderate': 3,
    'Low': 1
  },
  legalFlexibility: {
    'Yes': 5,
    'Conditional': 4,
    'Negotiable': 3,
    'No': 1
  }
};

// Sample data
const SAMPLE_DATA = [
  { ClientName: "VA Medical Center - Phoenix", Sector: "Federal", RegulatoryLanguage: "FedRAMP Required", ATOStatus: "Complete", BusinessImpact: "Very High", OperationalConstraints: "Low", LegalFlexibility: "Yes", Notes: "Mission-critical EHR system, full ATO in place" },
  { ClientName: "CMS Medicare Portal", Sector: "Federal", RegulatoryLanguage: "CMS ARS Required", ATOStatus: "In Progress (>75%)", BusinessImpact: "Very High", OperationalConstraints: "Moderate", LegalFlexibility: "Conditional", Notes: "High priority, ATO expected Q1 2026" },
  { ClientName: "State of California DMV", Sector: "State", RegulatoryLanguage: "NIST 800-53 Required", ATOStatus: "In Progress (50-75%)", BusinessImpact: "High", OperationalConstraints: "High", LegalFlexibility: "Conditional", Notes: "Budget constraints identified, conditional award possible" },
  { ClientName: "DOD Logistics System", Sector: "Defense", RegulatoryLanguage: "FedRAMP Required", ATOStatus: "Complete", BusinessImpact: "Very High", OperationalConstraints: "Low", LegalFlexibility: "No", Notes: "IL5 required, full compliance mandatory" },
  { ClientName: "County Health Dept - Miami", Sector: "Healthcare", RegulatoryLanguage: "NIST 800-53 Required", ATOStatus: "None", BusinessImpact: "Medium", OperationalConstraints: "High", LegalFlexibility: "Yes", Notes: "Small budget, flexible timeline" },
  { ClientName: "State Tax Authority - Texas", Sector: "State", RegulatoryLanguage: "Compliance preferred", ATOStatus: "In Progress (<50%)", BusinessImpact: "High", OperationalConstraints: "Moderate", LegalFlexibility: "Conditional", Notes: "Early stages, POA&M acceptance likely" },
  { ClientName: "Federal Student Aid Office", Sector: "Federal", RegulatoryLanguage: "FedRAMP Required", ATOStatus: "In Progress (>75%)", BusinessImpact: "Very High", OperationalConstraints: "Low", LegalFlexibility: "Conditional", Notes: "Near complete, conditional award candidate" },
  { ClientName: "Municipal Water District", Sector: "State", RegulatoryLanguage: "Best practices expected", ATOStatus: "None", BusinessImpact: "Low", OperationalConstraints: "High", LegalFlexibility: "Yes", Notes: "Low priority, infrastructure modernization" },
  { ClientName: "NIH Research Database", Sector: "Federal", RegulatoryLanguage: "NIST 800-53 Required", ATOStatus: "In Progress (50-75%)", BusinessImpact: "High", OperationalConstraints: "Moderate", LegalFlexibility: "No", Notes: "Strict compliance, no flexibility" },
  { ClientName: "State Unemployment System", Sector: "State", RegulatoryLanguage: "StateRAMP", ATOStatus: "In Progress (<50%)", BusinessImpact: "Medium", OperationalConstraints: "High", LegalFlexibility: "Conditional", Notes: "Modernization project, timeline flexible" },
  { ClientName: "VA Benefits Processing", Sector: "Federal", RegulatoryLanguage: "FedRAMP Required", ATOStatus: "Expired", BusinessImpact: "Very High", OperationalConstraints: "Low", LegalFlexibility: "Yes", Notes: "ATO lapsed, needs renewal but high flexibility" },
  { ClientName: "Defense Intelligence Platform", Sector: "Defense", RegulatoryLanguage: "IL4/IL5", ATOStatus: "Complete", BusinessImpact: "Very High", OperationalConstraints: "Low", LegalFlexibility: "No", Notes: "Classified system, no compromise on security" }
];

const CONDITIONAL_AWARD_CLAUSE = "Vendor shall demonstrate ATO in progress with documented POA&M accepted for NIST 800-53 moderate baseline controls by award date, with full certification required within 90 days of contract execution. Interim operations authorized under conditional ATO pending final assessment.";

// Scoring functions
function mapScores(record) {
  const C = MAPPINGS.compliance[record.RegulatoryLanguage] || 1;
  const R = MAPPINGS.readiness[record.ATOStatus] || 1;
  const B = MAPPINGS.businessValue[record.BusinessImpact] || 2;
  const O = MAPPINGS.operationalFriction[record.OperationalConstraints] || 1;
  const L = MAPPINGS.legalFlexibility[record.LegalFlexibility] || 1;
  return { C, R, B, O, L };
}

function calculateMRS(scores) {
  const { C, R, B, O, L } = scores;
  return (weights.C * C) + (weights.R * R) + (weights.B * B) - (weights.O * O) + (weights.L * L);
}

function classifyMRS(mrs) {
  if (mrs >= thresholds.migrateNow) return 'Migrate Now';
  if (mrs >= thresholds.migrateSoon) return 'Migrate Soon';
  if (mrs >= thresholds.migrateLater) return 'Migrate Later';
  return 'Hold';
}

function isConditionalAwardCandidate(scores) {
  return scores.L >= 4 && scores.R <= 3;
}

function generateJustifications(record, scores) {
  const justifications = {
    C: `Compliance Necessity (${scores.C}/5): ${record.RegulatoryLanguage} requirements establish ${scores.C >= 4 ? 'strong' : scores.C >= 3 ? 'moderate' : 'basic'} regulatory mandate for cloud migration.`,
    R: `Readiness (${scores.R}/5): ATO status is "${record.ATOStatus}", indicating ${scores.R >= 4 ? 'high' : scores.R >= 3 ? 'moderate' : 'low'} security readiness with ${scores.R >= 4 ? 'most' : scores.R >= 3 ? 'some' : 'limited'} controls implemented.`,
    B: `Business Value (${scores.B}/5): ${record.BusinessImpact} business impact reflects ${scores.B >= 4 ? 'critical' : scores.B >= 3 ? 'significant' : 'moderate'} revenue and strategic importance to the organization.`,
    O: `Operational Friction (${scores.O}/5): ${record.OperationalConstraints} operational constraints present ${scores.O >= 4 ? 'significant' : scores.O >= 3 ? 'moderate' : 'minimal'} budget, capacity, or downtime challenges.`,
    L: `Legal Flexibility (${scores.L}/5): ${record.LegalFlexibility} legal flexibility ${scores.L >= 4 ? 'enables' : scores.L >= 3 ? 'may allow' : 'limits'} conditional award or POA&M acceptance options.`
  };
  return justifications;
}

function generateExecutiveSummary(record, scores, mrs, classification, isConditional) {
  const justifications = generateJustifications(record, scores);
  const parts = [
    `${record.ClientName} (${record.Sector}) achieves a Migration Readiness Score of ${mrs.toFixed(2)}, classifying as "${classification}".`,
    justifications.C,
    justifications.R,
    justifications.B,
    justifications.O,
    justifications.L
  ];
  
  if (isConditional) {
    parts.push(`This RFP qualifies as a Conditional Award Candidate due to high legal flexibility (L≥4) combined with partial readiness (R≤3), enabling contract execution with interim authorization while final ATO is completed.`);
  }
  
  parts.push(`Recommendation: ${classification === 'Migrate Now' ? 'Proceed immediately with migration planning and resource allocation.' : classification === 'Migrate Soon' ? 'Schedule migration within 6 months, addressing identified readiness gaps.' : classification === 'Migrate Later' ? 'Place in planning queue; focus on improving readiness and reducing operational friction.' : 'Defer migration until compliance requirements strengthen or operational constraints ease.'}`);
  
  return parts.join(' ');
}

function processRecord(record) {
  const scores = mapScores(record);
  const mrs = calculateMRS(scores);
  const classification = classifyMRS(mrs);
  const conditionalAward = isConditionalAwardCandidate(scores);
  const justifications = generateJustifications(record, scores);
  const executiveSummary = generateExecutiveSummary(record, scores, mrs, classification, conditionalAward);
  
  return {
    ...record,
    scores,
    mrs,
    classification,
    conditionalAward,
    justifications,
    executiveSummary,
    id: Date.now() + Math.random()
  };
}

function recomputeAllRecords() {
  rfpRecords = rfpRecords.map(record => {
    const scores = mapScores(record);
    const mrs = calculateMRS(scores);
    const classification = classifyMRS(mrs);
    const conditionalAward = isConditionalAwardCandidate(scores);
    const justifications = generateJustifications(record, scores);
    const executiveSummary = generateExecutiveSummary(record, scores, mrs, classification, conditionalAward);
    return { ...record, scores, mrs, classification, conditionalAward, justifications, executiveSummary };
  });
}

// UI Update functions
function updateDashboard() {
  updateKPIs();
  updateCharts();
  updateTable();
  updateExecutiveSummary();
}

function updateKPIs() {
  const total = rfpRecords.length;
  const classifications = { 'Migrate Now': 0, 'Migrate Soon': 0, 'Migrate Later': 0, 'Hold': 0 };
  let totalMRS = 0;
  let conditionalCount = 0;
  
  rfpRecords.forEach(record => {
    classifications[record.classification]++;
    totalMRS += record.mrs;
    if (record.conditionalAward) conditionalCount++;
  });
  
  document.getElementById('kpiTotal').textContent = total;
  
  if (total > 0) {
    const dist = [
      `Now: ${Math.round(classifications['Migrate Now'] / total * 100)}%`,
      `Soon: ${Math.round(classifications['Migrate Soon'] / total * 100)}%`,
      `Later: ${Math.round(classifications['Migrate Later'] / total * 100)}%`,
      `Hold: ${Math.round(classifications['Hold'] / total * 100)}%`
    ].join(', ');
    document.getElementById('kpiDistribution').textContent = dist;
    document.getElementById('kpiAvgMRS').textContent = (totalMRS / total).toFixed(2);
  } else {
    document.getElementById('kpiDistribution').textContent = '—';
    document.getElementById('kpiAvgMRS').textContent = '—';
  }
  
  document.getElementById('kpiConditional').textContent = conditionalCount;
}

function updateCharts() {
  updateDonutChart();
  updateScatterChart();
  updateBarChart();
}

function updateDonutChart() {
  const classifications = { 'Migrate Now': 0, 'Migrate Soon': 0, 'Migrate Later': 0, 'Hold': 0 };
  rfpRecords.forEach(record => classifications[record.classification]++);
  
  const ctx = document.getElementById('donutChart').getContext('2d');
  
  if (charts.donut) {
    charts.donut.destroy();
  }
  
  charts.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Migrate Now', 'Migrate Soon', 'Migrate Later', 'Hold'],
      datasets: [{
        data: [classifications['Migrate Now'], classifications['Migrate Soon'], classifications['Migrate Later'], classifications['Hold']],
        backgroundColor: ['#22c55e', '#f59e0b', '#f97316', '#ef4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function updateScatterChart() {
  const datasets = [
    { label: 'Migrate Now', data: [], backgroundColor: '#22c55e', borderColor: '#22c55e', pointStyle: 'circle' },
    { label: 'Migrate Soon', data: [], backgroundColor: '#f59e0b', borderColor: '#f59e0b', pointStyle: 'circle' },
    { label: 'Migrate Later', data: [], backgroundColor: '#f97316', borderColor: '#f97316', pointStyle: 'circle' },
    { label: 'Hold', data: [], backgroundColor: '#ef4444', borderColor: '#ef4444', pointStyle: 'circle' },
    { label: 'Conditional Award', data: [], backgroundColor: '#1FB8CD', borderColor: '#1FB8CD', pointStyle: 'star' }
  ];
  
  rfpRecords.forEach(record => {
    const point = { x: record.scores.R, y: record.scores.B, label: record.ClientName };
    if (record.conditionalAward) {
      datasets[4].data.push(point);
    } else {
      const idx = ['Migrate Now', 'Migrate Soon', 'Migrate Later', 'Hold'].indexOf(record.classification);
      datasets[idx].data.push(point);
    }
  });
  
  const ctx = document.getElementById('scatterChart').getContext('2d');
  
  if (charts.scatter) {
    charts.scatter.destroy();
  }
  
  charts.scatter = new Chart(ctx, {
    type: 'scatter',
    data: { datasets: datasets.filter(ds => ds.data.length > 0) },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Readiness (R)' }, min: 0, max: 5 },
        y: { title: { display: true, text: 'Business Value (B)' }, min: 0, max: 5 }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw.label}: R=${context.raw.x}, B=${context.raw.y}`
          }
        }
      }
    }
  });
}

function updateBarChart() {
  let sumC = 0, sumR = 0, sumB = 0, sumO = 0, sumL = 0;
  const count = rfpRecords.length || 1;
  
  rfpRecords.forEach(record => {
    sumC += record.scores.C;
    sumR += record.scores.R;
    sumB += record.scores.B;
    sumO += record.scores.O;
    sumL += record.scores.L;
  });
  
  const ctx = document.getElementById('barChart').getContext('2d');
  
  if (charts.bar) {
    charts.bar.destroy();
  }
  
  charts.bar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Compliance (C)', 'Readiness (R)', 'Business Value (B)', 'Operational Friction (O)', 'Legal Flexibility (L)'],
      datasets: [{
        label: 'Average Score',
        data: [sumC/count, sumR/count, sumB/count, sumO/count, sumL/count],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 5 }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function updateTable() {
  const tbody = document.getElementById('resultsTableBody');
  tbody.innerHTML = '';
  
  rfpRecords.forEach(record => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${record.ClientName}</td>
      <td>${record.Sector}</td>
      <td><strong>${record.mrs.toFixed(2)}</strong></td>
      <td><span class="classification-badge badge-${record.classification.toLowerCase().replace(/ /g, '-')}">${record.classification}</span></td>
      <td>${record.scores.C}</td>
      <td>${record.scores.R}</td>
      <td>${record.scores.B}</td>
      <td>${record.scores.O}</td>
      <td>${record.scores.L}</td>
      <td>${record.conditionalAward ? '✓' : '—'}</td>
      <td><button class="btn btn--sm btn--secondary" onclick="deleteRecord('${record.id}')">Delete</button></td>
    `;
    tr.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') {
        openDrawer(record);
      }
    };
    tbody.appendChild(tr);
  });
}

function updateExecutiveSummary() {
  const total = rfpRecords.length;
  if (total === 0) {
    document.getElementById('executiveSummaryContent').innerHTML = '<p>No RFPs processed yet. Add records to generate portfolio summary.</p>';
    return;
  }
  
  const classifications = { 'Migrate Now': 0, 'Migrate Soon': 0, 'Migrate Later': 0, 'Hold': 0 };
  let totalMRS = 0;
  let conditionalCount = 0;
  let sumC = 0, sumR = 0, sumB = 0, sumO = 0, sumL = 0;
  
  rfpRecords.forEach(record => {
    classifications[record.classification]++;
    totalMRS += record.mrs;
    if (record.conditionalAward) conditionalCount++;
    sumC += record.scores.C;
    sumR += record.scores.R;
    sumB += record.scores.B;
    sumO += record.scores.O;
    sumL += record.scores.L;
  });
  
  const avgMRS = (totalMRS / total).toFixed(2);
  const avgC = (sumC / total).toFixed(1);
  const avgR = (sumR / total).toFixed(1);
  const avgB = (sumB / total).toFixed(1);
  const avgO = (sumO / total).toFixed(1);
  const avgL = (sumL / total).toFixed(1);
  
  const nowPct = Math.round(classifications['Migrate Now'] / total * 100);
  const soonPct = Math.round(classifications['Migrate Soon'] / total * 100);
  const laterPct = Math.round(classifications['Migrate Later'] / total * 100);
  const holdPct = Math.round(classifications['Hold'] / total * 100);
  
  const domains = [
    { name: 'Compliance Necessity', avg: parseFloat(avgC) },
    { name: 'Readiness', avg: parseFloat(avgR) },
    { name: 'Business Value', avg: parseFloat(avgB) },
    { name: 'Operational Friction', avg: parseFloat(avgO) },
    { name: 'Legal Flexibility', avg: parseFloat(avgL) }
  ];
  domains.sort((a, b) => b.avg - a.avg);
  const topDomain = domains[0];
  const frictionDomain = parseFloat(avgO) > 3 ? 'high Operational Friction' : 'moderate operational constraints';
  
  const readinessRange = rfpRecords.map(r => r.scores.R);
  const minR = Math.min(...readinessRange);
  const maxR = Math.max(...readinessRange);
  const atoComplete = rfpRecords.filter(r => r.scores.R >= 5).length;
  
  const p1 = `The portfolio of ${total} RFPs shows ${nowPct}% ready for immediate migration (Migrate Now), ${soonPct}% requiring near-term action (Migrate Soon), ${laterPct}% in planning phase (Migrate Later), and ${holdPct}% on hold. Average MRS is ${avgMRS}.`;
  
  const p2 = `Primary migration drivers include ${topDomain.name} with an average score of ${topDomain.avg.toFixed(1)}. Greatest friction points center on ${frictionDomain}. Readiness levels vary from ${minR} to ${maxR}, with ${atoComplete} record${atoComplete !== 1 ? 's' : ''} showing ATO completion.`;
  
  const p3 = `Prioritize ${conditionalCount} Conditional Award candidate${conditionalCount !== 1 ? 's' : ''} for immediate contract negotiation with interim authorization clauses. Resource allocation should focus on improving ${domains[domains.length - 1].name} (currently averaging ${domains[domains.length - 1].avg.toFixed(1)}). Expected timeline: ${classifications['Migrate Now']} immediate migrations, ${classifications['Migrate Soon']} within 6 months, ${classifications['Migrate Later']} in planning.`;
  
  document.getElementById('executiveSummaryContent').innerHTML = `<p>${p1}</p><p>${p2}</p><p>${p3}</p>`;
}

// Drawer functions
function openDrawer(record) {
  const drawer = document.getElementById('recordDrawer');
  const body = document.getElementById('drawerBody');
  const title = document.getElementById('drawerTitle');
  
  title.textContent = record.ClientName;
  
  let html = `
    <div class="score-detail">
      <h4>Input Fields</h4>
      <p><strong>Sector:</strong> ${record.Sector}</p>
      <p><strong>Regulatory Language:</strong> ${record.RegulatoryLanguage}</p>
      <p><strong>ATO Status:</strong> ${record.ATOStatus}</p>
      <p><strong>Business Impact:</strong> ${record.BusinessImpact}</p>
      <p><strong>Operational Constraints:</strong> ${record.OperationalConstraints}</p>
      <p><strong>Legal Flexibility:</strong> ${record.LegalFlexibility}</p>
      ${record.Notes ? `<p><strong>Notes:</strong> ${record.Notes}</p>` : ''}
    </div>
    
    <div class="score-detail">
      <h4>Computed Scores</h4>
      <p>${record.justifications.C}</p>
      <p>${record.justifications.R}</p>
      <p>${record.justifications.B}</p>
      <p>${record.justifications.O}</p>
      <p>${record.justifications.L}</p>
    </div>
    
    <div class="score-detail">
      <h4>MRS Calculation</h4>
      <p><strong>MRS = (${weights.C}×${record.scores.C}) + (${weights.R}×${record.scores.R}) + (${weights.B}×${record.scores.B}) - (${weights.O}×${record.scores.O}) + (${weights.L}×${record.scores.L}) = ${record.mrs.toFixed(2)}</strong></p>
      <p><strong>Classification:</strong> <span class="classification-badge badge-${record.classification.toLowerCase().replace(/ /g, '-')}">${record.classification}</span></p>
      ${record.conditionalAward ? '<p><strong>Status:</strong> Conditional Award Candidate ✓</p>' : ''}
    </div>
    
    <div class="score-detail">
      <h4>Executive Summary</h4>
      <p>${record.executiveSummary}</p>
      <button class="btn btn--sm btn--secondary copy-button" onclick="copyToClipboard('${record.executiveSummary.replace(/'/g, "\\'")}')">Copy Summary</button>
    </div>
  `;
  
  if (record.conditionalAward) {
    html += `
      <div class="score-detail">
        <h4>Conditional Award Clause</h4>
        <p>${CONDITIONAL_AWARD_CLAUSE}</p>
        <button class="btn btn--sm btn--secondary copy-button" onclick="copyToClipboard('${CONDITIONAL_AWARD_CLAUSE.replace(/'/g, "\\'")}')">Copy Clause</button>
      </div>
    `;
  }
  
  body.innerHTML = html;
  drawer.classList.add('open');
}

function closeDrawer() {
  document.getElementById('recordDrawer').classList.remove('open');
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('Copied to clipboard!');
}

// Export functions
function exportJSON() {
  const data = JSON.stringify(rfpRecords, null, 2);
  downloadFile(data, 'results.json', 'application/json');
}

function exportCSV() {
  const headers = ['ClientName', 'Sector', 'RegulatoryLanguage', 'ATOStatus', 'BusinessImpact', 'OperationalConstraints', 'LegalFlexibility', 'C_Score', 'R_Score', 'B_Score', 'O_Score', 'L_Score', 'MRS', 'Classification', 'ConditionalAwardFlag', 'Notes'];
  
  let csv = headers.join(',') + '\n';
  rfpRecords.forEach(record => {
    const row = [
      `"${record.ClientName}"`,
      `"${record.Sector}"`,
      `"${record.RegulatoryLanguage}"`,
      `"${record.ATOStatus}"`,
      `"${record.BusinessImpact}"`,
      `"${record.OperationalConstraints}"`,
      `"${record.LegalFlexibility}"`,
      record.scores.C,
      record.scores.R,
      record.scores.B,
      record.scores.O,
      record.scores.L,
      record.mrs.toFixed(2),
      `"${record.classification}"`,
      record.conditionalAward ? 'Yes' : 'No',
      `"${(record.Notes || '').replace(/"/g, '""')}"`
    ];
    csv += row.join(',') + '\n';
  });
  
  downloadFile(csv, 'evidence.csv', 'text/csv');
}

function exportSummary() {
  const timestamp = new Date().toISOString();
  let summary = `GovCloud Migration Readiness Score (MRS) Summary Report\n`;
  summary += `Generated: ${timestamp}\n`;
  summary += `Settings: Wc=${weights.C}, Wr=${weights.R}, Wb=${weights.B}, Wo=${weights.O}, Wl=${weights.L}\n`;
  summary += `Thresholds: Migrate Now≥${thresholds.migrateNow}, Migrate Soon≥${thresholds.migrateSoon}, Migrate Later≥${thresholds.migrateLater}\n\n`;
  
  summary += document.getElementById('executiveSummaryContent').innerText + '\n\n';
  
  summary += `Detailed Results (sorted by MRS descending):\n`;
  summary += `${'='.repeat(80)}\n`;
  
  const sorted = [...rfpRecords].sort((a, b) => b.mrs - a.mrs);
  sorted.forEach(record => {
    summary += `\n${record.ClientName} (${record.Sector})\n`;
    summary += `  MRS: ${record.mrs.toFixed(2)} | Classification: ${record.classification}\n`;
    summary += `  Scores: C=${record.scores.C}, R=${record.scores.R}, B=${record.scores.B}, O=${record.scores.O}, L=${record.scores.L}\n`;
    summary += `  Conditional Award: ${record.conditionalAward ? 'Yes' : 'No'}\n`;
  });
  
  downloadFile(summary, 'summary_report.txt', 'text/plain');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadTemplate() {
  const csv = 'ClientName,Sector,RegulatoryLanguage,ATOStatus,BusinessImpact,OperationalConstraints,LegalFlexibility,Notes\n';
  const sample = '"Example Corp","Federal","FedRAMP Required","In Progress (>75%)","High","Moderate","Conditional","Sample RFP record"\n';
  downloadFile(csv + sample, 'rfp_template.csv', 'text/csv');
}

// File upload handling
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    try {
      if (file.name.endsWith('.json')) {
        uploadedData = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        uploadedData = parseCSV(content);
      }
      displayUploadPreview();
    } catch (err) {
      alert('Error parsing file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/"[^"]*"|[^,]+/g).map(v => v.trim().replace(/^"|"$/g, ''));
    const record = {};
    headers.forEach((header, idx) => {
      record[header] = values[idx] || '';
    });
    records.push(record);
  }
  
  return records;
}

function displayUploadPreview() {
  const preview = document.getElementById('uploadPreview');
  const table = document.getElementById('uploadPreviewTable');
  
  let html = `<p><strong>${uploadedData.length} records found</strong></p>`;
  html += '<table class="results-table"><thead><tr><th>Client Name</th><th>Sector</th><th>Regulatory Language</th><th>ATO Status</th></tr></thead><tbody>';
  
  uploadedData.slice(0, 5).forEach(record => {
    html += `<tr><td>${record.ClientName}</td><td>${record.Sector}</td><td>${record.RegulatoryLanguage}</td><td>${record.ATOStatus}</td></tr>`;
  });
  
  html += '</tbody></table>';
  if (uploadedData.length > 5) {
    html += `<p style="font-size: 12px; color: var(--color-text-secondary);">Showing first 5 of ${uploadedData.length} records</p>`;
  }
  
  table.innerHTML = html;
  preview.style.display = 'block';
}

function confirmUpload() {
  if (!uploadedData || uploadedData.length === 0) {
    alert('No data to import');
    return;
  }
  
  uploadedData.forEach(record => {
    const processed = processRecord(record);
    rfpRecords.push(processed);
  });
  
  updateDashboard();
  uploadedData = null;
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('fileUpload').value = '';
  alert(`Successfully imported ${uploadedData ? uploadedData.length : 0} records`);
}

// Form handling
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const record = {};
  formData.forEach((value, key) => {
    record[key] = value;
  });
  
  const processed = processRecord(record);
  rfpRecords.push(processed);
  updateDashboard();
  event.target.reset();
  document.getElementById('formPreview').style.display = 'none';
  alert(`Added: ${record.ClientName}`);
}

function handleFormChange(event) {
  const form = event.target.closest('form');
  if (!form) return;
  
  const formData = new FormData(form);
  const record = {};
  let allFilled = true;
  
  formData.forEach((value, key) => {
    record[key] = value;
    if (!value && key !== 'Notes') allFilled = false;
  });
  
  if (allFilled) {
    const scores = mapScores(record);
    const mrs = calculateMRS(scores);
    const classification = classifyMRS(mrs);
    
    const preview = document.getElementById('formPreview');
    const previewScores = document.getElementById('previewScores');
    previewScores.innerHTML = `
      <p><strong>C:</strong> ${scores.C} | <strong>R:</strong> ${scores.R} | <strong>B:</strong> ${scores.B} | <strong>O:</strong> ${scores.O} | <strong>L:</strong> ${scores.L}</p>
      <p><strong>MRS:</strong> ${mrs.toFixed(2)} | <strong>Classification:</strong> <span class="classification-badge badge-${classification.toLowerCase().replace(/ /g, '-')}">${classification}</span></p>
    `;
    preview.style.display = 'block';
  }
}

function deleteRecord(id) {
  if (confirm('Delete this record?')) {
    rfpRecords = rfpRecords.filter(r => r.id != id);
    updateDashboard();
  }
}

// Weight and threshold updates
function updateWeights() {
  weights.C = parseFloat(document.getElementById('wcSlider').value);
  weights.R = parseFloat(document.getElementById('wrSlider').value);
  weights.B = parseFloat(document.getElementById('wbSlider').value);
  weights.O = parseFloat(document.getElementById('woSlider').value);
  weights.L = parseFloat(document.getElementById('wlSlider').value);
  
  document.getElementById('wcValue').textContent = weights.C.toFixed(2);
  document.getElementById('wrValue').textContent = weights.R.toFixed(2);
  document.getElementById('wbValue').textContent = weights.B.toFixed(2);
  document.getElementById('woValue').textContent = weights.O.toFixed(2);
  document.getElementById('wlValue').textContent = weights.L.toFixed(2);
  
  recomputeAllRecords();
  updateDashboard();
}

function updateThresholds() {
  thresholds.migrateNow = parseFloat(document.getElementById('t1Slider').value);
  thresholds.migrateSoon = parseFloat(document.getElementById('t2Slider').value);
  thresholds.migrateLater = parseFloat(document.getElementById('t3Slider').value);
  
  document.getElementById('t1Value').textContent = thresholds.migrateNow.toFixed(1);
  document.getElementById('t2Value').textContent = thresholds.migrateSoon.toFixed(1);
  document.getElementById('t3Value').textContent = thresholds.migrateLater.toFixed(1);
  
  recomputeAllRecords();
  updateDashboard();
}

function resetDefaults() {
  weights = { C: 0.4, R: 0.25, B: 0.25, O: 0.1, L: 0.1 };
  thresholds = { migrateNow: 4.5, migrateSoon: 3.5, migrateLater: 2.5 };
  
  document.getElementById('wcSlider').value = weights.C;
  document.getElementById('wrSlider').value = weights.R;
  document.getElementById('wbSlider').value = weights.B;
  document.getElementById('woSlider').value = weights.O;
  document.getElementById('wlSlider').value = weights.L;
  
  document.getElementById('t1Slider').value = thresholds.migrateNow;
  document.getElementById('t2Slider').value = thresholds.migrateSoon;
  document.getElementById('t3Slider').value = thresholds.migrateLater;
  
  updateWeights();
  updateThresholds();
}

// Testing functions
function runTests() {
  const tests = [
    {
      name: 'MRS Calculation Accuracy',
      test: () => {
        const testScores = { C: 5, R: 4, B: 5, O: 1, L: 5 };
        const expectedMRS = (0.4 * 5) + (0.25 * 4) + (0.25 * 5) - (0.1 * 1) + (0.1 * 5);
        const actualMRS = calculateMRS(testScores);
        return Math.abs(actualMRS - expectedMRS) < 0.001;
      }
    },
    {
      name: 'Classification: Migrate Now',
      test: () => {
        return classifyMRS(4.7) === 'Migrate Now';
      }
    },
    {
      name: 'Classification: Migrate Soon',
      test: () => {
        return classifyMRS(4.0) === 'Migrate Soon';
      }
    },
    {
      name: 'Classification: Migrate Later',
      test: () => {
        return classifyMRS(3.0) === 'Migrate Later';
      }
    },
    {
      name: 'Classification: Hold',
      test: () => {
        return classifyMRS(2.0) === 'Hold';
      }
    },
    {
      name: 'Conditional Award Flag: L≥4 and R≤3',
      test: () => {
        return isConditionalAwardCandidate({ L: 4, R: 3 }) === true;
      }
    },
    {
      name: 'Conditional Award Flag: L<4',
      test: () => {
        return isConditionalAwardCandidate({ L: 3, R: 2 }) === false;
      }
    },
    {
      name: 'Conditional Award Flag: R>3',
      test: () => {
        return isConditionalAwardCandidate({ L: 5, R: 4 }) === false;
      }
    },
    {
      name: 'Score Mapping: FedRAMP Required = 5',
      test: () => {
        const record = { RegulatoryLanguage: 'FedRAMP Required', ATOStatus: 'Complete', BusinessImpact: 'High', OperationalConstraints: 'Low', LegalFlexibility: 'Yes' };
        const scores = mapScores(record);
        return scores.C === 5;
      }
    },
    {
      name: 'Operational Friction is Subtractive',
      test: () => {
        const scores1 = { C: 3, R: 3, B: 3, O: 1, L: 3 };
        const scores2 = { C: 3, R: 3, B: 3, O: 5, L: 3 };
        const mrs1 = calculateMRS(scores1);
        const mrs2 = calculateMRS(scores2);
        return mrs1 > mrs2;
      }
    }
  ];
  
  let html = '<h3>Test Results</h3>';
  let passed = 0;
  
  tests.forEach(test => {
    const result = test.test();
    if (result) passed++;
    html += `<div class="test-result ${result ? 'pass' : 'fail'}">`;
    html += `<strong>${result ? '✓ PASS' : '✗ FAIL'}:</strong> ${test.name}`;
    html += '</div>';
  });
  
  html += `<p style="margin-top: 16px;"><strong>Summary:</strong> ${passed}/${tests.length} tests passed</p>`;
  
  document.getElementById('testModalBody').innerHTML = html;
  document.getElementById('testModal').classList.add('open');
}

// Initialize
function init() {
  // Load sample data
  SAMPLE_DATA.forEach(record => {
    const processed = processRecord(record);
    rfpRecords.push(processed);
  });
  
  updateDashboard();
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });
  
  // Form handling
  document.getElementById('singleRfpForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('singleRfpForm').addEventListener('change', handleFormChange);
  
  // File upload
  document.getElementById('fileUpload').addEventListener('change', handleFileUpload);
  document.getElementById('confirmUploadBtn').addEventListener('click', confirmUpload);
  document.getElementById('downloadTemplateBtn').addEventListener('click', downloadTemplate);
  
  // Weights and thresholds
  ['wc', 'wr', 'wb', 'wo', 'wl'].forEach(w => {
    document.getElementById(w + 'Slider').addEventListener('input', updateWeights);
  });
  ['t1', 't2', 't3'].forEach(t => {
    document.getElementById(t + 'Slider').addEventListener('input', updateThresholds);
  });
  document.getElementById('resetDefaultsBtn').addEventListener('click', resetDefaults);
  
  // Export buttons
  document.getElementById('exportJsonBtn').addEventListener('click', exportJSON);
  document.getElementById('exportCsvBtn').addEventListener('click', exportCsvBtn);
  document.getElementById('exportSummaryBtn').addEventListener('click', exportSummary);
  
  // Drawer
  document.getElementById('drawerCloseBtn').addEventListener('click', closeDrawer);
  
  // Modals
  document.getElementById('runTestsBtn').addEventListener('click', runTests);
  document.getElementById('testModalClose').addEventListener('click', () => {
    document.getElementById('testModal').classList.remove('open');
  });
  
  document.getElementById('helpBtn').addEventListener('click', () => {
    document.getElementById('helpModal').classList.add('open');
  });
  document.getElementById('helpModalClose').addEventListener('click', () => {
    document.getElementById('helpModal').classList.remove('open');
  });
  
  // Close modals on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

// Fix export CSV button reference
function exportCsvBtn() {
  exportCSV();
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}