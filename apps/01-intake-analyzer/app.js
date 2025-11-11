// Risk & Readiness Heat Map Application

// Application state
let state = {
  viewMode: 'risk-impact',
  sizeBy: 'mrs',
  selectedRFP: null,
  draggedBubble: null
};

// RFP data with quadrant positioning
const rfpData = [
  { name: 'VA Medical Center - Phoenix', sector: 'Federal', risk: 0.5, impact: 5.0, mrs: 4.9, classification: 'Migrate Now', marker: 'none' },
  { name: 'CMS Medicare Portal', sector: 'Federal', risk: 1.5, impact: 5.0, mrs: 4.5, classification: 'Migrate Soon', marker: 'star' },
  { name: 'Federal Student Aid Office', sector: 'Federal', risk: 2.0, impact: 5.0, mrs: 4.3, classification: 'Migrate Soon', marker: 'none' },
  { name: 'DOD Logistics System', sector: 'Defense', risk: 1.0, impact: 5.0, mrs: 4.5, classification: 'Migrate Now', marker: 'none' },
  { name: 'State of California DMV', sector: 'State', risk: 2.75, impact: 4.0, mrs: 3.7, classification: 'Migrate Soon', marker: 'star' },
  { name: 'VA Benefits Processing', sector: 'Federal', risk: 3.5, impact: 5.0, mrs: 4.0, classification: 'Migrate Soon', marker: 'diamond' },
  { name: 'County Health Dept - Miami', sector: 'Healthcare', risk: 4.5, impact: 3.0, mrs: 2.7, classification: 'Migrate Later', marker: 'diamond' },
  { name: 'Municipal Water District', sector: 'State', risk: 3.5, impact: 2.0, mrs: 1.7, classification: 'Hold', marker: 'none' },
  { name: 'NIH Research Database', sector: 'Federal', risk: 2.5, impact: 4.0, mrs: 3.2, classification: 'Migrate Later', marker: 'none' },
  { name: 'State Tax Authority - Texas', sector: 'State', risk: 3.0, impact: 4.0, mrs: 3.0, classification: 'Migrate Later', marker: 'diamond' },
  { name: 'State Unemployment System', sector: 'State', risk: 3.5, impact: 3.0, mrs: 2.6, classification: 'Migrate Later', marker: 'diamond' },
  { name: 'Defense Intelligence Platform', sector: 'Defense', risk: 2.0, impact: 5.0, mrs: 3.8, classification: 'Migrate Soon', marker: 'none' }
];

// Color mapping
const colors = {
  'Migrate Now': '#1E865C',
  'Migrate Soon': '#FFA500',
  'Migrate Later': '#FF9800',
  'Hold': '#E03E36'
};

// Canvas and rendering
let canvas = null;
let ctx = null;
let canvasRect = null;
let bubbles = [];

// Initialize canvas and draw quadrant
function initCanvas() {
  canvas = document.getElementById('quadrantCanvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Set canvas size to match container
  const container = document.getElementById('quadrantContainer');
  canvas.width = container.clientWidth - 48;
  canvas.height = container.clientHeight - 48;
  canvasRect = canvas.getBoundingClientRect();
  
  // Create bubbles from RFP data
  createBubbles();
  
  // Draw the quadrant
  drawQuadrant();
  
  // Add event listeners
  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleCanvasHover);
}

// Create bubble objects from RFP data
function createBubbles() {
  bubbles = rfpData.map(rfp => {
    const x = mapToCanvas(rfp.risk, 0, 5, 100, canvas.width - 100);
    const y = mapToCanvas(rfp.impact, 0, 5, canvas.height - 100, 100);
    const radius = mapToCanvas(rfp.mrs, 0, 5, 15, 45);
    
    return {
      ...rfp,
      x: x,
      y: y,
      radius: radius,
      originalX: x,
      originalY: y
    };
  });
}

// Map value from one range to another
function mapToCanvas(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Draw the quadrant visualization
function drawQuadrant() {
  if (!ctx || !canvas) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const midX = canvas.width / 2;
  const midY = canvas.height / 2;
  
  // Draw quadrant backgrounds
  const padding = 60;
  
  // Quick Wins (top-left)
  ctx.fillStyle = 'rgba(232, 245, 233, 0.6)';
  ctx.fillRect(padding, padding, midX - padding, midY - padding);
  
  // Strategic Priority (top-right)
  ctx.fillStyle = 'rgba(255, 248, 225, 0.6)';
  ctx.fillRect(midX, padding, midX - padding, midY - padding);
  
  // Low Priority (bottom-left)
  ctx.fillStyle = 'rgba(245, 245, 245, 0.6)';
  ctx.fillRect(padding, midY, midX - padding, midY - padding);
  
  // Problem Child (bottom-right)
  ctx.fillStyle = 'rgba(255, 235, 238, 0.6)';
  ctx.fillRect(midX, midY, midX - padding, midY - padding);
  
  // Draw gridlines
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const x = padding + (i * (canvas.width - 2 * padding) / 5);
    const y = padding + (i * (canvas.height - 2 * padding) / 5);
    
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, canvas.height - padding);
    ctx.stroke();
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = '#626C7C';
  ctx.lineWidth = 2;
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw axis labels
  ctx.fillStyle = '#626C7C';
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.textAlign = 'center';
  
  // X-axis label
  ctx.fillText('RISK (Inverse of Readiness + Friction)', canvas.width / 2, canvas.height - 20);
  ctx.fillText('LOW RISK', padding + 60, canvas.height - 40);
  ctx.fillText('HIGH RISK', canvas.width - padding - 60, canvas.height - 40);
  
  // Y-axis label
  ctx.save();
  ctx.translate(20, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('BUSINESS IMPACT (Revenue, Strategic Value)', 0, 0);
  ctx.restore();
  
  ctx.textAlign = 'left';
  ctx.fillText('LOW', 20, canvas.height - padding - 10);
  ctx.fillText('HIGH', 20, padding + 20);
  
  // Draw quadrant labels
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillStyle = 'rgba(30, 134, 92, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('QUICK WINS', padding + (midX - padding) / 2, padding + 30);
  
  ctx.fillStyle = 'rgba(196, 130, 14, 0.4)';
  ctx.fillText('STRATEGIC PRIORITY', midX + (midX - padding) / 2, padding + 30);
  
  ctx.fillStyle = 'rgba(119, 124, 124, 0.4)';
  ctx.fillText('LOW PRIORITY', padding + (midX - padding) / 2, canvas.height - padding - 30);
  
  ctx.fillStyle = 'rgba(224, 62, 54, 0.4)';
  ctx.fillText('PROBLEM CHILD', midX + (midX - padding) / 2, canvas.height - padding - 30);
  
  // Draw bubbles
  bubbles.forEach(bubble => {
    drawBubble(bubble);
  });
}

// Draw a single bubble
function drawBubble(bubble) {
  ctx.save();
  
  // Draw bubble circle
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
  ctx.fillStyle = colors[bubble.classification];
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = colors[bubble.classification];
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw marker if present
  if (bubble.marker === 'star') {
    drawStar(bubble.x, bubble.y - bubble.radius - 10, 8);
  } else if (bubble.marker === 'diamond') {
    drawDiamond(bubble.x, bubble.y - bubble.radius - 10, 8);
  }
  
  // Draw initials
  const initials = bubble.name.split(' ').slice(0, 2).map(w => w[0]).join('');
  ctx.fillStyle = 'white';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, bubble.x, bubble.y);
  
  ctx.restore();
}

// Draw star marker
function drawStar(x, y, size) {
  ctx.save();
  ctx.fillStyle = '#FDB913';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const xPos = x + Math.cos(angle) * size;
    const yPos = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(xPos, yPos);
    else ctx.lineTo(xPos, yPos);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw diamond marker
function drawDiamond(x, y, size) {
  ctx.save();
  ctx.fillStyle = '#E03E36';
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - size, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Handle canvas click
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Check if clicked on a bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
    
    if (distance <= bubble.radius) {
      showRFPDetails(bubble);
      return;
    }
  }
}

// Handle canvas hover
function handleCanvasHover(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  let hovering = false;
  
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    const distance = Math.sqrt((x - bubble.x) ** 2 + (y - bubble.y) ** 2);
    
    if (distance <= bubble.radius) {
      canvas.style.cursor = 'pointer';
      hovering = true;
      
      // Draw tooltip
      drawTooltip(bubble, event.clientX, event.clientY);
      return;
    }
  }
  
  if (!hovering) {
    canvas.style.cursor = 'crosshair';
  }
}

// Draw tooltip
function drawTooltip(bubble, mouseX, mouseY) {
  // For simplicity, we'll show details in sidebar on click
  // Tooltip could be implemented with a separate DOM element
}

// Show RFP details in sidebar
function showRFPDetails(rfp) {
  state.selectedRFP = rfp;
  
  const sidebar = document.getElementById('rightSidebar');
  const title = document.getElementById('sidebarTitle');
  const content = document.getElementById('sidebarContent');
  
  sidebar.style.display = 'flex';
  title.textContent = rfp.name;
  
  const quadrant = getQuadrant(rfp.risk, rfp.impact);
  const quadrantClass = quadrant.toLowerCase().replace(/ /g, '-');
  
  content.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span class="sector-badge">${rfp.sector}</span>
      <span class="classification-badge badge-${rfp.classification.toLowerCase().replace(/ /g, '-')}">${rfp.classification}</span>
    </div>
    
    <div class="detail-section">
      <h4>Quick Facts</h4>
      <div class="detail-row">
        <span class="detail-label">Risk Score:</span>
        <span class="detail-value">${rfp.risk}/5</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Impact Score:</span>
        <span class="detail-value">${rfp.impact}/5</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">MRS:</span>
        <span class="detail-value">${rfp.mrs}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Quadrant:</span>
        <span class="detail-value">${quadrant}</span>
      </div>
      <div class="quadrant-tag ${quadrantClass}">${quadrant}</div>
    </div>
    
    <div class="detail-section">
      <h4>Risk Breakdown</h4>
      <p style="font-size: 13px; line-height: 1.5; color: #626C7C;">
        <strong>Risk Level:</strong> ${getRiskDescription(rfp.risk)}<br>
        <strong>Primary Concern:</strong> ${getRiskReason(rfp)}
      </p>
    </div>
    
    <div class="detail-section">
      <h4>Opportunity Breakdown</h4>
      <p style="font-size: 13px; line-height: 1.5; color: #626C7C;">
        <strong>Business Value:</strong> ${getImpactDescription(rfp.impact)}<br>
        <strong>Strategic Importance:</strong> ${getStrategicImportance(rfp)}
      </p>
    </div>
    
    <div class="detail-section">
      <h4>Workstream Assignment</h4>
      <select class="form-control" style="margin-bottom: 12px;">
        <option value="">Unassigned</option>
        <option value="team-a">Team A — Security Focus</option>
        <option value="team-b">Team B — Compliance</option>
        <option value="team-c">Team C — Infrastructure</option>
      </select>
      <button class="btn btn--primary btn--full-width">Assign</button>
    </div>
    
    <div class="detail-section">
      <h4>Action Recommendation</h4>
      <div class="recommendation-box">
        ${getRecommendation(rfp, quadrant)}
      </div>
    </div>
  `;
}

// Get quadrant based on risk/impact
function getQuadrant(risk, impact) {
  if (risk < 2.5 && impact >= 3.5) return 'Quick Wins';
  if (risk >= 2.5 && impact >= 3.5) return 'Strategic Priority';
  if (risk < 2.5 && impact < 3.5) return 'Low Priority';
  return 'Problem Child';
}

// Get risk description
function getRiskDescription(risk) {
  if (risk < 1.5) return 'Very Low - Ready to proceed';
  if (risk < 2.5) return 'Low - Minimal barriers';
  if (risk < 3.5) return 'Medium - Some remediation needed';
  if (risk < 4.5) return 'High - Significant challenges';
  return 'Very High - Major obstacles';
}

// Get risk reason
function getRiskReason(rfp) {
  if (rfp.risk < 2) return 'High readiness, low operational friction';
  if (rfp.risk < 3.5) return 'Moderate compliance gaps, some friction';
  return 'Low readiness, high operational complexity';
}

// Get impact description
function getImpactDescription(impact) {
  if (impact >= 4.5) return 'Very High - Mission critical';
  if (impact >= 3.5) return 'High - Significant value';
  if (impact >= 2.5) return 'Medium - Moderate value';
  return 'Low - Limited impact';
}

// Get strategic importance
function getStrategicImportance(rfp) {
  if (rfp.sector === 'Federal' || rfp.sector === 'Defense') return 'Critical - Federal mandate';
  if (rfp.sector === 'State') return 'Important - State compliance';
  return 'Standard - Regulatory requirement';
}

// Get recommendation
function getRecommendation(rfp, quadrant) {
  if (quadrant === 'Quick Wins') {
    return `<strong>Recommendation:</strong> Fast-track this deal. Low risk, high value. Allocate minimal resources. Expected close: 4-6 weeks. Revenue unlock: $${Math.round(rfp.impact * 10)}M.`;
  } else if (quadrant === 'Strategic Priority') {
    return `<strong>Recommendation:</strong> Invest resources. High value justifies risk mitigation. Assign dedicated team. Focus on: compliance remediation and security controls. Timeline: 8-12 weeks.`;
  } else if (quadrant === 'Low Priority') {
    return `<strong>Recommendation:</strong> Defer. Low value does not justify resource allocation. Revisit if conditions change or combine with similar projects.`;
  } else {
    return `<strong>Recommendation:</strong> Restructure or kill. High risk, low value. Consider: (1) Negotiate better terms to increase value, (2) Defer until readiness improves, (3) Decline and reallocate resources.`;
  }
}

// Close sidebar
function closeSidebar() {
  document.getElementById('rightSidebar').style.display = 'none';
  state.selectedRFP = null;
}

// Change view mode
function changeViewMode() {
  const selected = document.querySelector('input[name="viewMode"]:checked');
  if (selected) {
    state.viewMode = selected.value;
    // In a full implementation, we'd recalculate bubble positions based on view mode
    alert(`Switching to ${selected.nextElementSibling.textContent} view mode.\n\nThis would reposition bubbles based on different axes.`);
  }
}

// Filter RFPs
function filterRFPs() {
  alert('Filter applied! In production, this would show/hide bubbles based on selected classifications and sectors.');
  drawQuadrant();
}

// Filter by workstream
function filterByWorkstream(value) {
  if (value === 'all') {
    drawQuadrant();
  } else {
    alert(`Filtering by ${value}. In production, this would highlight only assigned RFPs.`);
  }
}

// Update visualization
function updateVisualization() {
  const selected = document.querySelector('input[name="sizeBy"]:checked');
  if (selected) {
    state.sizeBy = selected.value;
    // In production, recalculate bubble sizes based on selected metric
    alert(`Sizing bubbles by ${state.sizeBy}`);
    drawQuadrant();
  }
}

// Reset filters
function resetFilters() {
  // Reset all checkboxes
  document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(cb => {
    cb.checked = true;
  });
  
  // Reset view mode
  document.querySelector('input[name="viewMode"][value="risk-impact"]').checked = true;
  
  // Reset size by
  document.querySelector('input[name="sizeBy"][value="mrs"]').checked = true;
  
  drawQuadrant();
  alert('All filters reset to default.');
}

// Export quadrant as PNG
function exportQuadrantPNG() {
  const link = document.createElement('a');
  link.download = 'marsh-risk-readiness-heatmap.png';
  link.href = canvas.toDataURL();
  link.click();
  alert('Quadrant heat map exported as PNG!');
}

// Export workstream assignments
function exportWorkstreamCSV() {
  let csv = 'RFP,Sector,Classification,Risk,Impact,MRS,Quadrant,Workstream\n';
  rfpData.forEach(rfp => {
    const quadrant = getQuadrant(rfp.risk, rfp.impact);
    csv += `"${rfp.name}",${rfp.sector},${rfp.classification},${rfp.risk},${rfp.impact},${rfp.mrs},${quadrant},Unassigned\n`;
  });
  
  downloadFile(csv, 'workstream-assignments.csv', 'text/csv');
  alert('Workstream assignments exported to CSV!');
}

// Export strategic plan PDF
function exportStrategicPlanPDF() {
  alert('Export Strategic Plan (PDF)\n\nGenerating 3-page strategic document...\n\nWould include:\n\u2022 Quadrant overview with statistics\n\u2022 Per-quadrant recommendations\n\u2022 Workstream breakdown with FTE allocation\n\u2022 Timeline and milestones\n\nThis feature requires a PDF generation library in production.');
}

// Generate executive brief
function generateExecutiveBrief() {
  alert('Generate Executive Brief\n\nCreating 1-page board summary...\n\nWould include:\n\u2022 Quadrant snapshot visualization\n\u2022 Quick Wins (2 RFPs, $45M ARR)\n\u2022 Strategic Priority (4 RFPs, $120M ARR)\n\u2022 Problem Child mitigation strategies\n\u2022 Resource allocation recommendations\n\nThis feature requires a document generation library in production.');
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
window.changeViewMode = changeViewMode;
window.filterRFPs = filterRFPs;
window.filterByWorkstream = filterByWorkstream;
window.updateVisualization = updateVisualization;
window.resetFilters = resetFilters;
window.closeSidebar = closeSidebar;
window.exportQuadrantPNG = exportQuadrantPNG;
window.exportWorkstreamCSV = exportWorkstreamCSV;
window.exportStrategicPlanPDF = exportStrategicPlanPDF;
window.generateExecutiveBrief = generateExecutiveBrief;





// Initialize on load
function init() {
  console.log('Marsh Risk & Readiness Heat Map initialized');
  console.log('12 RFPs loaded');
  console.log('View mode: Risk/Impact Quadrant');
  
  // Initialize canvas
  initCanvas();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    setTimeout(() => {
      initCanvas();
    }, 100);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
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