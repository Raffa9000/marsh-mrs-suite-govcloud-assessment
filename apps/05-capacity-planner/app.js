// Executive Steering Dashboard Application

// Talking points data
const talkingPoints = [
  'We are confident about our cloud migration timeline. Current portfolio health (MRS 3.8, +0.3 trending) indicates strong progress. We expect to complete 70%+ of migrations by Q2 2026.',
  'Compliance gaps and operational constraints represent our key challenges. Our mitigation plan includes targeted remediation sprints and resource reallocation. If executed as planned, timeline impact will be minimal (±2 months).',
  'We recommend board approval for $500K security remediation budget. This enables accelerated compliance maturity, unlocks 3 high-value migrations, and reduces portfolio risk.',
  'Next steps: (1) Approve budget by Nov 15, (2) Execute Conditional Award negotiation by Nov 30, (3) Complete Federal Student Aid ATO by Dec 31, (4) Reconvene for Q1 steering review on Jan 15.'
];

// Toggle talking points section
function toggleTalkingPoints() {
  const content = document.getElementById('talkingPointsContent');
  const arrow = document.getElementById('talkingPointsArrow');
  
  content.classList.toggle('expanded');
  
  if (content.classList.contains('expanded')) {
    arrow.textContent = '▲';
  } else {
    arrow.textContent = '▼';
  }
}

// Copy talking point to clipboard
function copyToClipboard(button, index) {
  const text = talkingPoints[index];
  
  // Create temporary textarea to copy text
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    button.textContent = 'Copied!';
    button.style.background = '#176b4a';
    
    setTimeout(() => {
      button.textContent = 'Copy';
      button.style.background = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Copy failed. Please try again.');
  } finally {
    document.body.removeChild(textarea);
  }
}

// Download Executive Brief
function downloadBrief() {
  alert('Download Executive Brief (PDF)\n\nGenerating single-page board summary...\n\nWould include:\n• Portfolio KPIs (3 cards)\n• Executive narrative (condensed)\n• Risk summary\n• Recommended actions\n• MRS trend line (6 months)\n\nThis feature requires a PDF generation library in production.');
}

// Print Dashboard
function printDashboard() {
  window.print();
}

// Export Data
function exportData() {
  const csvData = `Metric,Value,Trend\n` +
    `Portfolio MRS,3.8,+0.3\n` +
    `Migrate Now,2,17%\n` +
    `Migrate Soon,5,42%\n` +
    `Migrate Later,4,33%\n` +
    `Hold,1,8%\n` +
    `Timeline,6-9 months,±2 months\n` +
    `Avg Compliance Score,4.2,+0.2\n` +
    `Avg Readiness Score,3.1,+0.1\n` +
    `Critical Gaps,28,-5\n` +
    `Resource Utilization,78%,Sustainable`;
  
  downloadFile(csvData, 'portfolio_steering_data.csv', 'text/csv');
}

// Schedule Review
function scheduleReview() {
  alert('Schedule Review\n\nIn a production system, this would:\n• Open calendar integration\n• Send meeting invites to steering committee\n• Attach executive brief\n• Set agenda based on key items\n\nFor now, please manually schedule Q1 steering review for Jan 15, 2026.');
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
window.toggleTalkingPoints = toggleTalkingPoints;
window.copyToClipboard = copyToClipboard;
window.downloadBrief = downloadBrief;
window.printDashboard = printDashboard;
window.exportData = exportData;
window.scheduleReview = scheduleReview;

// Initialize on load
function init() {
  console.log('Executive Steering Dashboard initialized');
  console.log('Portfolio MRS: 3.8');
  console.log('At-risk items: 3');
  console.log('Timeline: 6-9 months');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}