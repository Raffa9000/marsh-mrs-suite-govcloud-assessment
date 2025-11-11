// Power Automate Bridge & Orchestration Hub Application

// Orchestration flows data
const orchestrationFlows = [
  {
    id: 'FLOW-001',
    name: 'RFP Intake → Scoring Pipeline',
    icon: '📥',
    status: 'Active',
    trigger: 'New RFP added to SharePoint',
    steps: [
      'Extract RFP (PDF → text)',
      'Parse (Regex + LLM)',
      'Score MRS',
      'Assess NIST Controls',
      'Identify Flags/Disqualifiers',
      'Write to SharePoint',
      'Refresh Power BI',
      'Route to Leadership',
      'Create Planner Task'
    ],
    avg_duration: '2m 12s',
    success_rate: '99.6%',
    last_run: '2025-11-11T14:32:00Z',
    executions: [
      { run: 5, started: 'Nov 11, 14:32', duration: '2m 15s', status: 'Success', rfp: 'CMS Medicare', result: 'MRS: 4.5, Migrate Soon' },
      { run: 4, started: 'Nov 11, 13:05', duration: '1m 48s', status: 'Success', rfp: 'DOD Logistics', result: 'MRS: 4.5, Migrate Now' },
      { run: 3, started: 'Nov 10, 15:22', duration: '2m 02s', status: 'Success', rfp: 'VA Medical', result: 'MRS: 4.9, Migrate Now' },
      { run: 2, started: 'Nov 10, 09:15', duration: '1m 55s', status: 'Success', rfp: 'Federal Student Aid', result: 'MRS: 4.3, Migrate Soon' },
      { run: 1, started: 'Nov 9, 16:40', duration: '2m 10s', status: 'Success', rfp: 'County Health', result: 'MRS: 2.7, Migrate Later' }
    ]
  },
  {
    id: 'FLOW-002',
    name: 'Leadership Review Routing',
    icon: '👥',
    status: 'Active',
    trigger: 'MRS score ready for review',
    steps: [
      'Create Teams message',
      'Mention reviewer',
      'Create Planner task',
      'Wait for approval',
      'Log decision'
    ],
    avg_duration: 'variable (awaits human)',
    success_rate: '100%',
    last_run: '2025-11-10T10:15:00Z',
    executions: []
  },
  {
    id: 'FLOW-003',
    name: 'Contract Renewal Alert & Re-Score',
    icon: '🔄',
    status: 'Active',
    trigger: 'Contract renewal date within 30 days',
    steps: [
      'Detect renewal date',
      'Alert compliance officer',
      'Trigger MRS re-evaluation',
      'Create Planner task',
      'Post to Teams'
    ],
    avg_duration: '1m 45s',
    success_rate: '98.5%',
    last_run: '2025-11-09T08:00:00Z',
    executions: []
  },
  {
    id: 'FLOW-004',
    name: 'Evidence Pack Generation',
    icon: '📋',
    status: 'Active',
    trigger: 'Evidence pack requested or decision approved',
    steps: [
      'Compile assessment data',
      'Generate PDF report',
      'Create ZIP archive',
      'Upload to SharePoint',
      'Notify team'
    ],
    avg_duration: '3m 30s',
    success_rate: '100%',
    last_run: '2025-11-11T12:45:00Z',
    executions: []
  },
  {
    id: 'FLOW-005',
    name: 'Power BI Dataset Refresh',
    icon: '📊',
    status: 'Active',
    trigger: 'RFP assessment complete or MRS updated',
    steps: [
      'Extract latest RFP data',
      'Refresh BI dataset',
      'Update dashboards',
      'Alert viewers'
    ],
    avg_duration: '1m 15s',
    success_rate: '99.8%',
    last_run: '2025-11-11T15:00:00Z',
    executions: []
  },
  {
    id: 'FLOW-006',
    name: 'Planner Task Assignment & Escalation',
    icon: '✅',
    status: 'Active',
    trigger: 'Blocker identified or decision requires action',
    steps: [
      'Create Planner task',
      'Assign owner',
      'Set due date',
      'Add to bucket',
      'Escalate if overdue'
    ],
    avg_duration: '45s',
    success_rate: '100%',
    last_run: '2025-11-11T09:30:00Z',
    executions: []
  },
  {
    id: 'FLOW-007',
    name: 'Teams Channel Notifications',
    icon: '💬',
    status: 'Active',
    trigger: 'High-priority RFP flagged or decision made',
    steps: [
      'Compose decision card',
      'Post to Teams',
      'Mention stakeholders',
      'Include decision link'
    ],
    avg_duration: '30s',
    success_rate: '100%',
    last_run: '2025-11-11T14:32:00Z',
    executions: []
  },
  {
    id: 'FLOW-008',
    name: 'AuditBoard Integration',
    icon: '🔐',
    status: 'Inactive',
    trigger: 'Evidence pack ready for compliance review',
    steps: [
      'Create AuditBoard artifact',
      'Link controls',
      'Attach evidence',
      'Notify auditors'
    ],
    avg_duration: '2m 00s',
    success_rate: 'N/A',
    last_run: null,
    note: 'Requires AuditBoard API configuration',
    executions: []
  }
];

// Application state
let state = {
  flows: orchestrationFlows,
  selectedFlow: null,
  currentTab: 'pipeline'
};

// Initialize application
function init() {
  console.log('Power Automate Bridge initialized');
  renderFlowsList();
}

// Render flows list
function renderFlowsList() {
  const flowsList = document.getElementById('flowsList');
  
  let html = '';
  state.flows.forEach((flow, index) => {
    const statusClass = flow.status === 'Active' ? 'active' : 'inactive';
    const lastRun = flow.last_run ? formatDateTime(flow.last_run) : 'Never';
    
    html += `
      <div class="flow-item ${state.selectedFlow && state.selectedFlow.id === flow.id ? 'selected' : ''}" onclick="selectFlow('${flow.id}')">
        <div class="flow-header">
          <span class="flow-icon">${flow.icon}</span>
          <span class="flow-name">${flow.name}</span>
          <span class="flow-status-badge ${statusClass}">✓</span>
        </div>
        <div class="flow-meta">Last run: ${lastRun}</div>
        <div class="flow-trigger">Trigger: ${flow.trigger}</div>
      </div>
    `;
  });
  
  flowsList.innerHTML = html;
}

// Select flow
function selectFlow(flowId) {
  state.selectedFlow = state.flows.find(f => f.id === flowId);
  renderFlowsList();
  renderWorkflowDiagram();
  renderExecutionTimeline();
  renderFlowDetails();
}



// Switch tab
function switchTab(tabName) {
  state.currentTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tab-btn:nth-child(${getTabIndex(tabName)})`).classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
  document.getElementById(`tab${capitalize(tabName)}`).classList.remove('hidden');
  
  // Render tab-specific content
  if (tabName === 'allflows') renderAllFlowsTable();
  if (tabName === 'teams') renderTeamsIntegration();
  if (tabName === 'powerbi') renderPowerBIIntegration();
  if (tabName === 'errors') renderErrorLogs();
}

function getTabIndex(tabName) {
  const tabs = ['pipeline', 'allflows', 'teams', 'powerbi', 'errors'];
  return tabs.indexOf(tabName) + 1;
}

function capitalize(str) {
  if (str === 'pipeline') return 'Pipeline';
  if (str === 'allflows') return 'AllFlows';
  if (str === 'teams') return 'Teams';
  if (str === 'powerbi') return 'PowerBI';
  if (str === 'errors') return 'Errors';
  return str;
}

// Render workflow diagram
function renderWorkflowDiagram() {
  const diagram = document.getElementById('workflowDiagram');
  const flow = state.selectedFlow;
  
  if (!flow) {
    diagram.innerHTML = '<div class="preview-placeholder"><p>Select a flow from the left pane to view diagram and execution details</p></div>';
    return;
  }
  
  let stepsHTML = '';
  flow.steps.forEach((step, index) => {
    stepsHTML += `<div class="diagram-step">${flow.icon} ${step}</div>`;
  });
  
  const html = `
    <div class="diagram-container">
      <div class="diagram-title">${flow.name.toUpperCase()}</div>
      <div class="diagram-steps">
        ${stepsHTML}
      </div>
    </div>
  `;
  
  diagram.innerHTML = html;
}

// Render execution timeline
function renderExecutionTimeline() {
  const timeline = document.getElementById('executionTimeline');
  const flow = state.selectedFlow;
  
  if (!flow || flow.executions.length === 0) {
    timeline.classList.add('hidden');
    return;
  }
  
  timeline.classList.remove('hidden');
  
  let tableHTML = `
    <table class="timeline-table">
      <thead>
        <tr>
          <th>Run #</th>
          <th>Started</th>
          <th>Duration</th>
          <th>Status</th>
          <th>RFP</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  flow.executions.forEach(exec => {
    tableHTML += `
      <tr>
        <td>${exec.run}</td>
        <td>${exec.started}</td>
        <td>${exec.duration}</td>
        <td>✓ ${exec.status}</td>
        <td>${exec.rfp}</td>
        <td>${exec.result}</td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  document.getElementById('timelineTable').innerHTML = tableHTML;
  
  const statsHTML = `
    <div class="stat-card">
      <div class="stat-label">Avg Execution Time</div>
      <div class="stat-value">${flow.avg_duration}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Success Rate</div>
      <div class="stat-value">${flow.success_rate}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Runs (30d)</div>
      <div class="stat-value">247</div>
    </div>
  `;
  
  document.getElementById('latencyStats').innerHTML = statsHTML;
}

// Render flow details in right pane
function renderFlowDetails() {
  const detailsDiv = document.getElementById('flowDetails');
  const flow = state.selectedFlow;
  
  if (!flow) {
    detailsDiv.innerHTML = '<div class="preview-placeholder"><p>Select a flow to view configuration and monitoring details</p></div>';
    return;
  }
  
  let actionsHTML = '';
  flow.steps.forEach((step, index) => {
    actionsHTML += `
      <div class="action-item">
        <span>${index + 1}. ${step}</span>
        <div class="toggle"></div>
      </div>
    `;
  });
  
  const html = `
    <div class="detail-section">
      <h4>Flow Overview</h4>
      <div class="detail-row">
        <span class="detail-label">Flow Name:</span>
        <span class="detail-value">${flow.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Owner:</span>
        <span class="detail-value">Compliance Automation Team</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status:</span>
        <span class="detail-value">✓ ${flow.status}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Last Run:</span>
        <span class="detail-value">${flow.last_run ? formatDateTime(flow.last_run) : 'Never'}</span>
      </div>
    </div>
    
    <div class="detail-section">
      <h4>Trigger Configuration</h4>
      <div class="detail-row">
        <span class="detail-label">Trigger:</span>
        <span class="detail-value">${flow.trigger}</span>
      </div>
      <button class="btn btn--secondary btn--full-width" style="margin-top: 8px;" onclick="testTrigger()">Test Trigger</button>
    </div>
    
    <div class="detail-section">
      <h4>Actions &amp; Connectors</h4>
      <div class="action-list">
        ${actionsHTML}
      </div>
    </div>
    
    <div class="detail-section">
      <h4>Health &amp; Statistics (last 30 days)</h4>
      <div class="detail-row">
        <span class="detail-label">Total runs:</span>
        <span class="detail-value">247</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Successful:</span>
        <span class="detail-value">246 (99.6%)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Failed:</span>
        <span class="detail-value">1 (0.4%)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Avg duration:</span>
        <span class="detail-value">${flow.avg_duration}</span>
      </div>
      <div class="health-chart">📊 Success rate chart would appear here</div>
    </div>
    
    <div class="detail-section">
      <h4>Manual Trigger</h4>
      <button class="btn btn--primary btn--full-width btn--lg" onclick="runFlowManually()">Run Flow Manually</button>
    </div>
  `;
  
  detailsDiv.innerHTML = html;
}

// Render all flows table
function renderAllFlowsTable() {
  const tableDiv = document.getElementById('allFlowsTable');
  
  let html = `
    <table class="timeline-table">
      <thead>
        <tr>
          <th>Flow Name</th>
          <th>Status</th>
          <th>Trigger</th>
          <th>Last Run</th>
          <th>Success Rate</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  state.flows.forEach(flow => {
    html += `
      <tr onclick="selectFlow('${flow.id}'); switchTab('pipeline');">
        <td>${flow.icon} ${flow.name}</td>
        <td>✓ ${flow.status}</td>
        <td style="font-size: 11px;">${flow.trigger}</td>
        <td>${flow.last_run ? formatDateTime(flow.last_run) : 'Never'}</td>
        <td>${flow.success_rate}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  tableDiv.innerHTML = html;
}

// Render Teams integration
function renderTeamsIntegration() {
  const teamsDiv = document.getElementById('teamsIntegration');
  
  const html = `
    <div class="detail-section">
      <h4>Connected Teams Channels</h4>
      <div class="action-item">
        <span><strong>#GovCloud-Decisions</strong><br><small>Receives decision summaries (247 messages, last 30 days)</small></span>
      </div>
      <div class="action-item">
        <span><strong>#GovCloud-Alerts</strong><br><small>Receives urgent flags (15 messages, last 30 days)</small></span>
      </div>
      <div class="action-item">
        <span><strong>#Compliance-Escalations</strong><br><small>Receives blockers (8 messages, last 30 days)</small></span>
      </div>
      <button class="btn btn--secondary btn--full-width" style="margin-top: 12px;" onclick="addChannel()">Add Channel</button>
    </div>
  `;
  
  teamsDiv.innerHTML = html;
}

// Render Power BI integration
function renderPowerBIIntegration() {
  const biDiv = document.getElementById('powerBIIntegration');
  
  const html = `
    <div class="detail-section">
      <h4>Connected Power BI Datasets</h4>
      <div class="action-item">
        <span><strong>GovCloud Migration Portfolio</strong><br><small>Last refresh: Nov 11, 15:00 (auto-triggered) • Status: ✓ In sync</small></span>
      </div>
      <button class="btn btn--secondary btn--full-width" style="margin-top: 12px;" onclick="alert('Opening MRS Portfolio Dashboard...')">View MRS Portfolio Dashboard</button>
      <button class="btn btn--secondary btn--full-width" style="margin-top: 8px;" onclick="alert('Opening Gap Analysis Dashboard...')">View Gap Analysis Dashboard</button>
      <button class="btn btn--secondary btn--full-width" style="margin-top: 8px;" onclick="alert('Opening Steering Dashboard...')">View Steering Committee Dashboard</button>
    </div>
  `;
  
  biDiv.innerHTML = html;
}

// Render error logs
function renderErrorLogs() {
  const errorsDiv = document.getElementById('errorLogs');
  
  const html = `
    <table class="timeline-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Flow</th>
          <th>Step</th>
          <th>Error</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Nov 10, 16:22</td>
          <td>RFP Intake</td>
          <td>Refresh Power BI</td>
          <td>Timeout</td>
          <td>✓ Resolved</td>
        </tr>
        <tr>
          <td>Nov 9, 13:45</td>
          <td>Leadership Review</td>
          <td>Create Teams message</td>
          <td>Failed</td>
          <td>⚠ Escalated</td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn--secondary" style="margin-top: 16px;" onclick="alert('Downloading error log as CSV...')">Export Error Log</button>
  `;
  
  errorsDiv.innerHTML = html;
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${months[date.getMonth()]} ${date.getDate()}, ${hours}:${mins}`;
}

// Quick action functions
function viewAllFlows() {
  switchTab('allflows');
}

function testFlow() {
  if (!state.selectedFlow) {
    alert('Please select a flow first');
    return;
  }
  alert(`Testing Flow: ${state.selectedFlow.name}\n\nThis would run a dry-run simulation of the flow with test data.`);
}

function flowHealthReport() {
  alert('Flow Health Report\n\n✓ 7 flows active\n⚠ 1 flow inactive\n🔴 0 flows failed\n\nOverall health: 99.6% success rate across all flows (last 30 days)\n\nSlowest flow: Evidence Pack Generation (3m 30s)\nFastest flow: Teams Notifications (30s)');
}

function configureNewFlow() {
  alert('Configure New Flow\n\nThis would open a wizard to create a custom Power Automate flow with:\n• Trigger selection\n• Action configuration\n• Connector mapping\n• Error handling setup');
}

function testTrigger() {
  if (!state.selectedFlow) return;
  alert(`Test Trigger: ${state.selectedFlow.trigger}\n\nThis would simulate the trigger event and show the flow execution in real-time.`);
}

function runFlowManually() {
  if (!state.selectedFlow) return;
  alert(`Running Flow Manually: ${state.selectedFlow.name}\n\nSelect RFP to process:\n1. VA Medical Center - Phoenix\n2. Federal Student Aid Office\n3. CMS Medicare Portal\n\nFlow will execute all ${state.selectedFlow.steps.length} steps in sequence.`);
}

function addChannel() {
  alert('Add Teams Channel\n\nEnter channel name to connect:\n(e.g., #GovCloud-Reviews, #Compliance-Updates)');
}



// Make functions globally accessible
window.selectFlow = selectFlow;
window.switchTab = switchTab;
window.viewAllFlows = viewAllFlows;
window.testFlow = testFlow;
window.flowHealthReport = flowHealthReport;
window.configureNewFlow = configureNewFlow;
window.testTrigger = testTrigger;
window.runFlowManually = runFlowManually;
window.addChannel = addChannel;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}