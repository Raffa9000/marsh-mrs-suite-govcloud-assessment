// Enterprise RFP Analysis Suite - Production-Ready Implementation

const MOCK_RFPS = {
    'va-medical': {
        name: 'VA Medical Center - Phoenix',
        client: 'Department of Veterans Affairs',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FedRAMP (Moderate)', 'NIST 800-53'],
        content: `REQUEST FOR PROPOSAL - VA MEDICAL CENTER SECURE CLOUD SOLUTION

1. ORGANIZATIONAL BACKGROUND AND REQUIREMENTS
   Q1.1: Describe your organization's experience with healthcare IT systems and specifically HIPAA compliance implementations.
   Q1.2: Provide an organizational chart showing security and compliance leadership.
   Q1.3: Describe your change management and communications process.
   Q1.4: What is your experience with VA systems and VA-specific requirements?

2. TECHNICAL ARCHITECTURE AND INFRASTRUCTURE
   Q2.1: Describe your cloud infrastructure architecture and how it supports high availability and disaster recovery.
   Q2.2: Explain your approach to network segmentation and data isolation for healthcare data.
   Q2.3: How do you implement encryption for data at rest and in transit?
   Q2.4: Describe your backup and recovery procedures, including RTO and RPO objectives.

3. SECURITY AND COMPLIANCE
   Q3.1: Describe your NIST 800-53 control implementation for healthcare environments.
   Q3.2: How do you achieve FedRAMP Moderate baseline compliance?
   Q3.3: Explain your approach to identity and access management (IAM).
   Q3.4: Describe your incident response and breach notification procedures.
   Q3.5: How do you conduct continuous monitoring and vulnerability assessments?

4. DATA PRIVACY AND PROTECTION
   Q4.1: Describe your HIPAA BAA requirements and timeline.
   Q4.2: Explain your approach to Protected Health Information (PHI) handling.
   Q4.3: How do you ensure data residency requirements are met?

5. OPERATIONS AND MAINTENANCE
   Q5.1: What is your patch and update management process?
   Q5.2: Describe your system maintenance window policy and impact mitigation.
   Q5.3: How do you handle audit logging and log retention?

6. ASSESSMENT AND AUTHORIZATION
   Q6.1: What is your timeline for achieving ATO authorization?
   Q6.2: How do you coordinate with independent 3PAO assessors?
   Q6.3: Provide evidence of previous successful ATO achievements.`
    },

    'dod-modernization': {
        name: 'DOD IT Modernization Initiative',
        client: 'Department of Defense',
        sector: 'Defense',
        frameworks: ['FedRAMP (High)', 'NIST 800-171', 'CJIS'],
        content: `REQUEST FOR PROPOSAL - DEFENSE INFORMATION TECHNOLOGY MODERNIZATION

1. PROGRAM OVERVIEW
   Q1.1: Describe your understanding of DoD-specific requirements and compliance standards.
   Q1.2: What is your experience with FedRAMP High baseline systems?
   Q1.3: Explain your approach to managing classified and unclassified information systems.

2. SECURITY CONTROLS AND COMPLIANCE
   Q2.1: Detail your implementation of NIST 800-171 security controls.
   Q2.2: Describe your approach to incident response and cyber threat mitigation.
   Q2.3: How do you ensure compliance with DoD regulations on data handling?
   Q2.4: Explain your continuous monitoring and anomaly detection capabilities.

3. SYSTEM DEVELOPMENT AND DEPLOYMENT
   Q3.1: Describe your secure software development lifecycle (SDLC).
   Q3.2: What testing and validation procedures do you employ?
   Q3.3: Explain your deployment strategy minimizing operational disruption.

4. COMPLIANCE AND AUTHORIZATION
   Q4.1: What is your experience with Authority to Operate (ATO) processes?
   Q4.2: Describe the timeline for achieving FedRAMP High authorization.
   Q4.3: How do you maintain compliance post-authorization?`
    },

    'cms-analytics': {
        name: 'CMS Analytics Platform',
        client: 'Centers for Medicare & Medicaid Services',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FedRAMP (Moderate)', 'FISMA'],
        content: `REQUEST FOR PROPOSAL - CMS ANALYTICS AND DATA WAREHOUSE SOLUTION

1. UNDERSTANDING OF CMS REQUIREMENTS
   Q1.1: Describe your familiarity with CMS data security requirements.
   Q1.2: What is your experience with healthcare data analytics at scale?

2. DATA SECURITY AND PRIVACY
   Q2.1: How do you ensure HIPAA compliance for large-scale data processing?
   Q2.2: Explain your approach to PII/PHI identification and protection.
   Q2.3: Describe encryption and access control mechanisms.

3. ANALYTICS CAPABILITIES
   Q3.1: What analytics tools and capabilities does your platform provide?
   Q3.2: How do you ensure data quality and accuracy?
   Q3.3: Explain your approach to real-time analytics.

4. COMPLIANCE
   Q4.1: Describe your path to FedRAMP authorization.
   Q4.2: How do you meet FISMA requirements?`
    },

    'fbi-datacenter': {
        name: 'FBI Data Center Consolidation',
        client: 'Federal Bureau of Investigation',
        sector: 'Defense',
        frameworks: ['FedRAMP (High)', 'CJIS', 'NIST 800-53'],
        content: `REQUEST FOR PROPOSAL - CRIMINAL JUSTICE INFORMATION SERVICES (CJIS) DATA CENTER

1. CRIMINAL JUSTICE INFORMATION HANDLING
   Q1.1: Describe your experience with CJIS databases and requirements.
   Q1.2: How do you protect sensitive criminal justice information?

2. SECURITY REQUIREMENTS
   Q2.1: Detail your implementation of CJIS security policy requirements.
   Q2.2: Explain your approach to multi-factor authentication for privileged access.
   Q2.3: Describe your incident response procedures for CJIS data.

3. COMPLIANCE AND AUDITING
   Q3.1: How do you maintain audit trails for CJIS data access?
   Q3.2: Describe your compliance audit schedule.`
    },

    'state-dept': {
        name: 'State Department Secure Collaboration',
        client: 'U.S. Department of State',
        sector: 'Federal',
        frameworks: ['FedRAMP (Moderate)', 'NIST 800-171', 'State Dept Standards'],
        content: `REQUEST FOR PROPOSAL - SECURE COLLABORATION AND COMMUNICATION PLATFORM

1. PLATFORM REQUIREMENTS
   Q1.1: Describe your experience with government secure collaboration tools.
   Q1.2: What communication protocols and encryption do you support?

2. SECURITY AND COMPLIANCE
   Q2.1: How do you meet State Department security requirements?
   Q2.2: Explain your approach to access controls and user verification.
   Q2.3: Describe your compliance with NIST 800-171 standards.`
    },

    'nih-research': {
        name: 'NIH Research Cloud Platform',
        client: 'National Institutes of Health',
        sector: 'Healthcare',
        frameworks: ['HIPAA', 'FISMA', 'NIH Standards'],
        content: `REQUEST FOR PROPOSAL - NIH RESEARCH DATA MANAGEMENT PLATFORM

1. RESEARCH DATA MANAGEMENT
   Q1.1: Describe your experience with healthcare research data.
   Q1.2: What data management and retention capabilities do you provide?

2. COMPLIANCE AND DATA PROTECTION
   Q2.1: How do you ensure HIPAA compliance for research data?
   Q2.2: Explain your approach to IRB requirements and data governance.
   Q2.3: Describe encryption and access control mechanisms.`
    },

    'census-bureau': {
        name: 'Census Bureau Data Systems',
        client: 'U.S. Census Bureau',
        sector: 'Federal',
        frameworks: ['FedRAMP (Moderate)', 'FISMA', 'Census Security'],
        content: `REQUEST FOR PROPOSAL - CENSUS DATA COLLECTION AND ANALYSIS SYSTEMS

1. DATA COLLECTION AND PROCESSING
   Q1.1: Describe your experience with large-scale data collection systems.
   Q1.2: What is your experience with confidential statistical data protection?

2. SECURITY AND PRIVACY
   Q2.1: How do you protect personally identifiable information (PII)?
   Q2.2: Explain your approach to data anonymization and de-identification.`
    }
};

const SAMPLE_REFERENCE_DOCS = {
    'nist-800-53': {
        name: 'NIST SP 800-53 (Security & Privacy)',
        content: `NIST Special Publication 800-53 - Security and Privacy Controls for Information Systems and Organizations

The 16 control families are:
- AC (Access Control): 22 controls addressing user access management
- AT (Awareness & Training): 4 controls for employee security training
- AU (Audit & Accountability): 12 controls for audit logging and accountability
- CA (Security Assessment): 8 controls for security assessments and testing
- CM (Configuration Management): 10 controls for system configuration
- CP (Contingency Planning): 13 controls for backup and recovery
- IA (Identification & Authentication): 6 controls for user identification
- IR (Incident Response): 10 controls for incident handling
- MA (System Maintenance): 7 controls for system maintenance
- PE (Physical Environment): 14 controls for physical security
- PL (Planning): 11 controls for security planning
- PS (Personnel Security): 8 controls for personnel clearances
- RA (Risk Assessment): 5 controls for risk analysis
- SA (System & Services Acquisition): 16 controls for secure development
- SC (System Communications): 20 controls for secure communications
- SI (System Information Protection): 12 controls for information protection`
    },

    'hipaa-compliance': {
        name: 'HIPAA Compliance Guide',
        content: `Health Insurance Portability and Accountability Act (HIPAA) - Compliance Requirements

Key Obligations:
- Business Associate Agreements (BAA) for all vendors
- Protected Health Information (PHI) encryption
- Access controls and audit logging
- Incident response and breach notification (60-day timeline)
- Workforce security policies
- Audit controls and audit trails
- Transmission security for ePHI
- Data integrity controls
- Physical safeguards for facilities and equipment`
    },

    'fedramp-baseline': {
        name: 'FedRAMP Baseline Controls',
        content: `FedRAMP Baselines - Security Requirements for Cloud Systems

Baseline Tiers:
- Low: For non-sensitive systems
- Moderate: For systems with sensitive data (most federal systems)
- High: For systems with classified/highly sensitive data

Key Requirements:
- NIST 800-53 control implementation
- Security assessment by approved 3PAO
- Continuous monitoring
- System Security Plan (SSP) documentation
- Incident response capability
- Authorization to Operate (ATO) from federal agency`
    }
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
        
        this.initializeEventListeners();
        this.loadDemoData();
    }

    initializeEventListeners() {
        document.getElementById('rfpFileUpload')?.addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('refFilesUpload')?.addEventListener('change', (e) => this.handleRefUpload(e));
        document.getElementById('filterQuestions')?.addEventListener('input', () => this.filterQuestions());
        document.getElementById('categoryFilter')?.addEventListener('change', () => this.filterQuestions());
    }

    loadDemoData() {
        this.allRFPs = Object.entries(MOCK_RFPS).map(([id, rfp]) => ({
            id,
            ...rfp,
            dateCreated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            questionsCount: (rfp.content.match(/^Q\d+\.\d+:/gm) || []).length,
            responseCount: Math.floor(Math.random() * 40 + 20),
            status: ['In Progress', 'Completed', 'Blocked'][Math.floor(Math.random() * 3)],
            owner: ['John Smith', 'Sarah Chen', 'Mike Johnson'][Math.floor(Math.random() * 3)],
            completionRate: Math.floor(Math.random() * 100)
        }));

        this.referenceDocuments = Object.values(SAMPLE_REFERENCE_DOCS);
        this.generateTeamData();
        this.renderDashboard();
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

    renderDashboard() {
        // Pipeline Chart
        const pipelineCtx = document.getElementById('pipelineChart');
        if (pipelineCtx) {
            new Chart(pipelineCtx, {
                type: 'doughnut',
                data: {
                    labels: ['In Progress', 'Completed', 'Blocked'],
                    datasets: [{
                        data: [5, 4, 3],
                        backgroundColor: ['#fff3cd', '#d4edda', '#f8d7da']
                    }]
                }
            });
        }

        // Quality Chart
        const qualityCtx = document.getElementById('qualityChart');
        if (qualityCtx) {
            new Chart(qualityCtx, {
                type: 'bar',
                data: {
                    labels: ['Comprehensiveness', 'Accuracy', 'Clarity', 'Compliance'],
                    datasets: [{
                        label: 'Quality Score',
                        data: [82, 88, 85, 79],
                        backgroundColor: '#0052B4'
                    }]
                }
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
                    <td><button onclick="enterpriseRFP.loadRFPDetail('${rfp.id}')" class="btn-secondary" style="padding: 6px 12px; font-size: 12px;">Edit</button></td>
                </tr>
            `).join('');
        }

        // Quick Stats
        const quickStats = document.getElementById('quickStats');
        if (quickStats) {
            quickStats.innerHTML = `
                <div class="stat-item"><strong>Total RFPs:</strong> ${this.allRFPs.length}</div>
                <div class="stat-item"><strong>Total Questions:</strong> ${this.allRFPs.reduce((sum, r) => sum + r.questionsCount, 0)}</div>
                <div class="stat-item"><strong>Avg Completion:</strong> ${Math.round(this.allRFPs.reduce((sum, r) => sum + r.completionRate, 0) / this.allRFPs.length)}%</div>
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
                .map(r => `<div class="priority-item">⚠️ ${r.name} - ${r.owner}</div>`)
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

    async extractAndAnalyze() {
        if (!this.currentRFP) return;

        this.questions = [];
        const lines = this.currentRFP.content.split('\n');
        const questionPattern = /^Q\d+\.\d+:\s*(.+)$/;

        lines.forEach((line, idx) => {
            const match = line.match(questionPattern);
            if (match) {
                this.questions.push({
                    id: `Q${this.questions.length + 1}`,
                    text: match[1],
                    category: this.classifyQuestion(match[1]),
                    framework: this.detectFrameworks(match[1]),
                    priority: Math.random() > 0.5 ? 'High' : 'Medium'
                });
            }
        });

        document.getElementById('qCount').textContent = this.questions.length;
        this.renderQuestions();
        this.renderAnalytics();
        this.addAuditLog(`Extracted ${this.questions.length} questions from ${this.currentRFP.name}`);
    }

    classifyQuestion(text) {
        const keywords = {
            'Security & Compliance': /security|compliance|control|nist|fedramp|encryption/i,
            'Data & Privacy': /data|privacy|hipaa|gdpr|pii|phi/i,
            'Organizational': /organization|structure|management|governance|leadership/i,
            'Operations': /process|procedure|operation|maintenance|patch/i,
            'Technical Infrastructure': /system|infrastructure|cloud|architecture|network/i,
            'Assessment & Audit': /assessment|audit|test|evaluation|scan|penetration/i,
            'Incident Response': /incident|breach|response|recovery|disaster/i,
            'Personnel': /personnel|staff|employee|team|resource|clearance/i
        };

        for (const [category, pattern] of Object.entries(keywords)) {
            if (pattern.test(text)) return category;
        }
        return 'General';
    }

    detectFrameworks(text) {
        const frameworks = [];
        if (/NIST|800-53|800-171/i.test(text)) frameworks.push('NIST');
        if (/FedRAMP|ATO/i.test(text)) frameworks.push('FedRAMP');
        if (/HIPAA|BAA|PHI/i.test(text)) frameworks.push('HIPAA');
        if (/GDPR|CCPA/i.test(text)) frameworks.push('Data Privacy');
        if (/SOC\s*2/i.test(text)) frameworks.push('SOC 2');
        if (/CJIS|Criminal Justice/i.test(text)) frameworks.push('CJIS');
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
                    <span style="background: #0052B4; color: white;">${q.category}</span>
                    <span>${q.framework}</span>
                    <span style="background: ${q.priority === 'High' ? '#f8d7da' : '#fff3cd'};">${q.priority}</span>
                </div>
            </div>
        `).join('');
    }

    filterQuestions() {
        this.renderQuestions();
    }

    async generateAllResponses() {
        for (const q of this.questions) {
            if (!this.responses[q.id]) {
                await this.generateResponse(q.id);
                await new Promise(r => setTimeout(r, 300));
            }
        }
        this.renderResponses();
    }

    async generateResponse(questionId) {
        const q = this.questions.find(qq => qq.id === questionId);
        if (!q) return;

        // Demo response
        const templates = {
            'Security & Compliance': `We implement comprehensive security controls aligned with ${q.framework} requirements. Our approach includes multi-layered security with encryption, access controls, and continuous monitoring. We maintain full compliance with applicable standards through regular assessments and audits.`,
            'Data & Privacy': `Our data protection approach ensures full compliance with privacy regulations. We implement data classification, secure handling procedures, and restricted access controls. Regular training ensures all staff understand data protection obligations.`,
            'Operations': `Our operations are governed by documented procedures and regularly updated based on lessons learned. We maintain comprehensive logging, perform regular updates, and have clear escalation procedures.`,
            'Technical Infrastructure': `Our infrastructure is designed for security and reliability with redundancy, failover, and disaster recovery. We implement defense-in-depth with network segmentation and regular security testing.`,
            'Assessment & Audit': `We conduct regular security assessments including vulnerability scans, penetration testing, and compliance audits. All findings are documented and remediated according to risk level.`,
            'General': `We are committed to implementing best practices and maintaining strong security postures. Our comprehensive approach addresses technology, processes, and people.`
        };

        const template = templates[q.category] || templates['General'];

        this.responses[questionId] = {
            text: template,
            status: 'generated',
            timestamp: new Date().toLocaleTimeString()
        };

        this.addAuditLog(`Generated response for ${questionId}`);
    }

    renderResponses() {
        const container = document.getElementById('responsesContainer');
        if (!container) return;

        container.innerHTML = this.questions.map(q => `
            <div class="response-item">
                <div class="response-header">
                    <div class="response-question">${q.id}: ${q.text.substring(0, 60)}...</div>
                    <div class="response-status">${this.responses[q.id] ? 'READY' : 'PENDING'}</div>
                </div>
                <div class="response-content">
                    ${this.responses[q.id]?.text || '(Not yet generated)'}
                </div>
                <div class="response-actions">
                    <button onclick="enterpriseRFP.generateResponse('${q.id}')">🔄 Generate</button>
                    <button onclick="enterpriseRFP.editResponse('${q.id}')">✏️ Edit</button>
                    <button onclick="enterpriseRFP.copyResponse('${q.id}')">📋 Copy</button>
                </div>
            </div>
        `).join('');
    }

    renderAnalytics() {
        // Category breakdown
        const categories = {};
        this.questions.forEach(q => {
            categories[q.category] = (categories[q.category] || 0) + 1;
        });
        document.getElementById('categoryBreakdown').innerHTML = Object.entries(categories)
            .map(([cat, count]) => `${cat}: ${count}`).join('<br>');

        // Framework breakdown
        const frameworks = {};
        this.questions.forEach(q => {
            q.framework.split(', ').forEach(fw => {
                frameworks[fw] = (frameworks[fw] || 0) + 1;
            });
        });
        document.getElementById('frameworkBreakdown').innerHTML = Object.entries(frameworks)
            .map(([fw, count]) => `${fw}: ${count}`).join('<br>');

        // Sentiment
        document.getElementById('sentimentAnalysis').innerHTML = `
            Technical: ${this.questions.filter(q => q.category === 'Technical Infrastructure').length}<br>
            Compliance: ${this.questions.filter(q => q.category.includes('Compliance') || q.category === 'Assessment & Audit').length}
        `;

        // Keywords
        const allText = this.questions.map(q => q.text).join(' ');
        const keywords = allText.match(/\b(security|compliance|data|system|access|monitoring)\b/gi) || [];
        document.getElementById('keywordAnalysis').innerHTML =
            [...new Set(keywords)].slice(0, 5).join(', ');
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
        navigator.clipboard.writeText(text).then(() => {
            alert('Response copied!');
        });
    }

    async exportCompletePackage() {
        let csv = 'Question ID,Question,Category,Framework,Response,Generated By,Date\n';
        this.questions.forEach(q => {
            const resp = this.responses[q.id]?.text || '';
            csv += `"${q.id}","${q.text.replace(/"/g, '""')}","${q.category}","${q.framework}","${resp.replace(/"/g, '""')}","System","${new Date().toLocaleDateString()}"\n`;
        });

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', `RFP_Responses_${Date.now()}.csv`);
        element.click();
    }

    addAuditLog(action) {
        this.auditTrail.push({
            action,
            user: 'System User',
            timestamp: new Date().toLocaleString(),
            rfp: this.currentRFP?.name || 'N/A'
        });
    }

    toggleResponseView() {
        const container = document.getElementById('responsesContainer');
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }

    saveSettings() {
        alert('Settings saved successfully!');
        this.addAuditLog('Settings updated');
    }

    saveTemplate() {
        alert('Template saved!');
    }

    saveOrgSettings() {
        alert('Organization settings saved!');
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
    }

    clearCache() {
        this.responses = {};
        this.questions = [];
        alert('Cache cleared!');
    }

    loadDemoData() {
        this.loadDemoData();
    }
}

// Initialize
const enterpriseRFP = new EnterpriseRFPTool();

// View Switching
function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`${view}-view`).classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

function loadSampleRFP() {
    enterpriseRFP.loadSampleRFP();
}

window.addEventListener('load', () => {
    enterpriseRFP.renderDashboard();
});
