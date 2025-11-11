// Enterprise RFP Analysis Suite - WITH EDIT FUNCTIONS

const MOCK_RFPS = {
    'va-medical': { name: 'VA Medical Center - Phoenix', client: 'VA', sector: 'Healthcare', frameworks: ['HIPAA', 'FedRAMP'], content: `Q1.1: Describe your organization's healthcare IT experience with HIPAA compliance.\nQ1.2: Provide organizational chart for security leadership.\nQ2.1: Describe cloud infrastructure architecture.\nQ2.2: Explain network segmentation approach.\nQ2.3: How do you implement encryption?\nQ3.1: Describe NIST 800-53 control implementation.\nQ3.2: How do you achieve FedRAMP Moderate compliance?\nQ3.3: Explain IAM approach.\nQ4.1: Describe HIPAA BAA requirements and timeline.` },
    'dod-modernization': { name: 'DOD IT Modernization', client: 'DOD', sector: 'Defense', frameworks: ['FedRAMP', 'NIST 800-171'], content: `Q1.1: Describe your understanding of DoD requirements.\nQ1.2: Experience with FedRAMP High systems?\nQ2.1: Implement NIST 800-171 controls?\nQ2.2: Incident response capability?\nQ3.1: Secure SDLC process?\nQ4.1: ATO authorization experience?` },
    'cms-analytics': { name: 'CMS Analytics Platform', client: 'CMS', sector: 'Healthcare', frameworks: ['HIPAA', 'FedRAMP'], content: `Q1.1: CMS data security familiarity?\nQ1.2: Healthcare data analytics at scale?\nQ2.1: HIPAA compliance for large-scale processing?\nQ2.2: PII/PHI identification approach?\nQ3.1: Analytics capabilities?\nQ4.1: FedRAMP authorization path?` },
    'fbi-datacenter': { name: 'FBI Data Center', client: 'FBI', sector: 'Defense', frameworks: ['CJIS', 'FedRAMP'], content: `Q1.1: CJIS database experience?\nQ1.2: Criminal justice information protection?\nQ2.1: CJIS security policy implementation?\nQ2.2: MFA for privileged access?\nQ3.1: Audit trail maintenance?` },
    'state-dept': { name: 'State Dept Collaboration', client: 'State', sector: 'Federal', frameworks: ['FedRAMP', 'NIST'], content: `Q1.1: Government secure collaboration tools?\nQ1.2: Encryption protocols supported?\nQ2.1: State Department security requirements?\nQ2.2: Access controls approach?` },
    'nih-research': { name: 'NIH Research Cloud', client: 'NIH', sector: 'Healthcare', frameworks: ['HIPAA', 'FISMA'], content: `Q1.1: Healthcare research data experience?\nQ1.2: Data management capabilities?\nQ2.1: HIPAA compliance for research?\nQ2.2: IRB requirements approach?` },
    'census-bureau': { name: 'Census Bureau Systems', client: 'Census', sector: 'Federal', frameworks: ['FISMA', 'FedRAMP'], content: `Q1.1: Large-scale data collection systems?\nQ1.2: Confidential data protection?\nQ2.1: PII protection approach?\nQ2.2: Data anonymization methods?` }
};

const DEMO_RESPONSES = {
    'Security & Compliance': 'We implement comprehensive security controls aligned with regulatory requirements. Multi-layered approach includes encryption, access controls, continuous monitoring, and regular assessments.',
    'Data & Privacy': 'Full compliance with privacy regulations through data classification, secure handling procedures, and restricted access controls. Annual training for all personnel.',
    'Organizational': 'Security leadership reports to CTO/CFO. Clear governance structures with documented accountability and executive oversight.',
    'Operations': 'Documented procedures with comprehensive standard operating procedures and change management workflows.',
    'Technical Infrastructure': 'Cloud infrastructure with RTO/RPO of 4 hours/1 hour. Encryption at rest and in transit with defense-in-depth architecture.',
    'Assessment & Audit': 'Quarterly security assessments including vulnerability scans and penetration testing. Risk-based remediation.',
    'Incident Response': 'Documented procedures, 24/7 on-call support, regular tabletop exercises, compliant breach notification.',
    'General': 'Committed to implementing best practices and maintaining strong security postures.'
};

class EnterpriseRFPTool {
    constructor() {
        this.currentRFP = null;
        this.questions = [];
        this.responses = new Map();
        this.allRFPs = [];
        this.teamMembers = [];
        this.dashboardRendered = false;
        
        this.init();
    }

    init() {
        this.loadDemoData();
        this.setupEventListeners();
        this.renderDashboard();
        console.log('✅ RFP Tool Ready');
    }

    setupEventListeners() {
        const rfpSelect = document.getElementById('rfpSelect');
        if (rfpSelect) rfpSelect.addEventListener('change', () => this.loadSampleRFP());
        
        const filterQuestions = document.getElementById('filterQuestions');
        if (filterQuestions) filterQuestions.addEventListener('input', () => this.renderQuestions());
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.renderQuestions());
    }

    loadDemoData() {
        this.allRFPs = Object.entries(MOCK_RFPS).map(([id, rfp]) => {
            const qCount = (rfp.content.match(/^Q\d+\.\d+:/gm) || []).length;
            return {
                id,
                ...rfp,
                questionsCount: qCount,
                status: ['In Progress', 'Completed', 'Blocked'][Math.floor(Math.random() * 3)],
                owner: ['John Smith', 'Sarah Chen', 'Mike Johnson'][Math.floor(Math.random() * 3)],
                completionRate: Math.floor(Math.random() * 100)
            };
        });

        this.teamMembers = [
            { name: 'John Smith', role: 'RFP Analyst', responses: 45 },
            { name: 'Sarah Chen', role: 'Compliance Lead', responses: 38 },
            { name: 'Mike Johnson', role: 'Technical Lead', responses: 42 }
        ];
    }

    renderDashboard() {
        if (this.dashboardRendered) return;
        this.dashboardRendered = true;

        const tableBody = document.getElementById('activityTable');
        if (tableBody) {
            tableBody.innerHTML = this.allRFPs.slice(0, 5).map(rfp => `
                <tr>
                    <td>${rfp.name}</td>
                    <td><span class="status-badge status-${rfp.status.toLowerCase().replace(' ', '-')}">${rfp.status}</span></td>
                    <td>${rfp.questionsCount}</td>
                    <td>${rfp.owner}</td>
                    <td><button onclick="tool.loadRFPDetail('${rfp.id}')" class="btn-secondary" style="padding: 6px 12px; font-size: 12px; width: auto;">Analyze</button></td>
                </tr>
            `).join('');
        }

        const quickStats = document.getElementById('quickStats');
        if (quickStats) {
            quickStats.innerHTML = `
                <div class="stat-item"><strong>Total RFPs:</strong> ${this.allRFPs.length}</div>
                <div class="stat-item"><strong>Questions:</strong> ${this.allRFPs.reduce((s, r) => s + r.questionsCount, 0)}</div>
                <div class="stat-item"><strong>Status:</strong> ${this.allRFPs.filter(r => r.status === 'Completed').length} Complete</div>
                <div class="stat-item"><strong>Team:</strong> ${this.teamMembers.length}</div>
            `;
        }

        const frameworkList = document.getElementById('frameworkList');
        if (frameworkList) {
            const fw = {};
            this.allRFPs.forEach(r => r.frameworks.forEach(f => { fw[f] = (fw[f] || 0) + 1; }));
            frameworkList.innerHTML = Object.entries(fw).map(([f, c]) => `<div style="padding: 8px; background: #f0f0f0; margin: 5px 0; border-radius: 4px; color: #333; font-weight: 500;">${f}: <strong>${c}</strong></div>`).join('');
        }

        const priorityList = document.getElementById('priorityList');
        if (priorityList) {
            priorityList.innerHTML = this.allRFPs
                .filter(r => r.status === 'Blocked')
                .slice(0, 3)
                .map(r => `<div style="padding: 8px; background: #fff3cd; margin: 5px 0; border-radius: 4px; color: #333;">⚠️ ${r.name}</div>`)
                .join('');
        }

        console.log('✅ Dashboard rendered');
    }

    loadSampleRFP() {
        const selectValue = document.getElementById('rfpSelect').value;
        if (selectValue && MOCK_RFPS[selectValue]) {
            this.currentRFP = MOCK_RFPS[selectValue];
            document.getElementById('uploadStatus').textContent = `✅ ${this.currentRFP.name}`;
            this.extractAndAnalyze();
        }
    }

    extractAndAnalyze() {
        if (!this.currentRFP) return;

        this.questions = [];
        this.responses.clear();

        const lines = this.currentRFP.content.split('\n');
        const pattern = /^Q(\d+\.\d+):\s*(.+)$/;

        lines.forEach((line) => {
            const match = line.match(pattern);
            if (match) {
                const text = match[2];
                this.questions.push({
                    id: `Q${this.questions.length + 1}`,
                    text,
                    category: this.classify(text),
                    framework: this.detectFrameworks(text)
                });
            }
        });

        const qCount = document.getElementById('qCount');
        if (qCount) qCount.textContent = this.questions.length;

        this.renderQuestions();
        this.renderAnalytics();
        console.log(`✅ Extracted ${this.questions.length} questions`);
    }

    classify(text) {
        const t = text.toLowerCase();
        if (/security|compliance|control|nist|encrypt|audit/i.test(t)) return 'Security & Compliance';
        if (/data|privacy|hipaa|gdpr|pii/i.test(t)) return 'Data & Privacy';
        if (/organization|structure|governance|leadership/i.test(t)) return 'Organizational';
        if (/process|procedure|operation|maintenance/i.test(t)) return 'Operations';
        if (/system|infrastructure|cloud|network|architecture/i.test(t)) return 'Technical Infrastructure';
        if (/assessment|audit|test|evaluation|scan/i.test(t)) return 'Assessment & Audit';
        if (/incident|breach|recovery|disaster/i.test(t)) return 'Incident Response';
        return 'General';
    }

    detectFrameworks(text) {
        const fw = [];
        if (/NIST|800-53|800-171/i.test(text)) fw.push('NIST');
        if (/FedRAMP|ATO/i.test(text)) fw.push('FedRAMP');
        if (/HIPAA|BAA|PHI/i.test(text)) fw.push('HIPAA');
        if (/CJIS/i.test(text)) fw.push('CJIS');
        if (/FISMA/i.test(text)) fw.push('FISMA');
        return fw.length > 0 ? fw.join(', ') : 'General';
    }

    renderQuestions() {
        const grid = document.getElementById('questionsGrid');
        if (!grid) return;

        const category = document.getElementById('categoryFilter')?.value || '';
        const filter = document.getElementById('filterQuestions')?.value.toLowerCase() || '';

        let filtered = this.questions.filter(q =>
            (!category || q.category === category) &&
            (q.text.toLowerCase().includes(filter) || q.id.includes(filter))
        );

        const pageSize = 20;
        const paged = filtered.slice(0, pageSize);

        grid.innerHTML = paged.map(q => `
            <div class="question-card" onclick="tool.focusQuestion('${q.id}')">
                <div class="question-number">${q.id}</div>
                <div class="question-text">${q.text}</div>
                <div class="question-meta">
                    <span style="background: #0052B4; color: white; padding: 2px 6px; border-radius: 2px; font-size: 10px;">${q.category}</span>
                    <span style="background: #e0e0e0; color: #333; padding: 2px 6px; border-radius: 2px; font-size: 10px;">${q.framework}</span>
                </div>
                <button onclick="tool.editQuestion('${q.id}')" style="margin-top: 8px; width: 100%; padding: 4px; background: white; color: #0052B4; border: 1px solid #0052B4; border-radius: 3px; font-size: 11px; cursor: pointer; font-weight: 500;">✏️ Edit Question</button>
            </div>
        `).join('');
    }

    editQuestion(questionId) {
        const q = this.questions.find(qq => qq.id === questionId);
        if (!q) return;
        
        const newText = prompt('Edit question text:', q.text);
        if (newText !== null && newText.trim()) {
            q.text = newText;
            this.renderQuestions();
            console.log(`✅ Edited ${questionId}`);
        }
    }

    async generateAllResponses() {
        for (let i = 0; i < this.questions.length; i++) {
            const q = this.questions[i];
            const template = DEMO_RESPONSES[q.category] || DEMO_RESPONSES['General'];
            this.responses.set(q.id, { text: template });
            await new Promise(r => setTimeout(r, 50));
        }
        this.renderResponses();
        alert(`✅ Generated ${this.questions.length} responses`);
    }

    renderResponses() {
        const container = document.getElementById('responsesContainer');
        if (!container) return;

        const visible = this.questions.slice(0, 15);

        container.innerHTML = visible.map(q => {
            const resp = this.responses.get(q.id);
            return `
            <div style="margin-bottom: 12px; padding: 12px; background: white; border: 1px solid #ddd; border-radius: 4px; border-left: 4px solid #0052B4;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; align-items: center;">
                    <strong style="font-size: 13px; color: #333;">${q.id}: ${q.text.substring(0, 50)}...</strong>
                    <span style="background: ${resp ? '#d4edda' : '#fff3cd'}; color: ${resp ? '#155724' : '#856404'}; padding: 2px 8px; font-size: 11px; border-radius: 3px; font-weight: 500;">${resp ? 'READY' : 'PENDING'}</span>
                </div>
                <div style="background: #f9f9f9; padding: 10px; border-radius: 3px; font-size: 13px; line-height: 1.5; margin-bottom: 10px; max-height: 100px; overflow-y: auto; color: #333; border: 1px solid #eee;">
                    ${resp?.text || '<em style="color: #999;">Not generated yet</em>'}
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="tool.generateOneResponse('${q.id}')" style="flex: 1; padding: 8px; background: #0052B4; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer; font-weight: 500;">Generate</button>
                    <button onclick="tool.editResponse('${q.id}')" style="flex: 1; padding: 8px; background: #0052B4; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer; font-weight: 500;">Edit</button>
                    <button onclick="tool.copyResponse('${q.id}')" style="flex: 1; padding: 8px; background: #0052B4; color: white; border: none; border-radius: 3px; font-size: 11px; cursor: pointer; font-weight: 500;">Copy</button>
                </div>
            </div>
            `;
        }).join('');

        if (this.questions.length > 15) {
            container.innerHTML += `<div style="text-align: center; color: #666; font-size: 12px; margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">Showing 15 of ${this.questions.length} responses</div>`;
        }
    }

    generateOneResponse(questionId) {
        const q = this.questions.find(qq => qq.id === questionId);
        if (!q) return;
        const template = DEMO_RESPONSES[q.category] || DEMO_RESPONSES['General'];
        this.responses.set(questionId, { text: template });
        this.renderResponses();
    }

    editResponse(questionId) {
        const resp = this.responses.get(questionId);
        if (!resp) {
            alert('Generate a response first');
            return;
        }
        
        const newText = prompt('Edit response:', resp.text);
        if (newText !== null && newText.trim()) {
            this.responses.set(questionId, { text: newText });
            this.renderResponses();
            console.log(`✅ Edited response for ${questionId}`);
        }
    }

    focusQuestion(questionId) {
        this.generateOneResponse(questionId);
    }

    copyResponse(questionId) {
        const text = this.responses.get(questionId)?.text;
        if (text) {
            navigator.clipboard.writeText(text).then(() => alert('✅ Copied!'));
        }
    }

    renderAnalytics() {
        const cats = {};
        const fws = {};
        this.questions.forEach(q => {
            cats[q.category] = (cats[q.category] || 0) + 1;
            q.framework.split(', ').forEach(f => { fws[f] = (fws[f] || 0) + 1; });
        });

        document.getElementById('categoryBreakdown').innerHTML = Object.entries(cats)
            .map(([c, n]) => `<div style="padding: 4px 0; color: #333;">${c}: ${n}</div>`).join('');
        document.getElementById('frameworkBreakdown').innerHTML = Object.entries(fws)
            .map(([f, n]) => `<div style="padding: 4px 0; color: #333;">${f}: ${n}</div>`).join('');
    }

    exportCompletePackage() {
        let csv = 'ID,Question,Category,Framework,Response\n';
        this.questions.forEach(q => {
            const resp = this.responses.get(q.id)?.text || '';
            csv += `"${q.id}","${q.text.replace(/"/g, '""')}","${q.category}","${q.framework}","${resp.replace(/"/g, '""')}"\n`;
        });

        const a = document.createElement('a');
        a.href = 'data:text/csv,' + encodeURIComponent(csv);
        a.download = `RFP_${Date.now()}.csv`;
        a.click();
        alert('✅ Exported!');
    }

    loadRFPDetail(rfpId) {
        const rfp = MOCK_RFPS[rfpId];
        if (rfp) {
            document.getElementById('rfpSelect').value = rfpId;
            this.loadSampleRFP();
        }
    }
}

let tool = null;

function switchView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`${view}-view`);
    if (target) target.classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event?.target?.classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
    if (!tool) tool = new EnterpriseRFPTool();
});
