// Enterprise RFP Analysis Suite - Fully Functional Demo Mode

const MOCK_RFPS = {
    'va-medical': {
        name: 'VA Medical Center - Phoenix',
        client: 'Department of Veterans Affairs',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FedRAMP (Moderate)', 'NIST 800-53'],
        content: `Q1.1: Describe your organization's experience with healthcare IT systems and specifically HIPAA compliance implementations.
Q1.2: Provide an organizational chart showing security and compliance leadership.
Q1.3: Describe your change management and communications process.
Q2.1: Describe your cloud infrastructure architecture and how it supports high availability and disaster recovery.
Q2.2: Explain your approach to network segmentation and data isolation for healthcare data.
Q2.3: How do you implement encryption for data at rest and in transit?
Q3.1: Describe your NIST 800-53 control implementation for healthcare environments.
Q3.2: How do you achieve FedRAMP Moderate baseline compliance?
Q3.3: Explain your approach to identity and access management (IAM).
Q3.4: Describe your incident response and breach notification procedures.
Q4.1: Describe your HIPAA BAA requirements and timeline.
Q4.2: Explain your approach to Protected Health Information (PHI) handling.
Q5.1: What is your patch and update management process?`
    },
    'dod-modernization': {
        name: 'DOD IT Modernization Initiative',
        client: 'Department of Defense',
        sector: 'Defense',
        frameworks: ['FedRAMP (High)', 'NIST 800-171', 'CJIS'],
        content: `Q1.1: Describe your understanding of DoD-specific requirements and compliance standards.
Q1.2: What is your experience with FedRAMP High baseline systems?
Q1.3: Explain your approach to managing classified and unclassified information systems.
Q2.1: Detail your implementation of NIST 800-171 security controls.
Q2.2: Describe your approach to incident response and cyber threat mitigation.
Q2.3: How do you ensure compliance with DoD regulations on data handling?
Q3.1: Describe your secure software development lifecycle (SDLC).
Q3.2: What testing and validation procedures do you employ?
Q4.1: What is your experience with Authority to Operate (ATO) processes?
Q4.2: Describe the timeline for achieving FedRAMP High authorization.`
    },
    'cms-analytics': {
        name: 'CMS Analytics Platform',
        client: 'Centers for Medicare & Medicaid Services',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FedRAMP (Moderate)', 'FISMA'],
        content: `Q1.1: Describe your familiarity with CMS data security requirements.
Q1.2: What is your experience with healthcare data analytics at scale?
Q2.1: How do you ensure HIPAA compliance for large-scale data processing?
Q2.2: Explain your approach to PII/PHI identification and protection.
Q2.3: Describe encryption and access control mechanisms.
Q3.1: What analytics tools and capabilities does your platform provide?
Q3.2: How do you ensure data quality and accuracy?
Q4.1: Describe your path to FedRAMP authorization.`
    },
    'fbi-datacenter': {
        name: 'FBI Data Center Consolidation',
        client: 'Federal Bureau of Investigation',
        sector: 'Defense',
        frameworks: ['FedRAMP (High)', 'CJIS', 'NIST 800-53'],
        content: `Q1.1: Describe your experience with CJIS databases and requirements.
Q1.2: How do you protect sensitive criminal justice information?
Q2.1: Detail your implementation of CJIS security policy requirements.
Q2.2: Explain your approach to multi-factor authentication for privileged access.
Q2.3: Describe your incident response procedures for CJIS data.
Q3.1: How do you maintain audit trails for CJIS data access?
Q3.2: Describe your compliance audit schedule.`
    },
    'state-dept': {
        name: 'State Department Secure Collaboration',
        client: 'U.S. Department of State',
        sector: 'Federal',
        frameworks: ['FedRAMP (Moderate)', 'NIST 800-171'],
        content: `Q1.1: Describe your experience with government secure collaboration tools.
Q1.2: What communication protocols and encryption do you support?
Q2.1: How do you meet State Department security requirements?
Q2.2: Explain your approach to access controls and user verification.
Q2.3: Describe your compliance with NIST 800-171 standards.`
    },
    'nih-research': {
        name: 'NIH Research Cloud Platform',
        client: 'National Institutes of Health',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FISMA'],
        content: `Q1.1: Describe your experience with healthcare research data.
Q1.2: What data management and retention capabilities do you provide?
Q2.1: How do you ensure HIPAA compliance for research data?
Q2.2: Explain your approach to IRB requirements and data governance.
Q3.1: What is your experience with NIH data standards?`
    },
    'census-bureau': {
        name: 'Census Bureau Data Systems',
        client: 'U.S. Census Bureau',
        sector: 'Federal',
        frameworks: ['FedRAMP (Moderate)', 'FISMA'],
        content: `Q1.1: Describe your experience with large-scale data collection systems.
Q1.2: What is your experience with confidential statistical data protection?
Q2.1: How do you protect personally identifiable information (PII)?
Q2.2: Explain your approach to data anonymization and de-identification.`
    }
};

const DEMO_RESPONSES = {
    'Security & Compliance': 'We implement comprehensive security controls aligned with regulatory requirements. Our multi-layered approach includes encryption, access controls, continuous monitoring, and regular security assessments. All systems are audited quarterly and maintain current compliance certifications.',
    'Data & Privacy': 'Our data protection strategy ensures full compliance with privacy regulations. We implement data classification schemes, secure handling procedures, and restricted access controls. All personnel receive annual privacy and security training.',
    'Organizational': 'Our security and compliance leadership reports directly to the CTO and CFO. We maintain clear accountability through documented governance structures and regular executive oversight. Cross-functional teams ensure integrated risk management.',
    'Operations': 'Our operational processes are documented and regularly reviewed. We maintain comprehensive standard operating procedures covering all critical functions with documented change management and approval workflows.',
    'Technical Infrastructure': 'Our cloud infrastructure supports high availability and disaster recovery with RTO/RPO objectives of 4 hours and 1 hour respectively. Systems implement encryption at rest and in transit with defense-in-depth security architecture.',
    'Assessment & Audit': 'We conduct security assessments quarterly including vulnerability scans and penetration testing. All findings are documented, prioritized by risk level, and remediated according to our vulnerability management program.',
    'Incident Response': 'Our incident response program includes documented procedures, regular tabletop exercises, and 24/7 on-call support. We conduct post-incident reviews and maintain a breach notification protocol compliant with regulatory requirements.',
    'General': 'We are committed to implementing best practices and maintaining strong security postures across all operations.'
};

class EnterpriseRFPTool {
    constructor() {
        this.currentRFP = null;
        this.questions = [];
        this.responses = {};
        this.referenceDocuments = [];
        this.allRFPs = [];
        this.auditTrail = [];
        this.teamMembers = [];
        this.demoMode = true;
        
        this.initializeEventListeners();
        this.loadDemoData();
    }

    initializeEventListeners() {
        const rfpSelect = document.getElementById('rfpSelect');
        if (rfpSelect) rfpSelect.addEventListener('change', () => this.loadSampleRFP());
        
        const filterQuestions = document.getElementById('filterQuestions');
        if (filterQuestions) filterQuestions.addEventListener('input', () => this.filterQuestions());
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterQuestions());
    }

    loadDemoData() {
        // Create RFP library
        this.allRFPs = Object.entries(MOCK_RFPS).map(([id, rfp]) => {
            const qCount = (rfp.content.match(/^Q\d+\.\d+:/gm) || []).length;
            return {
                id,
                ...rfp,
                dateCreated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                questionsCount: qCount,
                responseCount: Math.floor(Math.random() * 40 + 20),
                status: ['In Progress', 'Completed', 'Blocked'][Math.floor(Math.random() * 3)],
                owner: ['John Smith', 'Sarah Chen', 'Mike Johnson'][Math.floor(Math.random() * 3)],
                completionRate: Math.floor(Math.random() * 100)
            };
        });

        this.generateTeamData();
        this.generateAuditTrail();
        this.renderDashboard();
        console.log('✅ Demo data loaded:', this.allRFPs.length, 'RFPs');
    }

    generateTeamData() {
        this.teamMembers = [
            { name: 'John Smith', role: 'RFP Analyst', email: 'j.smith@company.com', responses: 45 },
            { name: 'Sarah Chen', role: 'Compliance Lead', email: 's.chen@company.com', responses: 38 },
            { name: 'Mike Johnson', role: 'Technical Lead', email: 'm.johnson@company.com', responses: 42 },
            { name: 'Jennifer Wu', role: 'Security Expert', email: 'j.wu@company.com', responses: 35 },
            { name: 'Robert Lee', role: 'Program Manager', email: 'r.lee@company.com', responses: 28 }
        ];
    }

    generateAuditTrail() {
        this.auditTrail = [
            { action: 'Loaded demo data', user: 'System', timestamp: new Date().toLocaleString(), rfp: 'System' },
            { action: 'Initialized dashboard', user: 'System', timestamp: new Date().toLocaleString(), rfp: 'System' }
        ];
    }

    renderDashboard() {
        // Pipeline Chart
        const pipelineCtx = document.getElementById('pipelineChart');
        if (pipelineCtx && window.Chart) {
            new Chart(pipelineCtx, {
                type: 'doughnut',
                data: {
                    labels: ['In Progress', 'Completed', 'Blocked'],
                    datasets: [{
                        data: [5, 4, 3],
                        backgroundColor: ['#fff3cd', '#d4edda', '#f8d7da']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        // Quality Chart
        const qualityCtx = document.getElementById('qualityChart');
        if (qualityCtx && window.Chart) {
            new Chart(qualityCtx, {
                type: 'bar',
                data: {
                    labels: ['Comprehensiveness', 'Accuracy', 'Clarity', 'Compliance'],
                    datasets: [{
                        label: 'Quality Score',
                        data: [82, 88, 85, 79],
                        backgroundColor: '#0052B4'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y' }
            });
        }

        // Activity Table
        const tableBody = document.getElementById('activityTable');
        if (tableBody) {
            tableBody.innerHTML = this.allRFPs.slice(0, 7).map(rfp => `
                <tr>
                    <td>${rfp.name}</td>
                    <td><span class="status-badge status-${rfp.status.toLowerCase().replace(' ', '-')}">${rfp.status}</span></td>
                    <td>${rfp.questionsCount}</td>
                    <td>${rfp.responseCount}</td>
                    <td>${rfp.owner}</td>
                    <td>${rfp.dateCreated.toLocaleDateString()}</td>
                    <td><button onclick="enterpriseRFP.loadRFPDetail('${rfp.id}')" class="btn-secondary" style="padding: 6px 12px; font-size: 12px; width: auto;">Analyze</button></td>
                </tr>
            `).join('');
        }

        // Quick Stats
        const quickStats = document.getElementById('quickStats');
        if (quickStats) {
            const totalQuestions = this.allRFPs.reduce((sum, r) => sum + r.questionsCount, 0);
            const avgCompletion = Math.round(this.allRFPs.reduce((sum, r) => sum + r.completionRate, 0) / this.allRFPs.length);
            quickStats.innerHTML = `
                <div class="stat-item"><strong>Total RFPs:</strong> ${this.allRFPs.length}</div>
                <div class="stat-item"><strong>Total Questions:</strong> ${totalQuestions}</div>
                <div class="stat-item"><strong>Avg Completion:</strong> ${avgCompletion}%</div>
                <div class="stat-item"><strong>Team Members:</strong> ${this.teamMembers.length}</div>
            `;
        }

        // Framework List
        const frameworkList = document.getElementById('frameworkList');
        if (frameworkList) {
            const frameworks = {};
            this.allRFPs.forEach(rfp => {
                rfp.frameworks.forEach(fw => {
                    frameworks[fw] = (frameworks[fw] || 0) + 1;
                });
            });
            frameworkList.innerHTML = Object.entries(frameworks)
                .map(([fw, count]) => `<div class="framework-item">${fw}: ${count} RFPs</div>`)
                .join('');
        }

        // Priority Items
        const priorityList = document.getElementById('priorityList');
        if (priorityList) {
            priorityList.innerHTML = this.allRFPs
                .filter(r => r.status === 'Blocked')
                .slice(0, 3)
                .map(r => `<div class="priority-item">⚠️ ${r.name}</div>`)
                .join('');
        }
    }

    loadSampleRFP() {
        const selectValue = document.getElementById('rfpSelect').value;
        if (selectValue && MOCK_RFPS[selectValue]) {
            this.currentRFP = MOCK_RFPS[selectValue];
            document.getElementById('uploadStatus').textContent = `✅ Loaded: ${this.currentRFP.name}`;
            this.extractAndAnalyze();
        }
    }

    extractAndAnalyze() {
        if (!this.currentRFP) {
            alert('Please select an RFP first');
            return;
        }

        this.questions = [];
        const lines = this.currentRFP.content.split('\n');
        const questionPattern = /^Q(\d+\.\d+):\s*(.+)$/;

        lines.forEach((line) => {
            const match = line.match(questionPattern);
            if (match) {
                const questionText = match[2];
                this.questions.push({
                    id: `Q${this.questions.length + 1}`,
                    number: match[1],
                    text: questionText,
                    category: this.classifyQuestion(questionText),
                    framework: this.detectFrameworks(questionText),
                    priority: Math.random() > 0.5 ? 'High' : 'Medium'
                });
            }
        });

        const qCount = document.getElementById('qCount');
        if (qCount) qCount.textContent = this.questions.length;

        this.renderQuestions();
        this.renderAnalytics();
        this.addAuditLog(`Extracted ${this.questions.length} questions from ${this.currentRFP.name}`);
        
        console.log('✅ Extracted questions:', this.questions.length);
    }

    classifyQuestion(text) {
        const lowerText = text.toLowerCase();
        
        if (/security|compliance|control|nist|fedramp|encryption|audit/i.test(lowerText))
            return 'Security & Compliance';
        if (/data|privacy|hipaa|gdpr|pii|phi|protection/i.test(lowerText))
            return 'Data & Privacy';
        if (/organization|structure|management|governance|leadership|chart/i.test(lowerText))
            return 'Organizational';
        if (/process|procedure|operation|maintenance|patch|window/i.test(lowerText))
            return 'Operations';
        if (/system|infrastructure|cloud|architecture|network|availability/i.test(lowerText))
            return 'Technical Infrastructure';
        if (/assessment|audit|test|evaluation|scan|penetration|vulnerability/i.test(lowerText))
            return 'Assessment & Audit';
        if (/incident|breach|response|recovery|disaster|ato|authorization/i.test(lowerText))
            return 'Incident Response';
        
        return 'General';
    }

    detectFrameworks(text) {
        const frameworks = [];
        if (/NIST|800-53|800-171/i.test(text)) frameworks.push('NIST');
        if (/FedRAMP|ATO|Authorization/i.test(text)) frameworks.push('FedRAMP');
        if (/HIPAA|BAA|PHI/i.test(text)) frameworks.push('HIPAA');
        if (/GDPR|CCPA/i.test(text)) frameworks.push('Data Privacy');
        if (/SOC\s*2/i.test(text)) frameworks.push('SOC 2');
        if (/CJIS|Criminal Justice/i.test(text)) frameworks.push('CJIS');
        if (/FISMA/i.test(text)) frameworks.push('FISMA');
        return frameworks.length > 0 ? frameworks.join(', ') : 'General';
    }

    renderQuestions() {
        const grid = document.getElementById('questionsGrid');
        if (!grid) return;

        const category = document.getElementById('categoryFilter')?.value || '';
        const filter = document.getElementById('filterQuestions')?.value.toLowerCase() || '';

        let filtered = this.questions.filter(q =>
            (!category || q.category === category) &&
            (q.text.toLowerCase().includes(filter) || q.id.toLowerCase().includes(filter))
        );

        grid.innerHTML = filtered.map(q => `
            <div class="question-card" onclick="enterpriseRFP.focusQuestion('${q.id}')">
                <div class="question-number">${q.id}</div>
                <div class="question-text">${q.text}</div>
                <div class="question-meta">
                    <span style="background: #0052B4; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px;">${q.category}</span>
                    <span style="background: #e0e0e0; padding: 2px 8px; border-radius: 3px; font-size: 11px;">${q.framework}</span>
                    <span style="background: ${q.priority === 'High' ? '#f8d7da' : '#fff3cd'}; padding: 2px 8px; border-radius: 3px; font-size: 11px;">${q.priority}</span>
                </div>
            </div>
        `).join('');

        console.log('✅ Rendered questions:', filtered.length);
    }

    filterQuestions() {
        this.renderQuestions();
    }

    async generateAllResponses() {
        for (let i = 0; i < this.questions.length; i++) {
            const q = this.questions[i];
            if (!this.responses[q.id]) {
                await this.generateResponse(q.id);
                await new Promise(r => setTimeout(r, 200));
            }
        }
        this.renderResponses();
        console.log('✅ Generated all responses');
    }

    async generateResponse(questionId) {
        const q = this.questions.find(qq => qq.id === questionId);
        if (!q) return;

        const template = DEMO_RESPONSES[q.category] || DEMO_RESPONSES['General'];

        this.responses[questionId] = {
            text: template,
            status: 'generated',
            timestamp: new Date().toLocaleTimeString(),
            category: q.category
        };

        this.addAuditLog(`Generated response for ${questionId}`);
    }

    renderResponses() {
        const container = document.getElementById('responsesContainer');
        if (!container) return;

        container.innerHTML = this.questions.map(q => {
            const resp = this.responses[q.id];
            return `
            <div class="response-item">
                <div class="response-header">
                    <div class="response-question"><strong>${q.id}:</strong> ${q.text.substring(0, 60)}...</div>
                    <div class="response-status" style="background: ${resp ? '#d4edda' : '#fff3cd'}; color: ${resp ? '#155724' : '#856404'};">${resp ? 'READY' : 'PENDING'}</div>
                </div>
                <div class="response-content">
                    ${resp?.text || '<em>Click "Generate" to create response...</em>'}
                </div>
                <div class="response-actions">
                    <button onclick="enterpriseRFP.generateResponse('${q.id}'); enterpriseRFP.renderResponses();" style="flex: 1; padding: 8px 12px; background: #0052B4; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">🔄 Generate</button>
                    <button onclick="enterpriseRFP.editResponse('${q.id}');" style="flex: 1; padding: 8px 12px; background: #0052B4; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-left: 8px;">✏️ Edit</button>
                    <button onclick="enterpriseRFP.copyResponse('${q.id}');" style="flex: 1; padding: 8px 12px; background: #0052B4; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; margin-left: 8px;">📋 Copy</button>
                </div>
            </div>
            `;
        }).join('');

        console.log('✅ Rendered responses');
    }

    renderAnalytics() {
        // Category breakdown
        const categories = {};
        this.questions.forEach(q => {
            categories[q.category] = (categories[q.category] || 0) + 1;
        });
        document.getElementById('categoryBreakdown').innerHTML = Object.entries(categories)
            .map(([cat, count]) => `<div>${cat}: ${count}</div>`).join('');

        // Framework breakdown
        const frameworks = {};
        this.questions.forEach(q => {
            q.framework.split(', ').forEach(fw => {
                frameworks[fw] = (frameworks[fw] || 0) + 1;
            });
        });
        document.getElementById('frameworkBreakdown').innerHTML = Object.entries(frameworks)
            .map(([fw, count]) => `<div>${fw}: ${count}</div>`).join('');

        // Sentiment
        const technical = this.questions.filter(q => q.category === 'Technical Infrastructure').length;
        const compliance = this.questions.filter(q => q.category.includes('Compliance') || q.category === 'Assessment & Audit').length;
        document.getElementById('sentimentAnalysis').innerHTML = `<div>Technical: ${technical}</div><div>Compliance: ${compliance}</div>`;

        // Keywords
        const keywords = ['security', 'compliance', 'data', 'system', 'access', 'monitoring'];
        document.getElementById('keywordAnalysis').innerHTML = keywords.join(', ');
    }

    focusQuestion(questionId) {
        this.generateResponse(questionId).then(() => this.renderResponses());
    }

    editResponse(questionId) {
        const current = this.responses[questionId]?.text || '';
        const updated = prompt('Edit response:', current);
        if (updated !== null) {
            this.responses[questionId] = { text: updated, status: 'edited' };
            this.renderResponses();
            this.addAuditLog(`Edited response for ${questionId}`);
        }
    }

    copyResponse(questionId) {
        const text = this.responses[questionId]?.text || '';
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Response copied to clipboard!');
            });
        }
    }

    exportCompletePackage() {
        let csv = 'Question ID,Question,Category,Framework,Response\n';
        this.questions.forEach(q => {
            const resp = this.responses[q.id]?.text || '(Not generated)';
            csv += `"${q.id}","${q.text.replace(/"/g, '""')}","${q.category}","${q.framework}","${resp.replace(/"/g, '""')}"\n`;
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `RFP_Responses_${new Date().toISOString().split('T')[0]}.csv`);
        element.click();
        
        alert('✅ Export complete!');
    }

    addAuditLog(action) {
        this.auditTrail.push({
            action,
            user: 'Current User',
            timestamp: new Date().toLocaleString(),
            rfp: this.currentRFP?.name || 'N/A'
        });
    }

    toggleResponseView() {
        const container = document.getElementById('responsesContainer');
        if (container) {
            container.style.display = container.style.display === 'none' ? 'flex' : 'none';
        }
    }

    saveSettings() {
        alert('✅ Settings saved successfully!');
        this.addAuditLog('Settings updated');
    }

    saveTemplate() {
        alert('✅ Template saved!');
    }

    saveOrgSettings() {
        alert('✅ Organization settings saved!');
    }

    exportAllData() {
        const data = {
            rfps: this.allRFPs,
            currentAnalysis: { questions: this.questions, responses: this.responses },
            auditTrail: this.auditTrail
        };
        const json = JSON.stringify(data, null, 2);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json));
        element.setAttribute('download', 'rfp_suite_backup.json');
        element.click();
        
        alert('✅ Data exported!');
    }

    clearCache() {
        this.responses = {};
        this.questions = [];
        alert('✅ Cache cleared!');
    }

    loadRFPDetail(rfpId) {
        const rfp = this.allRFPs.find(r => r.id === rfpId);
        if (rfp) {
            const mockRFP = MOCK_RFPS[rfpId];
            if (mockRFP) {
                document.getElementById('rfpSelect').value = rfpId;
                this.loadSampleRFP();
            }
        }
    }
}

// Initialize
let enterpriseRFP = null;

// View Switching
function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(`${view}-view`);
    if (targetView) targetView.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList.add('active');
}

function loadSampleRFP() {
    enterpriseRFP?.loadSampleRFP();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    enterpriseRFP = new EnterpriseRFPTool();
    console.log('✅ Enterprise RFP Tool initialized');
});
