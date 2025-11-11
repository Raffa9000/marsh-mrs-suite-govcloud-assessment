// RFP Intake Analyzer Application

// Application state
let state = {
  sourceType: 'upload',
  extractionMethod: 'regex',
  file: null,
  extractedData: null,
  isExtracting: false
};

// Mock extracted data for demo
const mockExtractedData = {
  ClientName: {
    value: 'Veterans Affairs',
    evidence: 'Extracted from: RFP Title Section',
    confidence: 'High',
    confidenceScore: 95
  },
  Sector: {
    value: 'Federal',
    evidence: 'Extracted from: Agency language (Department of Veterans Affairs)',
    confidence: 'Medium',
    confidenceScore: 75
  },
  RegulatoryLanguage: {
    value: 'FedRAMP Required',
    evidence: 'Extracted from: Section 5.2.1 "Compliance Requirements"',
    confidence: 'High',
    confidenceScore: 90
  },
  ATOStatus: {
    value: 'In Progress (>75%)',
    evidence: 'Inferred from: Authorization language in contract terms',
    confidence: 'Medium',
    confidenceScore: 70
  },
  BusinessImpact: {
    value: 'Very High',
    evidence: 'Inferred from: Contract value ($150M) and strategic language',
    confidence: 'Medium',
    confidenceScore: 65
  },
  OperationalConstraints: {
    value: 'Low',
    evidence: 'Inferred from: 12-month timeline, adequate budget language',
    confidence: 'Medium',
    confidenceScore: 60
  },
  LegalFlexibility: {
    value: 'Conditional',
    evidence: 'Extracted from: Conditional award language in Section 7.3',
    confidence: 'Medium',
    confidenceScore: 75
  },
  Notes: {
    value: 'Conditional Award candidate; FedRAMP ATO required by 90 days post-award',
    evidence: 'Auto-populated with extraction metadata',
    confidence: 'High',
    confidenceScore: 85
  }
};

// Initialize
function init() {
  console.log('Marsh RFP Intake Analyzer initialized');
  
  // Setup drag and drop
  const uploadZone = document.getElementById('uploadZone');
  if (uploadZone) {
    uploadZone.addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });
    
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('active');
    });
    
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('active');
    });
    
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('active');
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFile(files[0]);
      } else {
        alert('Please upload a PDF file.');
      }
    });
  }
}

// Toggle source type
function toggleSource() {
  const selected = document.querySelector('input[name="source"]:checked').value;
  state.sourceType = selected;
  
  const uploadSection = document.getElementById('uploadSection');
  const urlSection = document.getElementById('urlSection');
  
  if (selected === 'upload') {
    uploadSection.classList.remove('hidden');
    urlSection.classList.add('hidden');
  } else {
    uploadSection.classList.add('hidden');
    urlSection.classList.remove('hidden');
  }
  
  // Reset file
  state.file = null;
  document.getElementById('filePreview').classList.add('hidden');
  document.getElementById('extractBtn').disabled = true;
}

// Update method description
function updateMethodDescription() {
  const selected = document.querySelector('input[name="method"]:checked').value;
  state.extractionMethod = selected;
  
  const description = document.getElementById('methodDescription');
  
  if (selected === 'regex') {
    description.textContent = 'Deterministic, repeatable, auditable. Best for standard RFP formats. Expected confidence: High (85%+) for standard formats.';
  } else {
    description.textContent = 'Regex anchors + LLM rationale. Better for messy/implicit requirements. Expected confidence: Very High (90%+) but includes LLM uncertainty. Slower (5-10s per RFP).';
  }
}

// Handle file selection
function handleFileSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
}

// Handle file
function handleFile(file) {
  if (file.type !== 'application/pdf') {
    alert('Please upload a PDF file.');
    return;
  }
  
  state.file = file;
  
  // Show file preview
  const preview = document.getElementById('filePreview');
  preview.classList.remove('hidden');
  preview.innerHTML = `
    <strong>${file.name}</strong><br>
    Size: ${(file.size / 1024).toFixed(2)} KB<br>
    Uploaded: ${new Date().toLocaleString()}
  `;
  
  // Enable extract button
  document.getElementById('extractBtn').disabled = false;
}

// Fetch from URL
function fetchFromUrl() {
  const url = document.getElementById('rfpUrl').value;
  
  if (!url) {
    alert('Please enter a URL.');
    return;
  }
  
  // Simulate fetching
  alert(`Fetching RFP from: ${url}\n\nIn production, this would:\n• Download the document\n• Calculate file hash\n• Store retrieval timestamp\n• Enable extraction`);
  
  // Mock file for demo
  state.file = { name: 'fetched-rfp.pdf', size: 245760, type: 'application/pdf' };
  document.getElementById('extractBtn').disabled = false;
}

// Extract RFP
function extractRFP() {
  if (!state.file) {
    alert('Please upload or fetch an RFP first.');
    return;
  }
  
  if (state.isExtracting) {
    return;
  }
  
  state.isExtracting = true;
  
  // Hide placeholder
  document.getElementById('placeholderMessage').classList.add('hidden');
  
  // Show progress
  const progressSection = document.getElementById('progressSection');
  progressSection.classList.remove('hidden');
  
  // Reset progress
  const progressFill = document.getElementById('progressFill');
  const progressStatus = document.getElementById('progressStatus');
  const progressMessage = document.getElementById('progressMessage');
  
  progressFill.style.width = '0%';
  progressStatus.textContent = 'Starting extraction...';
  progressMessage.classList.add('hidden');
  
  // Simulate extraction process
  const method = state.extractionMethod;
  const steps = method === 'regex' ? [
    { progress: 20, text: 'Fetching document...' },
    { progress: 45, text: 'Processing: Regex pass 45%...' },
    { progress: 75, text: 'Processing: Regex pass 75%...' },
    { progress: 100, text: 'Extraction complete!' }
  ] : [
    { progress: 15, text: 'Fetching document...' },
    { progress: 35, text: 'Processing: Regex pass 35%...' },
    { progress: 60, text: 'Processing: LLM validation 25%...' },
    { progress: 85, text: 'Processing: LLM validation 85%...' },
    { progress: 100, text: 'Extraction complete!' }
  ];
  
  let stepIndex = 0;
  const startTime = Date.now();
  
  const interval = setInterval(() => {
    if (stepIndex < steps.length) {
      const step = steps[stepIndex];
      progressFill.style.width = step.progress + '%';
      progressStatus.textContent = step.text;
      stepIndex++;
    } else {
      clearInterval(interval);
      
      // Show success message
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      progressMessage.classList.remove('hidden');
      progressMessage.classList.add('success');
      progressMessage.innerHTML = `✓ Extraction complete (${method === 'regex' ? 'Regex-Only' : 'Regex + LLM'}, ${duration}s)`;
      
      // Show extraction results
      showExtractionResults();
      
      state.isExtracting = false;
    }
  }, method === 'regex' ? 600 : 800);
}

// Show extraction results
function showExtractionResults() {
  // Show extraction complete section
  document.getElementById('extractionComplete').classList.remove('hidden');
  
  // Populate metadata
  const method = state.extractionMethod === 'regex' ? 'Regex-Only' : 'Regex + LLM Validate';
  const version = state.extractionMethod === 'regex' ? 'Intake-1.0-regex' : 'Intake-1.0-hybrid';
  
  document.getElementById('metaHash').textContent = 'sha256:a3f8d9...';
  document.getElementById('metaSource').textContent = state.file.name;
  document.getElementById('metaTimestamp').textContent = new Date().toISOString();
  document.getElementById('metaMethod').textContent = method;
  document.getElementById('metaVersion').textContent = version;
  document.getElementById('metaConfidence').textContent = 'High (84%)';
  
  // Show preview text
  document.getElementById('previewText').textContent = `REQUEST FOR PROPOSAL\n\nDepartment of Veterans Affairs\nVA Medical Center - Phoenix\n\nProject: Healthcare IT System Migration to FedRAMP-Compliant Cloud\n\nSection 1: Introduction\nThe Department of Veterans Affairs (VA) seeks proposals for migration of existing healthcare IT systems to a FedRAMP-compliant cloud environment...\n\nSection 5.2.1: Compliance Requirements\nAll systems must achieve FedRAMP Moderate authorization prior to production deployment. Vendor must demonstrate current ATO progress...\n\n[Additional 450 characters truncated]`;
  
  // Populate extracted fields
  state.extractedData = mockExtractedData;
  renderExtractedFields();
}

// Render extracted fields
function renderExtractedFields() {
  const container = document.getElementById('extractedFields');
  
  const fieldLabels = {
    ClientName: 'Client Organization Name',
    Sector: 'Sector',
    RegulatoryLanguage: 'Regulatory Requirement',
    ATOStatus: 'Current ATO Status',
    BusinessImpact: 'Business Impact',
    OperationalConstraints: 'Operational Constraints',
    LegalFlexibility: 'Legal Flexibility',
    Notes: 'Additional Notes'
  };
  
  const fieldTypes = {
    ClientName: 'text',
    Sector: 'select',
    RegulatoryLanguage: 'text',
    ATOStatus: 'text',
    BusinessImpact: 'select',
    OperationalConstraints: 'select',
    LegalFlexibility: 'select',
    Notes: 'textarea'
  };
  
  const selectOptions = {
    Sector: ['Federal', 'State', 'Healthcare', 'Defense'],
    BusinessImpact: ['Low', 'Medium', 'High', 'Very High'],
    OperationalConstraints: ['Low', 'Moderate', 'High'],
    LegalFlexibility: ['Yes', 'No', 'Conditional']
  };
  
  let html = '';
  
  Object.keys(state.extractedData).forEach(fieldName => {
    const data = state.extractedData[fieldName];
    const label = fieldLabels[fieldName];
    const type = fieldTypes[fieldName];
    
    const confidenceClass = data.confidence.toLowerCase().replace(' ', '-');
    
    html += `
      <div class="field-group">
        <div class="field-header">
          <label class="form-label">${label}</label>
          <span class="edit-icon" onclick="editField('${fieldName}')" title="Edit">✏️</span>
        </div>
        <div class="field-value" id="value_${fieldName}">${data.value}</div>
        <div class="field-evidence">${data.evidence}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
          <span style="font-size: 11px; color: #626C7C;">Confidence:</span>
          <span class="confidence-badge confidence-${confidenceClass}">${data.confidence} (${data.confidenceScore}%)</span>
        </div>
        <div id="edit_${fieldName}" class="hidden" style="margin-top: 12px;">
          ${type === 'textarea' ? 
            `<textarea class="form-control" id="input_${fieldName}" rows="3">${data.value}</textarea>` :
            type === 'select' ? 
            `<select class="form-control" id="input_${fieldName}">${selectOptions[fieldName].map(opt => `<option value="${opt}" ${opt === data.value ? 'selected' : ''}>${opt}</option>`).join('')}</select>` :
            `<input type="text" class="form-control" id="input_${fieldName}" value="${data.value}">`
          }
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button class="btn btn--primary btn--sm" onclick="saveField('${fieldName}')">Save</button>
            <button class="btn btn--secondary btn--sm" onclick="cancelEdit('${fieldName}')">Cancel</button>
          </div>
        </div>
      </div>
    `;
  });
  
  // Add validation status
  html += `
    <div class="validation-status valid" id="validationStatus">
      <span>✓</span>
      <span>All required fields populated</span>
    </div>
  `;
  
  // Add flags section
  html += `
    <div class="flags-section">
      <h4 style="color: var(--marsh-indigo);">Extraction Flags</h4>
      <div class="flag-banner green" id="flagBanner">
        ✓ HIGH CONFIDENCE EXTRACTION
      </div>
    </div>
  `;
  
  // Add bottom actions
  html += `
    <div class="bottom-actions">
      <button class="btn btn--primary btn--lg" onclick="saveToSharePoint()" style="flex: 1;">
        Confirm &amp; Save to SharePoint
      </button>
    </div>
    <div style="display: flex; gap: 12px; margin-top: 12px;">
      <button class="btn btn--secondary" onclick="exportJSON()" style="flex: 1;">
        Export as JSON
      </button>
      <button class="btn btn--secondary" onclick="editAndResubmit()" style="flex: 1;">
        Edit &amp; Resubmit
      </button>
    </div>
  `;
  
  container.innerHTML = html;
}

// Edit field
function editField(fieldName) {
  document.getElementById(`value_${fieldName}`).classList.add('hidden');
  document.getElementById(`edit_${fieldName}`).classList.remove('hidden');
}

// Cancel edit
function cancelEdit(fieldName) {
  document.getElementById(`value_${fieldName}`).classList.remove('hidden');
  document.getElementById(`edit_${fieldName}`).classList.add('hidden');
}

// Save field
function saveField(fieldName) {
  const inputElement = document.getElementById(`input_${fieldName}`);
  const newValue = inputElement.value;
  
  // Update state
  state.extractedData[fieldName].value = newValue;
  
  // Update display
  document.getElementById(`value_${fieldName}`).textContent = newValue;
  
  // Hide edit, show value
  cancelEdit(fieldName);
  
  // Update validation status
  const flagBanner = document.getElementById('flagBanner');
  flagBanner.className = 'flag-banner amber';
  flagBanner.innerHTML = '⚠ Manual overrides applied';
}

// Save to SharePoint
function saveToSharePoint() {
  const data = {};
  Object.keys(state.extractedData).forEach(key => {
    data[key] = state.extractedData[key].value;
  });
  
  // Simulate save
  alert(`✓ RFP saved to SharePoint!\n\nRecord ID: GovCloud_Intake_2025_001\n\nData:\n${JSON.stringify(data, null, 2)}\n\nAudit trail created with:\n• Extraction metadata\n• Confidence scores\n• Timestamp: ${new Date().toISOString()}\n• Method: ${state.extractionMethod}\n\nIn production, this would:\n1. Validate all 8 canonical fields\n2. Write to SharePoint list "GovCloud_Intake"\n3. Create audit record in "RFP_Extraction_Log"\n4. Trigger Power Automate to refresh MRS Dashboard`);
  
  // Reset for next RFP
  setTimeout(() => {
    if (confirm('RFP saved successfully! Reset form for next extraction?')) {
      resetForm();
    }
  }, 500);
}

// Export JSON
function exportJSON() {
  const exportData = {
    extraction_id: 'uuid-' + Date.now(),
    timestamp: new Date().toISOString(),
    source_type: state.sourceType,
    source_file: state.file.name,
    file_hash: 'sha256:a3f8d9...',
    extraction_method: state.extractionMethod,
    extraction_tool_version: state.extractionMethod === 'regex' ? 'Intake-1.0-regex' : 'Intake-1.0-hybrid',
    data: {},
    per_field_confidence: {},
    overall_confidence: 'High (84%)'
  };
  
  Object.keys(state.extractedData).forEach(key => {
    exportData.data[key] = state.extractedData[key].value;
    exportData.per_field_confidence[key] = `${state.extractedData[key].confidence} (${state.extractedData[key].confidenceScore}%)`;
  });
  
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rfp-extraction-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Extraction data exported as JSON!');
}

// Edit and resubmit
function editAndResubmit() {
  alert('Edit & Resubmit\n\nThis allows you to modify any field before saving.\n\nClick the edit icon (✏️) next to any field to make changes.');
}

// Reset form
function resetForm() {
  // Reset state
  state.file = null;
  state.extractedData = null;
  state.isExtracting = false;
  
  // Reset UI
  document.getElementById('fileInput').value = '';
  document.getElementById('filePreview').classList.add('hidden');
  document.getElementById('rfpUrl').value = '';
  document.getElementById('extractBtn').disabled = true;
  
  // Hide progress and results
  document.getElementById('progressSection').classList.add('hidden');
  document.getElementById('extractionComplete').classList.add('hidden');
  
  // Show placeholder
  document.getElementById('placeholderMessage').classList.remove('hidden');
  
  // Reset extracted fields
  document.getElementById('extractedFields').innerHTML = `
    <div style="text-align: center; padding: 40px 0; color: #626C7C;">
      Run extraction to populate fields
    </div>
  `;
  
  // Reset to default method
  document.querySelector('input[name="method"][value="regex"]').checked = true;
  updateMethodDescription();
}

// Make functions globally accessible
window.toggleSource = toggleSource;
window.updateMethodDescription = updateMethodDescription;
window.handleFileSelect = handleFileSelect;
window.fetchFromUrl = fetchFromUrl;
window.extractRFP = extractRFP;
window.editField = editField;
window.cancelEdit = cancelEdit;
window.saveField = saveField;
window.saveToSharePoint = saveToSharePoint;
window.exportJSON = exportJSON;
window.editAndResubmit = editAndResubmit;
window.resetForm = resetForm;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}