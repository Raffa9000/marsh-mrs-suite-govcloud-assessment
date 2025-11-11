// Evidence Pack Generator Application

// Sample RFP data for evidence pack generation
const sampleRFPs = [
  {
    id: 1,
    client_name: 'VA Medical Center - Phoenix',
    sector: 'Federal',
    mrs: 4.9,
    classification: 'Migrate Now',
    assessment_date: '2025-10-15',
    status: 'Approved',
    contract_value: 150000000,
    scores: {
      C: 5,
      R: 5,
      B: 5,
      O: 1,
      L: 5
    },
    controls_implemented: 318,
    controls_total: 325,
    gaps: 7,
    framework: 'FedRAMP Moderate'
  },
  {
    id: 2,
    client_name: 'Federal Student Aid Office',
    sector: 'Federal',
    mrs: 4.3,
    classification: 'Migrate Soon',
    assessment_date: '2025-10-20',
    status: 'Pending',
    contract_value: 87500000,
    scores: {
      C: 5,
      R: 4,
      B: 4,
      O: 2,
      L: 4
    },
    controls_implemented: 305,
    controls_total: 325,
    gaps: 20,
    framework: 'FedRAMP Moderate'
  },
  {
    id: 3,
    client_name: 'CMS Medicare Portal',
    sector: 'Federal',
    mrs: 4.5,
    classification: 'Migrate Soon',
    assessment_date: '2025-10-25',
    status: 'Approved',
    contract_value: 120000000,
    scores: {
      C: 5,
      R: 5,
      B: 4,
      O: 2,
      L: 5
    },
    controls_implemented: 312,
    controls_total: 325,
    gaps: 13,
    framework: 'CMS ARS'
  }
];

// Application state
let state = {
  rfps: sampleRFPs,
  selectedRFP: null,
  generationInProgress: false,
  generatedPacks: [
    {
      rfp_id: 1,
      client_name: 'VA Medical Center - Phoenix',
      format: 'PDF',
      size: '3.2 MB',
      generated: '2025-11-11T14:30:00Z',
      filename: 'VA_Medical_Center_Evidence_Pack_20251111.pdf'
    }
  ]
};

// Initialize application
function init() {
  console.log('Evidence Pack Generator initialized');
  renderPreviousPacks();
}

// Select RFP
function selectRFP() {
  const select = document.getElementById('rfpSelect');
  const rfpId = parseInt(select.value);
  
  if (!rfpId) {
    state.selectedRFP = null;
    document.getElementById('rfpBasicInfo').classList.add('hidden');
    document.getElementById('packPreview').innerHTML = '<div class="preview-placeholder"><p>Select an RFP to preview evidence pack structure</p></div>';
    document.getElementById('generateBtn').disabled = true;
    return;
  }
  
  state.selectedRFP = state.rfps.find(r => r.id === rfpId);
  renderRFPBasicInfo();
  renderPackPreview();
  document.getElementById('generateBtn').disabled = false;
}

// Render RFP basic info
function renderRFPBasicInfo() {
  const infoDiv = document.getElementById('rfpBasicInfo');
  const rfp = state.selectedRFP;
  
  if (!rfp) {
    infoDiv.classList.add('hidden');
    return;
  }
  
  infoDiv.classList.remove('hidden');
  infoDiv.innerHTML = `
    <div class="rfp-info-row">
      <span class="rfp-info-label">Sector:</span>
      <span class="rfp-info-value">${rfp.sector}</span>
    </div>
    <div class="rfp-info-row">
      <span class="rfp-info-label">MRS Score:</span>
      <span class="rfp-info-value">${rfp.mrs}</span>
    </div>
    <div class="rfp-info-row">
      <span class="rfp-info-label">Classification:</span>
      <span class="rfp-info-value">${rfp.classification}</span>
    </div>
    <div class="rfp-info-row">
      <span class="rfp-info-label">Assessment Date:</span>
      <span class="rfp-info-value">${formatDate(rfp.assessment_date)}</span>
    </div>
    <div class="rfp-info-row">
      <span class="rfp-info-label">Status:</span>
      <span class="rfp-info-value">${rfp.status}</span>
    </div>
  `;
}



// Render pack preview
function renderPackPreview() {
  const preview = document.getElementById('packPreview');
  const rfp = state.selectedRFP;
  
  if (!rfp) {
    preview.innerHTML = '<div class="preview-placeholder"><p>Select an RFP to preview evidence pack structure</p></div>';
    return;
  }
  
  const html = `
    <div class="preview-content">
      <div class="preview-header">
        <div class="preview-icon">📋</div>
        <div class="preview-title">
          <h3>EVIDENCE PACK: ${rfp.client_name}</h3>
          <div class="preview-subtitle">Regulatory Framework: ${rfp.framework}</div>
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">📄</span>
          <span class="preview-section-title">COVER PAGE</span>
        </div>
        <div class="preview-section-details">
          • Title: RFP Assessment Evidence Pack<br>
          • Client: ${rfp.client_name}<br>
          • Assessment Date: ${formatDate(rfp.assessment_date)}<br>
          • Generated: ${new Date().toISOString()}<br>
          • Regulatory Framework: ${rfp.framework}
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">📊</span>
          <span class="preview-section-title">EXECUTIVE SUMMARY (1 page)</span>
        </div>
        <div class="preview-section-details">
          • Assessment overview<br>
          • Overall MRS: ${rfp.mrs} (${rfp.classification})<br>
          • Key findings: Compliance ${rfp.scores.C}/5, Readiness ${rfp.scores.R}/5<br>
          • Strategic recommendation
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">📈</span>
          <span class="preview-section-title">MRS SCORING BREAKDOWN (2 pages)</span>
        </div>
        <div class="preview-section-details">
          • C Score: ${rfp.scores.C}/5 (Compliance Necessity)<br>
          • R Score: ${rfp.scores.R}/5 (Readiness)<br>
          • B Score: ${rfp.scores.B}/5 (Business Value)<br>
          • O Score: ${rfp.scores.O}/5 (Operational Friction)<br>
          • L Score: ${rfp.scores.L}/5 (Legal Flexibility)<br>
          <br>
          Calculation: (0.4×${rfp.scores.C}) + (0.25×${rfp.scores.R}) + (0.25×${rfp.scores.B}) - (0.1×${rfp.scores.O}) + (0.1×${rfp.scores.L}) = ${rfp.mrs}
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">🔒</span>
          <span class="preview-section-title">COMPLIANCE & CONTROLS ASSESSMENT (5 pages)</span>
        </div>
        <div class="preview-section-details">
          • NIST 800-53 Moderate Baseline (325 controls)<br>
          • Implementation summary: ${rfp.controls_implemented}/${rfp.controls_total} (${Math.round(rfp.controls_implemented/rfp.controls_total*100)}%)<br>
          • Gaps: ${rfp.gaps} controls, all on POA&M<br>
          • Evidence: References to control worksheets
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">✅</span>
          <span class="preview-section-title">DECISION & APPROVALS (2 pages)</span>
        </div>
        <div class="preview-section-details">
          • Migration Decision: ${rfp.classification.toUpperCase()}<br>
          • Decision Date: ${formatDate(rfp.assessment_date)}<br>
          • Status: ${rfp.status}<br>
          • Approval Chain: [Executive reviewers]<br>
          • Decision Rationale: 3-paragraph memo
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">📋</span>
          <span class="preview-section-title">AUDIT TRAIL (1 page)</span>
        </div>
        <div class="preview-section-details">
          • Assessment created: ${formatDate(rfp.assessment_date)}<br>
          • Controls mapped: ${formatDate(rfp.assessment_date)}<br>
          • Decision reviewed: ${formatDate(rfp.assessment_date)}<br>
          • Evidence bundle generated: ${new Date().toISOString().split('T')[0]}
        </div>
      </div>
      
      <div class="preview-section">
        <div class="preview-section-header">
          <span class="preview-section-icon">📎</span>
          <span class="preview-section-title">APPENDICES</span>
        </div>
        <div class="preview-section-details">
          • A: RFP Requirements Extraction<br>
          • B: Full Control Mapping Table<br>
          • C: MRS Scoring Methodology<br>
          • D: Confidence Scores & Extraction Method<br>
          • E: Regulatory Framework Alignment
        </div>
      </div>
    </div>
  `;
  
  preview.innerHTML = html;
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Generate evidence pack
function generateEvidencePack() {
  if (!state.selectedRFP || state.generationInProgress) return;
  
  state.generationInProgress = true;
  const statusDiv = document.getElementById('generationStatus');
  const successDiv = document.getElementById('generationSuccess');
  
  statusDiv.classList.remove('hidden');
  successDiv.classList.add('hidden');
  
  // Simulate generation steps
  const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (currentStep > 0) {
      const prevStep = document.getElementById(steps[currentStep - 1]);
      prevStep.classList.remove('active');
      prevStep.classList.add('complete');
      prevStep.querySelector('.step-check').classList.remove('hidden');
    }
    
    if (currentStep < steps.length) {
      const step = document.getElementById(steps[currentStep]);
      step.classList.add('active');
      currentStep++;
    } else {
      clearInterval(interval);
      completeGeneration();
    }
  }, 600);
}

function completeGeneration() {
  const statusDiv = document.getElementById('generationStatus');
  const successDiv = document.getElementById('generationSuccess');
  const rfp = state.selectedRFP;
  const format = document.querySelector('input[name="exportFormat"]:checked').value;
  
  // Hide status, show success
  statusDiv.classList.add('hidden');
  successDiv.classList.remove('hidden');
  
  // Generate filename based on format
  const clientSlug = rfp.client_name.replace(/ /g, '_').replace(/-/g, '_');
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  let filename = '';
  let size = '';
  
  switch(format) {
    case 'pdf':
      filename = `${clientSlug}_Evidence_Pack_${dateStr}.pdf`;
      size = '4.2 MB';
      break;
    case 'zip':
      filename = `${clientSlug}_Evidence_Pack_${dateStr}.zip`;
      size = '5.2 MB';
      break;
    case 'ppt':
      filename = `${clientSlug}_Leadership_Brief_${dateStr}.pptx`;
      size = '2.8 MB';
      break;
    case 'sharepoint':
      filename = `${clientSlug}/`;
      size = '5.2 MB (folder)';
      break;
  }
  
  const hash = 'sha256:a7f3c2e4d8b5f1a9c6e3b7d2f8a4c1e9...';
  const timestamp = new Date().toISOString();
  
  document.getElementById('packageName').textContent = filename;
  document.getElementById('packageSize').textContent = size;
  document.getElementById('packageTime').textContent = timestamp;
  document.getElementById('packageHash').textContent = hash;
  
  // Add to generated packs
  state.generatedPacks.unshift({
    rfp_id: rfp.id,
    client_name: rfp.client_name,
    format: format.toUpperCase(),
    size: size,
    generated: timestamp,
    filename: filename
  });
  
  renderPreviousPacks();
  state.generationInProgress = false;
}

// Preview pack
function previewPack() {
  if (!state.selectedRFP) {
    alert('Please select an RFP first');
    return;
  }
  alert('Preview: This would open a modal showing a detailed preview of the PDF structure with sample content from ' + state.selectedRFP.client_name);
}

// Save configuration
function saveConfig() {
  alert('Configuration Saved\n\nYour evidence pack settings have been saved and can be reused for future RFPs with similar requirements.');
}

// Download pack
function downloadPack() {
  const format = document.querySelector('input[name="exportFormat"]:checked').value;
  const rfp = state.selectedRFP;
  
  let formatName = '';
  switch(format) {
    case 'pdf': formatName = 'PDF'; break;
    case 'zip': formatName = 'ZIP Archive'; break;
    case 'ppt': formatName = 'PowerPoint Deck'; break;
    case 'sharepoint': formatName = 'SharePoint Folder'; break;
  }
  
  alert(`Downloading ${formatName}: ${document.getElementById('packageName').textContent}\n\nSize: ${document.getElementById('packageSize').textContent}\n\nIn production, this would trigger a file download.`);
}

// Upload to SharePoint
function uploadToSharePoint() {
  const rfp = state.selectedRFP;
  alert(`Upload to SharePoint\n\nDestination: SharePoint://Evidence_Packs/${rfp.client_name}/\n\nStatus: ✓ Upload successful\n\nAll files have been organized in SharePoint-compatible folder structure.`);
}

// Copy to AuditBoard
function copyToAuditBoard() {
  const rfp = state.selectedRFP;
  alert(`Copy to AuditBoard\n\nProject: ${rfp.client_name} Compliance Assessment\n\nStatus: ✓ Artifact created\n\nArtifact ID: AB-${rfp.id}-20251111\n\nEvidence pack linked to AuditBoard project.`);
}

// Render previous packs
function renderPreviousPacks() {
  const previousDiv = document.getElementById('previousPacks');
  const packsList = document.getElementById('packsList');
  
  if (state.generatedPacks.length === 0) {
    previousDiv.classList.add('hidden');
    return;
  }
  
  previousDiv.classList.remove('hidden');
  
  let html = '';
  state.generatedPacks.slice(0, 3).forEach((pack, index) => {
    html += `
      <div class="pack-item">
        <div class="pack-item-header">${pack.client_name} Evidence Pack</div>
        <div class="pack-item-meta">Generated ${formatDate(pack.generated.split('T')[0])} • ${pack.format} • ${pack.size}</div>
        <div class="pack-item-actions">
          <button class="btn btn--secondary btn--sm" onclick="redownloadPack(${index})">Download</button>
          <button class="btn btn--secondary btn--sm" onclick="regeneratePack(${pack.rfp_id})">Re-generate</button>
          <button class="btn btn--secondary btn--sm" onclick="deletePack(${index})">Delete</button>
        </div>
      </div>
    `;
  });
  
  packsList.innerHTML = html;
}

function redownloadPack(index) {
  const pack = state.generatedPacks[index];
  alert(`Downloading: ${pack.filename}\n\nSize: ${pack.size}\n\nGenerated: ${pack.generated}`);
}

function regeneratePack(rfpId) {
  document.getElementById('rfpSelect').value = rfpId;
  selectRFP();
  alert('RFP selected. Click "Generate Evidence Pack" to create a new version.');
}

function deletePack(index) {
  const pack = state.generatedPacks[index];
  if (confirm(`Delete evidence pack for ${pack.client_name}?`)) {
    state.generatedPacks.splice(index, 1);
    renderPreviousPacks();
  }
}



// Make functions globally accessible
window.selectRFP = selectRFP;
window.generateEvidencePack = generateEvidencePack;
window.previewPack = previewPack;
window.saveConfig = saveConfig;
window.downloadPack = downloadPack;
window.uploadToSharePoint = uploadToSharePoint;
window.copyToAuditBoard = copyToAuditBoard;
window.redownloadPack = redownloadPack;
window.regeneratePack = regeneratePack;
window.deletePack = deletePack;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}