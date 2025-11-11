// Gap Analyzer Application

const NIST_FAMILIES = {
    'AC': { name: 'Access Control', controls: 22, implemented: 18 },
    'AT': { name: 'Awareness & Training', controls: 4, implemented: 4 },
    'AU': { name: 'Audit & Accountability', controls: 12, implemented: 10 },
    'CA': { name: 'Security Assessment', controls: 8, implemented: 6 },
    'CM': { name: 'Configuration Management', controls: 10, implemented: 8 },
    'CP': { name: 'Contingency Planning', controls: 13, implemented: 9 },
    'IA': { name: 'Identification & Authentication', controls: 6, implemented: 5 },
    'IR': { name: 'Incident Response', controls: 10, implemented: 7 },
    'MA': { name: 'System Maintenance', controls: 7, implemented: 5 },
    'PE': { name: 'Physical Environment', controls: 14, implemented: 10 },
    'PL': { name: 'Planning', controls: 11, implemented: 9 },
    'PS': { name: 'Personnel Security', controls: 8, implemented: 6 },
    'RA': { name: 'Risk Assessment', controls: 5, implemented: 4 },
    'SA': { name: 'System & Services Acq.', controls: 16, implemented: 12 },
    'SC': { name: 'System Communications', controls: 20, implemented: 15 },
    'SI': { name: 'System Info Protection', controls: 12, implemented: 9 },
};

const GAPS = [
    { id: 'CP-4', family: 'CP', control: 'Contingency Planning - Restoration', status: 'Not Implemented', priority: 'Critical', dueDate: '2025-02-28' },
    { id: 'IR-4', family: 'IR', control: 'Incident Response - Handling', status: 'Partial', priority: 'High', dueDate: '2025-03-31' },
    { id: 'SA-3', family: 'SA', control: 'System & Services Acq. - Dev Lifecycle', status: 'Not Implemented', priority: 'Critical', dueDate: '2025-01-31' },
    { id: 'PE-3', family: 'PE', control: 'Physical Environment - Perimeter', status: 'Partial', priority: 'High', dueDate: '2025-02-15' },
    { id: 'PS-7', family: 'PS', control: 'Personnel Security - Separation', status: 'Not Implemented', priority: 'High', dueDate: '2025-03-15' },
];

let chart = null;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSampleData();
    renderControlFamilies();
    renderGapDetails();
    renderPOAM();
    updateStats();
});

// Load sample data
function loadSampleData() {
    const assessmentDate = new Date().toISOString().split('T')[0];
    document.getElementById('assessmentDate').value = assessmentDate;
}

// Render control families grid
function renderControlFamilies() {
    const container = document.getElementById('controlFamilies');
    container.innerHTML = '';

    Object.entries(NIST_FAMILIES).forEach(([code, family]) => {
        const compliance = (family.implemented / family.controls) * 100;
        
        const div = document.createElement('div');
        div.className = 'control-family';
        div.innerHTML = `
            <div class="control-family-name">${code} - ${family.name}</div>
            <div class="control-family-bar">
                <div class="control-family-fill" style="width: ${compliance}%"></div>
            </div>
            <div class="control-family-pct">${family.implemented}/${family.controls} (${Math.round(compliance)}%)</div>
        `;
        container.appendChild(div);
    });

    renderChart();
}

// Render compliance chart
function renderChart() {
    const ctx = document.getElementById('complianceChart').getContext('2d');
    const labels = Object.keys(NIST_FAMILIES);
    const data = labels.map(code => {
        const family = NIST_FAMILIES[code];
        return (family.implemented / family.controls) * 100;
    });

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Compliance %',
                data: data,
                backgroundColor: 'rgba(0, 82, 180, 0.7)',
                borderColor: 'rgba(0, 82, 180, 1)',
                borderWidth: 1,
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return Math.round(context.parsed.x) + '% Implemented';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render gap details
function renderGapDetails() {
    const container = document.getElementById('gapDetails');
    container.innerHTML = '';

    GAPS.forEach(gap => {
        const div = document.createElement('div');
        div.className = `gap-item ${gap.priority === 'Critical' ? 'critical' : ''}`;
        div.innerHTML = `
            <h4>⚠️ ${gap.id}: ${gap.control}</h4>
            <p><strong>Status:</strong> ${gap.status}</p>
            <p><strong>Priority:</strong> ${gap.priority} | <strong>Target:</strong> ${gap.dueDate}</p>
        `;
        container.appendChild(div);
    });
}

// Render POA&M table
function renderPOAM() {
    const tbody = document.getElementById('poamTable');
    tbody.innerHTML = '';

    GAPS.forEach(gap => {
        const tr = document.createElement('tr');
        const priorityClass = `priority-${gap.priority.toLowerCase()}`;
        
        tr.innerHTML = `
            <td><strong>${gap.id}</strong></td>
            <td>${gap.family}</td>
            <td>${gap.status}</td>
            <td>${gap.control}</td>
            <td>${gap.dueDate}</td>
            <td>Security Team</td>
            <td><span class="${priorityClass}">${gap.priority}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Update statistics
function updateStats() {
    const totalControls = Object.values(NIST_FAMILIES).reduce((sum, f) => sum + f.controls, 0);
    const implementedControls = Object.values(NIST_FAMILIES).reduce((sum, f) => sum + f.implemented, 0);
    const avgCompliance = Math.round((implementedControls / totalControls) * 100);

    document.getElementById('controlsCount').textContent = totalControls;
    document.getElementById('avgCompliance').textContent = avgCompliance + '%';

    // Quick stats
    const criticalGaps = GAPS.filter(g => g.priority === 'Critical').length;
    const highGaps = GAPS.filter(g => g.priority === 'High').length;
    
    const quickStatsDiv = document.getElementById('quickStats');
    quickStatsDiv.innerHTML = `
        <div class="quick-stat">
            <span class="quick-stat-label">🔴 Critical Gaps</span>
            <span class="quick-stat-value">${criticalGaps}</span>
        </div>
        <div class="quick-stat">
            <span class="quick-stat-label">🟠 High Priority</span>
            <span class="quick-stat-value">${highGaps}</span>
        </div>
        <div class="quick-stat">
            <span class="quick-stat-label">✅ Implemented</span>
            <span class="quick-stat-value">${avgCompliance}%</span>
        </div>
    `;
}

// Analyze gaps (simulation)
function analyzeGaps() {
    const client = document.getElementById('clientName').value;
    const framework = document.getElementById('framework').value;
    
    alert(`Analyzing ${client} for ${framework}...\n\nGaps identified:\n- ${GAPS.length} total gaps\n- ${GAPS.filter(g => g.priority === 'Critical').length} Critical\n- ${GAPS.filter(g => g.priority === 'High').length} High Priority`);
}

// Export POA&M report
function exportReport() {
    const client = document.getElementById('clientName').value;
    const assessor = document.getElementById('assessor').value;
    const date = document.getElementById('assessmentDate').value;

    let csv = 'NIST 800-53 Control Gap Analysis Report\n';
    csv += `Client: ${client}\n`;
    csv += `Assessor: ${assessor}\n`;
    csv += `Date: ${date}\n\n`;

    csv += 'Control ID,Family,Current Status,Gap Description,Target Completion,Responsible,Priority\n';
    
    GAPS.forEach(gap => {
        csv += `${gap.id},${gap.family},${gap.status},"${gap.control}",${gap.dueDate},Security Team,${gap.priority}\n`;
    });

    // Download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `POA_M_${client.replace(/\s+/g, '_')}_${date}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
