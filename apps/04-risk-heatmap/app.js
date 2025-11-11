// Resource Capacity & Budget Planner Application

// Resource allocation state
let state = {
  security: 2,
  compliance: 2,
  infrastructure: 1,
  pm: 1,
  budget: 500000,
  horizon: 12,
  effortNow: 4,
  effortSoon: 8,
  effortLater: 12,
  effortHold: 16,
  holidayDowntime: true,
  concurrentSupport: true,
  learningCurve: true,
  securityPct: 40,
  compliancePct: 30,
  infraPct: 20,
  overheadPct: 10
};

// Hourly rates
const rates = {
  security: 120,
  compliance: 90,
  infrastructure: 110,
  pm: 100
};

// RFP Portfolio data
const rfps = [
  { name: 'VA Medical Center', tier: 'Migrate Now', hours: 100, secPct: 40, compPct: 30, infraPct: 20, pmPct: 10 },
  { name: 'DOD Logistics System', tier: 'Migrate Now', hours: 105, secPct: 40, compPct: 30, infraPct: 20, pmPct: 10 },
  { name: 'Federal Student Aid', tier: 'Migrate Soon', hours: 215, secPct: 37, compPct: 32, infraPct: 22, pmPct: 9 },
  { name: 'State DMV - California', tier: 'Migrate Soon', hours: 210, secPct: 37, compPct: 32, infraPct: 22, pmPct: 9 },
  { name: 'City Transit Authority', tier: 'Migrate Soon', hours: 220, secPct: 37, compPct: 32, infraPct: 22, pmPct: 9 },
  { name: 'VA Benefits Processing', tier: 'Migrate Soon', hours: 215, secPct: 37, compPct: 32, infraPct: 22, pmPct: 9 },
  { name: 'State Tax Authority - NY', tier: 'Migrate Soon', hours: 210, secPct: 37, compPct: 32, infraPct: 22, pmPct: 9 },
  { name: 'County Health Dept - Miami', tier: 'Migrate Later', hours: 330, secPct: 35, compPct: 35, infraPct: 23, pmPct: 7 },
  { name: 'State Education System', tier: 'Migrate Later', hours: 320, secPct: 35, compPct: 35, infraPct: 23, pmPct: 7 },
  { name: 'Municipal Court System', tier: 'Migrate Later', hours: 340, secPct: 35, compPct: 35, infraPct: 23, pmPct: 7 },
  { name: 'State Tax Authority - Texas', tier: 'Migrate Later', hours: 330, secPct: 35, compPct: 35, infraPct: 23, pmPct: 7 },
  { name: 'County Sheriff Department', tier: 'Hold', hours: 400, secPct: 33, compPct: 33, infraPct: 25, pmPct: 9 }
];

// Chart instances
let burndownChart = null;
let budgetChart = null;
let cashflowChart = null;

// Update capacity calculations
function updateCapacity() {
  // Get current values from sliders
  state.security = parseInt(document.getElementById('securitySlider').value);
  state.compliance = parseInt(document.getElementById('complianceSlider').value);
  state.infrastructure = parseInt(document.getElementById('infraSlider').value);
  state.pm = parseInt(document.getElementById('pmSlider').value);
  state.budget = parseInt(document.getElementById('budgetInput').value);
  state.horizon = parseInt(document.getElementById('horizonSlider').value);
  state.effortNow = parseInt(document.getElementById('effortNow').value);
  state.effortSoon = parseInt(document.getElementById('effortSoon').value);
  state.effortLater = parseInt(document.getElementById('effortLater').value);
  state.effortHold = parseInt(document.getElementById('effortHold').value);
  state.holidayDowntime = document.getElementById('holidayDowntime').checked;
  state.concurrentSupport = document.getElementById('concurrentSupport').checked;
  state.learningCurve = document.getElementById('learningCurve').checked;
  
  // Update display values
  document.getElementById('securityValue').textContent = state.security;
  document.getElementById('complianceValue').textContent = state.compliance;
  document.getElementById('infraValue').textContent = state.infrastructure;
  document.getElementById('pmValue').textContent = state.pm;
  document.getElementById('horizonValue').textContent = state.horizon;
  
  const totalFTEs = state.security + state.compliance + state.infrastructure + state.pm;
  document.getElementById('totalFTEs').textContent = totalFTEs;
  
  // Recalculate metrics
  calculateMetrics();
}

function updateBudgetAllocation() {
  state.securityPct = parseInt(document.getElementById('securityPctSlider').value);
  state.compliancePct = parseInt(document.getElementById('compliancePctSlider').value);
  state.infraPct = parseInt(document.getElementById('infraPctSlider').value);
  state.overheadPct = parseInt(document.getElementById('overheadPctSlider').value);
  
  document.getElementById('securityPctValue').textContent = state.securityPct;
  document.getElementById('compliancePctValue').textContent = state.compliancePct;
  document.getElementById('infraPctValue').textContent = state.infraPct;
  document.getElementById('overheadPctValue').textContent = state.overheadPct;
  
  const total = state.securityPct + state.compliancePct + state.infraPct + state.overheadPct;
  document.getElementById('allocationTotal').textContent = total;
  
  if (budgetChart) {
    updateBudgetChart();
  }
}

function calculateMetrics() {
  // Calculate quarterly capacity
  const weeksPerQuarter = 13;
  const hoursPerWeek = 40;
  let availableHours = weeksPerQuarter * hoursPerWeek;
  
  if (state.holidayDowntime) {
    availableHours *= 0.85; // 15% reduction for holidays
  }
  if (state.concurrentSupport) {
    availableHours *= 0.5; // 50% for concurrent support
  }
  
  const securityHours = availableHours * state.security;
  const avgRFPHours = 200; // average hours per RFP
  const quarterlyCapacity = (securityHours / avgRFPHours).toFixed(1);
  
  // Calculate total required hours
  const totalHours = rfps.reduce((sum, rfp) => sum + rfp.hours, 0);
  const totalCost = calculateTotalCost();
  
  // Calculate completion date
  const quarters = Math.ceil(totalHours / (securityHours * 4)); // 4 quarters per year
  const completionQuarter = quarters <= 3 ? 'Q4 2025' : quarters <= 5 ? 'Q1 2026' : quarters <= 7 ? 'Q2 2026' : 'Q3 2026';
  
  // Identify bottleneck
  const utilization = {
    security: (totalHours * 0.37) / (securityHours * 4),
    compliance: (totalHours * 0.32) / (availableHours * state.compliance * 4),
    infrastructure: (totalHours * 0.22) / (availableHours * state.infrastructure * 4)
  };
  
  let bottleneck = 'Security';
  let maxUtil = utilization.security;
  if (utilization.compliance > maxUtil) {
    bottleneck = 'Compliance';
    maxUtil = utilization.compliance;
  }
  if (utilization.infrastructure > maxUtil) {
    bottleneck = 'Infrastructure';
    maxUtil = utilization.infrastructure;
  }
  
  // Update KPI cards
  document.getElementById('quarterlyCapacity').textContent = quarterlyCapacity;
  document.getElementById('capacitySubtext').textContent = `RFPs/quarter at current staffing`;
  document.getElementById('capacityBreakdown').textContent = `${state.security} Security, ${state.compliance} Compliance, ${state.infrastructure} Infra`;
  document.getElementById('completionDate').textContent = completionQuarter;
  document.getElementById('requiredBudget').textContent = `$${Math.round(totalCost / 1000)}K`;
  
  const budgetStatus = totalCost <= state.budget ? '✓ Within budget' : '⚠ Exceeds budget';
  document.getElementById('budgetStatus').textContent = `vs $${state.budget / 1000}K available (${budgetStatus})`;
  document.getElementById('bottleneck').textContent = bottleneck;
  document.getElementById('bottleneckImpact').textContent = `Your constraint. Unlocking this would reduce timeline by ${Math.ceil(maxUtil * 2)} months`;
  
  // Update tables and charts
  updateUtilizationTable();
  updateEffortTable();
  updateCharts();
  updateBottleneckAnalysis(bottleneck);
}

function calculateTotalCost() {
  let total = 0;
  rfps.forEach(rfp => {
    const secHours = rfp.hours * (rfp.secPct / 100);
    const compHours = rfp.hours * (rfp.compPct / 100);
    const infraHours = rfp.hours * (rfp.infraPct / 100);
    const pmHours = rfp.hours * (rfp.pmPct / 100);
    
    total += (secHours * rates.security) + (compHours * rates.compliance) + 
             (infraHours * rates.infrastructure) + (pmHours * rates.pm);
  });
  return total;
}

function updateUtilizationTable() {
  const tbody = document.getElementById('utilizationBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const months = ['Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'];
  const baseHours = 160; // hours per month
  
  months.forEach((month, i) => {
    const secHours = baseHours * state.security * (0.7 + Math.random() * 0.3);
    const compHours = baseHours * state.compliance * (0.7 + Math.random() * 0.3);
    const infraHours = baseHours * state.infrastructure * (0.7 + Math.random() * 0.3);
    const pmHours = baseHours * state.pm * (0.7 + Math.random() * 0.3);
    const total = secHours + compHours + infraHours + pmHours;
    const maxPossible = baseHours * (state.security + state.compliance + state.infrastructure + state.pm);
    const utilization = Math.round((total / maxPossible) * 100);
    
    let utilClass = 'utilization-healthy';
    if (utilization >= 95) utilClass = 'utilization-at-risk';
    else if (utilization >= 85) utilClass = 'utilization-tight';
    
    const row = `
      <tr>
        <td>${month}</td>
        <td>${Math.round(secHours)}</td>
        <td>${Math.round(compHours)}</td>
        <td>${Math.round(infraHours)}</td>
        <td>${Math.round(pmHours)}</td>
        <td>${Math.round(total)}</td>
        <td class="${utilClass}">${utilization}%</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

function updateEffortTable() {
  const tbody = document.getElementById('effortBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  let totalHours = 0;
  let totalWeeks = 0;
  let totalCost = 0;
  
  rfps.forEach(rfp => {
    const secHours = Math.round(rfp.hours * (rfp.secPct / 100));
    const compHours = Math.round(rfp.hours * (rfp.compPct / 100));
    const infraHours = Math.round(rfp.hours * (rfp.infraPct / 100));
    const pmHours = Math.round(rfp.hours * (rfp.pmPct / 100));
    const cost = (secHours * rates.security) + (compHours * rates.compliance) + 
                 (infraHours * rates.infrastructure) + (pmHours * rates.pm);
    const weeks = Math.ceil(rfp.hours / 40);
    
    totalHours += rfp.hours;
    totalWeeks += weeks;
    totalCost += cost;
    
    const tierBadge = `<span class="classification-badge badge-${rfp.tier.toLowerCase().replace(/ /g, '-')}">${rfp.tier}</span>`;
    
    const row = `
      <tr>
        <td>${rfp.name}</td>
        <td>${tierBadge}</td>
        <td>${secHours}</td>
        <td>${compHours}</td>
        <td>${infraHours}</td>
        <td>${pmHours}</td>
        <td>${rfp.hours}</td>
        <td>${weeks} wks</td>
        <td>$${(cost / 1000).toFixed(1)}K</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
  
  document.getElementById('totalHours').textContent = totalHours;
  document.getElementById('totalWeeks').textContent = Math.round(totalWeeks / 4);
  document.getElementById('totalCost').textContent = `$${Math.round(totalCost / 1000)}K`;
}

function updateBottleneckAnalysis(bottleneck) {
  document.getElementById('bottleneckName').textContent = bottleneck + ' Engineering';
  
  const reasons = {
    'Security': `${state.security} Security Engineers can only complete 3.2 RFPs/quarter. You have 5 in Migrate Soon tier requiring security work.`,
    'Compliance': `${state.compliance} Compliance Analysts are at capacity. Heavy compliance requirements across state contracts.`,
    'Infrastructure': `${state.infrastructure} Infrastructure Engineer(s) limiting deployment velocity. Cloud configuration is time-intensive.`
  };
  
  document.getElementById('bottleneckReason').innerHTML = `<strong>Reason:</strong> ${reasons[bottleneck] || reasons['Security']}`;
}

function updateCharts() {
  updateBurndownChart();
  updateBudgetChart();
  updateCashflowChart();
}

function updateBurndownChart() {
  const canvas = document.getElementById('burndownChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (burndownChart) {
    burndownChart.destroy();
  }
  
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  
  // Simulate burn-down
  let nowRemaining = 2, soonRemaining = 5, laterRemaining = 4, holdRemaining = 1;
  const nowData = [], soonData = [], laterData = [], holdData = [];
  
  months.forEach((m, i) => {
    if (i < 2 && nowRemaining > 0) nowRemaining -= 0.5;
    else if (i < 5 && soonRemaining > 0) soonRemaining -= 0.8;
    else if (i < 9 && laterRemaining > 0) laterRemaining -= 0.6;
    else if (holdRemaining > 0) holdRemaining -= 0.2;
    
    nowData.push(Math.max(0, nowRemaining));
    soonData.push(Math.max(0, soonRemaining));
    laterData.push(Math.max(0, laterRemaining));
    holdData.push(Math.max(0, holdRemaining));
  });
  
  burndownChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Migrate Now',
          data: nowData,
          backgroundColor: 'rgba(30, 134, 92, 0.3)',
          borderColor: '#1E865C',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Migrate Soon',
          data: soonData,
          backgroundColor: 'rgba(253, 185, 19, 0.3)',
          borderColor: '#FDB913',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Migrate Later',
          data: laterData,
          backgroundColor: 'rgba(255, 152, 0, 0.3)',
          borderColor: '#FF9800',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Hold',
          data: holdData,
          backgroundColor: 'rgba(224, 62, 54, 0.3)',
          borderColor: '#E03E36',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'RFPs Remaining' }
        },
        x: {
          title: { display: true, text: 'Month' }
        }
      },
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: false }
      }
    }
  });
}

function updateBudgetChart() {
  const canvas = document.getElementById('budgetChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (budgetChart) {
    budgetChart.destroy();
  }
  
  budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Security Remediation', 'Compliance Assessment', 'Infrastructure/Cloud', 'Overhead'],
      datasets: [{
        data: [state.securityPct, state.compliancePct, state.infraPct, state.overheadPct],
        backgroundColor: ['#6B46C1', '#FDB913', '#1E865C', '#626C7C']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' }
      }
    }
  });
}

function updateCashflowChart() {
  const canvas = document.getElementById('cashflowChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (cashflowChart) {
    cashflowChart.destroy();
  }
  
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  let cumulative = 0;
  const spendData = months.map((m, i) => {
    cumulative += (state.budget / 12) * (0.8 + Math.random() * 0.4);
    return Math.round(cumulative);
  });
  
  cashflowChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Cumulative Spend',
          data: spendData,
          backgroundColor: 'rgba(107, 70, 193, 0.1)',
          borderColor: '#6B46C1',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Available Budget',
          data: Array(12).fill(state.budget),
          borderColor: '#E03E36',
          borderDash: [5, 5],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + (value / 1000) + 'K';
            }
          }
        }
      },
      plugins: {
        legend: { display: true, position: 'top' }
      }
    }
  });
}

function resetDefaults() {
  document.getElementById('securitySlider').value = 2;
  document.getElementById('complianceSlider').value = 2;
  document.getElementById('infraSlider').value = 1;
  document.getElementById('pmSlider').value = 1;
  document.getElementById('budgetInput').value = 500000;
  document.getElementById('horizonSlider').value = 12;
  document.getElementById('effortNow').value = 4;
  document.getElementById('effortSoon').value = 8;
  document.getElementById('effortLater').value = 12;
  document.getElementById('effortHold').value = 16;
  document.getElementById('holidayDowntime').checked = true;
  document.getElementById('concurrentSupport').checked = true;
  document.getElementById('learningCurve').checked = true;
  document.getElementById('securityPctSlider').value = 40;
  document.getElementById('compliancePctSlider').value = 30;
  document.getElementById('infraPctSlider').value = 20;
  document.getElementById('overheadPctSlider').value = 10;
  
  updateCapacity();
  updateBudgetAllocation();
}

function generateScenario() {
  alert('Scenario generated with current parameters!\n\nAll calculations have been updated based on your inputs. Review the KPI cards, charts, and tables for insights.');
}

function toggleScenario(num) {
  const content = document.getElementById('scenario' + num);
  const arrow = document.getElementById('arrow' + num);
  
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    arrow.classList.remove('expanded');
  } else {
    content.classList.add('expanded');
    arrow.classList.add('expanded');
  }
}

function applyScenario(num) {
  if (num === 1) {
    document.getElementById('securitySlider').value = 3;
    alert('Applied: Add 1 Security Engineer\n\nTimeline reduced by 8 weeks. New completion: Q1 2026.');
  } else if (num === 2) {
    document.getElementById('budgetInput').value = 600000;
    alert('Applied: Increase Budget by 20%\n\nNew budget: $600K. Can hire 1 contractor FTE.');
  } else if (num === 3) {
    alert('Applied: Accelerate High-Priority RFPs Only\n\nFocusing on Migrate Now/Soon tiers. Core portfolio complete by Q4 2025.');
  }
  updateCapacity();
}

function hireContractor() {
  alert('Hire Contractor\n\nOpening scenario: +1 Security Engineer (6-month contract)\nCost: $120K\nTimeline impact: -8 weeks');
  document.getElementById('securitySlider').value = 3;
  updateCapacity();
}

function deferMigrations() {
  alert('Defer Migrations\n\nThis would move 2 "Migrate Later" RFPs to next cycle, freeing 2 weeks of immediate capacity.');
}

function outsourceFunction() {
  alert('Outsource Function\n\nConsider outsourcing compliance reviews ($60K) to shift internal resources to security remediation.');
}

function sortTable(col) {
  alert('Sort functionality would order table by column ' + col + ' (ascending/descending toggle).');
}

function exportStaffingPlan() {
  alert('Export Staffing Plan (PDF)\n\nGenerating recruitment document...\n\nWould include:\n• Recommended headcount by role\n• Hire dates and timelines\n• Cost breakdown (annual + incremental)\n• Skills and qualifications\n• Hiring priority ranking\n\nThis feature requires a PDF generation library in production.');
}

function exportBudgetForecast() {
  const csvData = `Month,Security,Compliance,Infrastructure,PM,Overhead,Total\n` +
    `Nov 2025,${state.budget * 0.4 / 12},${state.budget * 0.3 / 12},${state.budget * 0.2 / 12},${state.budget * 0.05 / 12},${state.budget * 0.05 / 12},${state.budget / 12}\n` +
    `Dec 2025,${state.budget * 0.4 / 12},${state.budget * 0.3 / 12},${state.budget * 0.2 / 12},${state.budget * 0.05 / 12},${state.budget * 0.05 / 12},${state.budget / 12}\n`;
  
  downloadFile(csvData, 'budget_forecast.csv', 'text/csv');
  alert('Budget Forecast exported to CSV!\n\nOpening download...');
}

function exportTimeline() {
  let csvData = 'RFP,Classification,Weeks,Start,End,Cost\n';
  rfps.forEach((rfp, i) => {
    const weeks = Math.ceil(rfp.hours / 40);
    csvData += `"${rfp.name}",${rfp.tier},${weeks},Q${Math.ceil((i + 1) / 3)} 2025,Q${Math.ceil((i + 3) / 3)} 2026,$${Math.round((rfp.hours * 100) / 1000)}K\n`;
  });
  
  downloadFile(csvData, 'migration_timeline.csv', 'text/csv');
  alert('Timeline exported to CSV!\n\nOpening download...');
}

function generateExecutiveSummary() {
  alert('Generate Executive Summary\n\nCreating 1-page board summary...\n\nWould include:\n• Capacity forecast (quarterly)\n• Recommended staffing changes\n• Budget requirements\n• Timeline to completion\n• Key risks and mitigations\n• Board approval items\n\nThis feature requires a document generation library in production.');
}



// Helper function to download file
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

// Make functions globally accessible
window.updateCapacity = updateCapacity;
window.updateBudgetAllocation = updateBudgetAllocation;
window.resetDefaults = resetDefaults;
window.generateScenario = generateScenario;
window.toggleScenario = toggleScenario;
window.applyScenario = applyScenario;
window.hireContractor = hireContractor;
window.deferMigrations = deferMigrations;
window.outsourceFunction = outsourceFunction;
window.sortTable = sortTable;
window.exportStaffingPlan = exportStaffingPlan;
window.exportBudgetForecast = exportBudgetForecast;
window.exportTimeline = exportTimeline;
window.generateExecutiveSummary = generateExecutiveSummary;

// Initialize on load
function init() {
  console.log('Resource Capacity & Budget Planner initialized');
  console.log('Default staffing: 6 FTEs');
  console.log('Budget: $500K');
  console.log('Quarterly capacity: 3.2 RFPs');
  
  // Initial calculations
  updateCapacity();
  updateBudgetAllocation();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}