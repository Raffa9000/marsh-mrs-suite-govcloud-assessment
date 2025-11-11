// Contract Events Monitor Application

// Sample contract data based on Nov 11, 2025
const sampleContracts = [
  {
    id: 1,
    client_name: 'VA Medical Center - Phoenix',
    contract_id: 'VA-2025-001-RENEWAL',
    renewal_date: '2025-11-20',
    event_type: 'Contract Renewal',
    contract_value: 12500000,
    sector: 'Federal',
    current_mrs: 4.9,
    current_classification: 'Migrate Now',
    urgency: 'CRITICAL',
    days_until: 9,
    status: 'Pending Review',
    renewal_type: 'Annual'
  },
  {
    id: 2,
    client_name: 'Federal Student Aid Office',
    contract_id: 'ED-2025-ATO-ANNIVERSARY',
    renewal_date: '2025-11-25',
    event_type: 'ATO Anniversary',
    contract_value: 8750000,
    sector: 'Federal',
    current_mrs: 4.3,
    current_classification: 'Migrate Soon',
    urgency: 'CRITICAL',
    days_until: 14,
    status: 'Pending Review',
    change_description: 'FedRAMP Moderate certification expires'
  },
  {
    id: 3,
    client_name: 'CMS Medicare Portal',
    contract_id: 'CMS-2025-SOW-ADDENDUM',
    renewal_date: '2026-01-15',
    event_type: 'SOW Addendum',
    contract_value: 15000000,
    sector: 'Federal',
    current_mrs: 4.5,
    current_classification: 'Migrate Soon',
    urgency: 'PLANNED',
    days_until: 65,
    status: 'Pending Review',
    change_description: 'New HIPAA requirement for expanded scope'
  },
  {
    id: 4,
    client_name: 'DOD Logistics System',
    contract_id: 'DOD-2026-REQUIREMENT-CHANGE',
    renewal_date: '2026-02-20',
    event_type: 'Requirement Change',
    contract_value: 18000000,
    sector: 'Defense',
    current_mrs: 4.5,
    current_classification: 'Migrate Now',
    urgency: 'PLANNED',
    days_until: 101,
    status: 'Pending Review',
    change_description: 'New IL5 mandate, stricter data residency'
  },
  {
    id: 5,
    client_name: 'County Health Dept - Miami',
    contract_id: 'COUNTY-2026-RENEWAL',
    renewal_date: '2026-03-01',
    event_type: 'Contract Renewal',
    contract_value: 5000000,
    sector: 'Healthcare',
    current_mrs: 2.7,
    current_classification: 'Migrate Later',
    urgency: 'VISIBILITY',
    days_until: 111,
    status: 'Pending Review',
    renewal_type: 'Multi-year extension'
  }
];

// Application state
let state = {
  contracts: sampleContracts,
  filteredContracts: [],
  selectedContract: null,
  filters: {
    eventTypes: ['Contract Renewal', 'SOW Addendum', 'Requirement Change', 'ATO Anniversary', 'Insurance/Compliance Audit'],
    timeWindow: 30,
    urgency: null
  }
};

// Initialize application
function init() {
  console.log('Contract Events Monitor initialized');
  renderCalendar();
  applyFilters();
  updateAlertBanner();
  updateStatusCounts();
}

// Render mini calendar
function renderCalendar() {
  const calendar = document.getElementById('miniCalendar');
  const now = new Date(2025, 10, 11); // Nov 11, 2025
  const month = now.getMonth();
  const year = now.getFullYear();
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let html = `
    <div class="calendar-header">
      <span>${monthNames[month]} ${year}</span>
    </div>
    <div class="calendar-grid">
      <div class="calendar-day-header">S</div>
      <div class="calendar-day-header">M</div>
      <div class="calendar-day-header">T</div>
      <div class="calendar-day-header">W</div>
      <div class="calendar-day-header">T</div>
      <div class="calendar-day-header">F</div>
      <div class="calendar-day-header">S</div>
  `;
  
  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day other-month"></div>';
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasEvents = state.contracts.some(c => c.renewal_date === dateStr);
    const isToday = day === 11;
    
    const classes = ['calendar-day'];
    if (isToday) classes.push('today');
    if (hasEvents) classes.push('has-events');
    
    html += `<div class="${classes.join(' ')}">${day}</div>`;
  }
  
  html += '</div>';
  calendar.innerHTML = html;
}

// Apply filters
function applyFilters() {
  const eventTypeCheckboxes = document.querySelectorAll('.event-filter');
  const timeWindowRadio = document.querySelector('input[name="timeWindow"]:checked');
  
  // Get selected event types
  state.filters.eventTypes = [];
  eventTypeCheckboxes.forEach(cb => {
    if (cb.checked) {
      state.filters.eventTypes.push(cb.dataset.type);
    }
  });
  
  // Get time window
  state.filters.timeWindow = timeWindowRadio ? timeWindowRadio.value : '30';
  
  // Filter contracts
  state.filteredContracts = state.contracts.filter(contract => {
    // Filter by event type
    if (!state.filters.eventTypes.includes(contract.event_type)) {
      return false;
    }
    
    // Filter by time window
    if (state.filters.timeWindow !== 'all') {
      const daysThreshold = parseInt(state.filters.timeWindow);
      if (contract.days_until > daysThreshold) {
        return false;
      }
    }
    
    // Filter by urgency (if set)
    if (state.filters.urgency && contract.urgency !== state.filters.urgency) {
      return false;
    }
    
    return true;
  });
  
  // Sort by days until (soonest first)
  state.filteredContracts.sort((a, b) => a.days_until - b.days_until);
  
  renderTimeline();
}

// Reset filters
function resetFilters() {
  // Reset checkboxes
  document.querySelectorAll('.event-filter').forEach(cb => cb.checked = true);
  
  // Reset radio
  document.querySelector('input[name="timeWindow"][value="30"]').checked = true;
  
  // Clear urgency filter
  state.filters.urgency = null;
  
  applyFilters();
}

// Filter by urgency
function filterByUrgency(urgency) {
  state.filters.urgency = urgency;
  applyFilters();
}

// Filter critical events
function filterCritical() {
  filterByUrgency('CRITICAL');
}

// Render timeline
function renderTimeline() {
  const timeline = document.getElementById('eventTimeline');
  const noEventsMsg = document.getElementById('noEventsMessage');
  
  if (state.filteredContracts.length === 0) {
    timeline.innerHTML = '';
    noEventsMsg.classList.remove('hidden');
    return;
  }
  
  noEventsMsg.classList.add('hidden');
  
  let html = '';
  state.filteredContracts.forEach(contract => {
    const urgencyClass = contract.urgency.toLowerCase();
    const classificationClass = contract.current_classification.toLowerCase().replace(/ /g, '-');
    const isSelected = state.selectedContract && state.selectedContract.id === contract.id;
    
    const eventIcons = {
      'Contract Renewal': '📅',
      'SOW Addendum': '✏️',
      'ATO Anniversary': '✓',
      'Requirement Change': '⚠️',
      'Insurance/Compliance Audit': '🔍'
    };
    
    html += `
      <div class="event-card ${isSelected ? 'selected' : ''}" onclick="selectEvent(${contract.id})">
        <div class="event-header">
          <div class="event-icon">${eventIcons[contract.event_type] || '📄'}</div>
          <div class="event-header-text">
            <div class="event-client">${contract.client_name}</div>
            <div class="event-type">${contract.event_type}</div>
          </div>
          <div class="event-date-badge ${urgencyClass}">
            Due ${formatDate(contract.renewal_date)} (${contract.days_until} days)
          </div>
        </div>
        
        <div class="event-content">
          <div class="event-detail-row">
            <span class="event-detail-label">Contract Reference:</span>
            <span class="event-detail-value">${contract.contract_id}</span>
          </div>
          <div class="event-detail-row">
            <span class="event-detail-label">Current Classification:</span>
            <span class="event-classification classification-${classificationClass}">
              ${contract.current_classification}
            </span>
          </div>
          <div class="event-detail-row">
            <span class="event-detail-label">Current MRS Score:</span>
            <span class="event-detail-value">${contract.current_mrs}</span>
          </div>
          ${contract.change_description ? `
          <div class="event-detail-row">
            <span class="event-detail-label">Details:</span>
            <span class="event-detail-value">${contract.change_description}</span>
          </div>
          ` : ''}
        </div>
        
        <div class="event-status">
          <span class="status-dot ${contract.status.toLowerCase().replace(/ /g, '-')}"></span>
          <span>Status: ${contract.status}</span>
        </div>
        
        <div class="event-actions">
          <button class="btn btn--primary btn--sm" onclick="event.stopPropagation(); triggerReEvaluation(${contract.id})">
            Trigger Re-Evaluation
          </button>
          <button class="btn btn--secondary btn--sm" onclick="event.stopPropagation(); selectEvent(${contract.id})">
            View Details
          </button>
          <button class="btn btn--secondary btn--sm" onclick="event.stopPropagation(); acknowledgeEvent(${contract.id})">
            Acknowledge & Snooze
          </button>
        </div>
      </div>
    `;
  });
  
  timeline.innerHTML = html;
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Select event
function selectEvent(id) {
  state.selectedContract = state.contracts.find(c => c.id === id);
  renderTimeline();
  renderEventDetail();
}

// Render event detail
function renderEventDetail() {
  const panel = document.getElementById('eventDetailPanel');
  const placeholder = document.getElementById('eventDetailPlaceholder');
  
  if (!state.selectedContract) {
    panel.classList.add('hidden');
    placeholder.style.display = 'block';
    return;
  }
  
  placeholder.style.display = 'none';
  panel.classList.remove('hidden');
  
  const contract = state.selectedContract;
  const urgencyClass = contract.urgency.toLowerCase();
  const classificationClass = contract.current_classification.toLowerCase().replace(/ /g, '-');
  
  // Mock baseline scores
  const baselineScores = [
    { name: 'Compliance', value: 4, max: 5 },
    { name: 'Readiness', value: 5, max: 5 },
    { name: 'Business Value', value: 5, max: 5 },
    { name: 'Operational Friction', value: 5, max: 5 },
    { name: 'Legal Flexibility', value: 5, max: 5 }
  ];
  
  // Mock re-evaluation history
  const history = [
    { date: 'Oct 15, 2025', score: 4.8, classification: 'Migrate Now' },
    { date: 'Sep 1, 2025', score: 4.5, classification: 'Migrate Soon' },
    { date: 'Aug 10, 2025', score: 4.3, classification: 'Migrate Soon' }
  ];
  
  let html = `
    <div class="detail-header">
      <div class="detail-title">
        <h3>${contract.event_type} — ${contract.client_name}</h3>
        <div class="detail-subtitle">${contract.contract_id}</div>
      </div>
      <button class="close-detail" onclick="closeDetail()">×</button>
    </div>
    
    <!-- Section 1: Event Details -->
    <div class="detail-section">
      <h4>Event Details</h4>
      <div class="detail-info-grid">
        <div class="detail-info-row">
          <span class="detail-info-label">Event Type:</span>
          <span class="detail-info-value">${contract.event_type}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Due Date:</span>
          <span class="detail-info-value highlight">${formatDate(contract.renewal_date)}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Days Until:</span>
          <span class="detail-info-value highlight">${contract.days_until} days</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Contract Reference:</span>
          <span class="detail-info-value">${contract.contract_id}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Contract Value:</span>
          <span class="detail-info-value">$${contract.contract_value.toLocaleString()}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Current Sector:</span>
          <span class="detail-info-value">${contract.sector}</span>
        </div>
        ${contract.renewal_type ? `
        <div class="detail-info-row">
          <span class="detail-info-label">Renewal Type:</span>
          <span class="detail-info-value">${contract.renewal_type}</span>
        </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Section 2: Current Baseline -->
    <div class="detail-section">
      <h4>Current Baseline (from MRS Dashboard)</h4>
      <div class="detail-info-grid">
        <div class="detail-info-row">
          <span class="detail-info-label">Current MRS Score:</span>
          <span class="detail-info-value">${contract.current_mrs}</span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Current Classification:</span>
          <span class="event-classification classification-${classificationClass}">
            ${contract.current_classification}
          </span>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-label">Assessment Date:</span>
          <span class="detail-info-value">October 15, 2025</span>
        </div>
      </div>
      
      <div style="margin-top: 16px;">
        <strong style="font-size: 12px; color: var(--color-slate-500);">Key Drivers:</strong>
        <div class="baseline-scores" style="margin-top: 8px;">
          ${baselineScores.map(score => `
            <div class="score-item">
              <span style="min-width: 120px; font-size: 12px;">${score.name}</span>
              <div class="score-bar">
                <div class="score-fill" style="width: ${(score.value / score.max) * 100}%;"></div>
              </div>
              <span style="font-weight: 600; font-size: 12px;">${score.value}/${score.max}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    <!-- Section 3: Change Triggers -->
    <div class="detail-section">
      <h4>Change Triggers</h4>
      ${contract.change_description ? `
        <div class="change-trigger-box">
          <strong>New Requirements Detected:</strong>
          <ul>
            <li>${contract.change_description}</li>
          </ul>
        </div>
      ` : `
        <div class="change-trigger-box">
          <strong>Contract Renewal:</strong>
          <p style="margin: 8px 0 0 0;">Contract renewal may include new requirements. Review SOW addendum for changes.</p>
        </div>
      `}
    </div>
    
    <!-- Section 4: Re-Evaluation Actions -->
    <div class="detail-section">
      <h4>Re-Evaluation Actions</h4>
      <button class="btn btn--primary btn--lg btn--full-width" onclick="triggerReEvaluation(${contract.id})">
        Trigger MRS Re-Evaluation
      </button>
      
      <div id="reEvalResult_${contract.id}" class="re-evaluation-result hidden">
        <h4>✓ Re-Evaluation Complete</h4>
        <div class="mrs-change">New MRS: ${(contract.current_mrs + 0.4).toFixed(1)} (↑ +0.4)</div>
        <p style="margin: 0; font-size: 14px;">Classification upgraded to <strong>Migrate Now</strong></p>
      </div>
      
      <div style="margin-top: 16px;">
        <label class="checkbox-label">
          <input type="checkbox" id="includeReview_${contract.id}">
          <span>Include in Migration Prioritization Review</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" id="alertSales_${contract.id}">
          <span>Alert Sales Team</span>
        </label>
      </div>
    </div>
    
    <!-- Section 5: Re-Evaluation History -->
    <div class="detail-section">
      <h4>Re-Evaluation History</h4>
      ${history.map(item => `
        <div class="history-item">
          <span class="history-date">${item.date}</span>
          <span class="history-score">MRS ${item.score} (${item.classification})</span>
        </div>
      `).join('')}
      <div class="trend-indicator trend-improving">↑ Improving</div>
    </div>
    
    <!-- Section 6: Related RFPs -->
    <div class="detail-section">
      <h4>Related RFPs</h4>
      <p style="font-size: 12px; color: var(--color-slate-500); margin: 0;">
        No active RFPs found for this client.
      </p>
    </div>
    
    <!-- Section 7: Audit Trail -->
    <div class="detail-section">
      <h4>Audit Trail</h4>
      <div class="audit-trail">
        <div class="audit-trail-item">• Event created: Nov 1, 2025 10:30 AM</div>
        <div class="audit-trail-item">• Last updated: Nov 11, 2025 9:15 AM</div>
        <div class="audit-trail-item">• Status: ${contract.status}</div>
      </div>
    </div>
  `;
  
  panel.innerHTML = html;
}

// Close detail panel
function closeDetail() {
  state.selectedContract = null;
  renderTimeline();
  document.getElementById('eventDetailPanel').classList.add('hidden');
  document.getElementById('eventDetailPlaceholder').style.display = 'block';
}

// Trigger re-evaluation
function triggerReEvaluation(id) {
  const contract = state.contracts.find(c => c.id === id);
  if (!contract) return;
  
  // Simulate re-evaluation
  const resultDiv = document.getElementById(`reEvalResult_${id}`);
  if (resultDiv) {
    resultDiv.classList.remove('hidden');
    
    // Update contract status
    contract.status = 'Re-Evaluated';
    contract.current_mrs = parseFloat((contract.current_mrs + 0.4).toFixed(1));
    contract.current_classification = 'Migrate Now';
    
    renderTimeline();
    
    // Show success message
    setTimeout(() => {
      alert(`✓ Re-evaluation triggered for ${contract.client_name}\n\nMRS Engine calculating...\n\nNew MRS: ${contract.current_mrs} (↑ +0.4)\nClassification: ${contract.current_classification}\n\nResults sent to MRS Dashboard.`);
    }, 500);
  } else {
    alert(`Re-evaluation triggered for ${contract.client_name}\n\nSending to MRS Engine...\nCalculating new score...\n\nThis will update the MRS Dashboard with new inputs.`);
  }
}

// Acknowledge event
function acknowledgeEvent(id) {
  const contract = state.contracts.find(c => c.id === id);
  if (!contract) return;
  
  contract.status = 'Acknowledged';
  renderTimeline();
  
  alert(`Event acknowledged and snoozed for 7 days\n\nClient: ${contract.client_name}\nNext reminder: ${formatDate(addDays(new Date(), 7))}`);
}

// Add days to date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

// Update alert banner
function updateAlertBanner() {
  const criticalEvents = state.contracts.filter(c => c.days_until <= 15);
  const banner = document.getElementById('alertBanner');
  const alertText = document.getElementById('alertText');
  
  if (criticalEvents.length > 0) {
    banner.classList.remove('hidden');
    alertText.textContent = `🚨 CRITICAL: ${criticalEvents.length} contract${criticalEvents.length > 1 ? 's' : ''} renewing in 15 days. Action required.`;
  } else {
    banner.classList.add('hidden');
  }
}

// Update status counts
function updateStatusCounts() {
  const critical = state.contracts.filter(c => c.urgency === 'CRITICAL').length;
  const planned = state.contracts.filter(c => c.urgency === 'PLANNED').length;
  const visibility = state.contracts.filter(c => c.urgency === 'VISIBILITY').length;
  
  document.getElementById('criticalCount').textContent = critical;
  document.getElementById('plannedCount').textContent = planned;
  document.getElementById('visibilityCount').textContent = visibility;
}

// Add new event
function addNewEvent() {
  alert('Add New Contract Event\n\nIn production, this would open a form to manually add a contract event:\n\n• Client Name\n• Contract ID\n• Event Type\n• Renewal Date\n• Contract Value\n• Sector\n\nThe event would be added to the timeline and trigger notifications.');
}

// Download calendar
function downloadCalendar() {
  let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Marsh MRS//Contract Events Monitor//EN\n';
  
  state.contracts.forEach(contract => {
    const eventDate = contract.renewal_date.replace(/-/g, '');
    icsContent += `BEGIN:VEVENT\n`;
    icsContent += `DTSTART:${eventDate}\n`;
    icsContent += `SUMMARY:${contract.event_type} - ${contract.client_name}\n`;
    icsContent += `DESCRIPTION:Contract: ${contract.contract_id}\nValue: $${contract.contract_value.toLocaleString()}\n`;
    icsContent += `END:VEVENT\n`;
  });
  
  icsContent += 'END:VCALENDAR';
  
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'marsh-contract-events.ics';
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Calendar exported!\n\nYou can now import this file into Outlook, Google Calendar, or Teams.');
}

// Make functions globally accessible
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.filterByUrgency = filterByUrgency;
window.filterCritical = filterCritical;
window.selectEvent = selectEvent;
window.closeDetail = closeDetail;
window.triggerReEvaluation = triggerReEvaluation;
window.acknowledgeEvent = acknowledgeEvent;
window.addNewEvent = addNewEvent;
window.downloadCalendar = downloadCalendar;

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}