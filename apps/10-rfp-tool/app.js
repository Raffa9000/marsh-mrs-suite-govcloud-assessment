// Enterprise RFP Q&A Tool - Industry-Grade Implementation
// Inspired by: Inventive AI, DeepRFP, Arphie, AutoRFP
// Core: Questions -> AI Responses -> Clause Voting -> Bulk Edit + Single Edit

const SAMPLE_CLAUSES = {
    'terms-payment': { id: 'terms-payment', text: 'Payment Terms: Net 30 upon invoice. 2% early payment discount if paid within 10 days.', votes: 0, rating: 0 },
    'terms-liability': { id: 'terms-liability', text: 'Limitation of Liability: In no event shall either party be liable for indirect, incidental, or consequential damages.', votes: 0, rating: 0 },
    'terms-confidentiality': { id: 'terms-confidentiality', text: 'Confidentiality: All information shared shall be treated as confidential and not disclosed to third parties.', votes: 0, rating: 0 },
    'terms-indemnity': { id: 'terms-indemnity', text: 'Indemnification: Each party shall defend and indemnify the other against claims arising from its breach.', votes: 0, rating: 0 },
    'terms-warranty': { id: 'terms-warranty', text: 'Warranty: Services provided are warranted to be performed in a professional and workmanlike manner.', votes: 0, rating: 0 },
    'terms-termination': { id: 'terms-termination', text: 'Termination: Either party may terminate upon 30 days written notice. Outstanding obligations remain.', votes: 0, rating: 0 },
    'data-security': { id: 'data-security', text: 'Data Security: Vendor shall implement reasonable security measures compliant with NIST 800-53 standards.', votes: 0, rating: 0 },
    'data-privacy': { id: 'data-privacy', text: 'Data Privacy: All PII/PHI handled in compliance with HIPAA and GDPR requirements.', votes: 0, rating: 0 }
};

const AI_RESPONSE_TEMPLATES = {
    'Security & Compliance': 'We maintain comprehensive security controls per NIST 800-53. Multi-layer encryption, 24/7 monitoring, SOC 2 Type II certified. Annual third-party assessments verify compliance.',
    'Data & Privacy': 'HIPAA BAA included. PII encrypted at rest/transit. Data residency in US/EU regions per requirement. GDPR compliant with Data Processing Agreement.',
    'Organizational': 'Security leadership reports to CISO. Governance framework with quarterly reviews. Incident response team available 24/7/365.',
    'Technical': 'Cloud-native architecture. RTO 4hrs, RPO 1hr. Auto-failover, multi-region redundancy. 99.99% SLA guaranteed.',
    'Operational': 'Patch management on monthly cycle. Change control board reviews all updates. Maintenance windows coordinated with client schedule.',
    'General': 'Best-in-class practices implemented. Regular assessments ensure continuous improvement. Dedicated support team assigned.'
};

class EnterpriseRFPApp {
    constructor() {
        this.questions = [];
        this.responses = new Map();
        this.clauseRepo = JSON.parse(JSON.stringify(SAMPLE_CLAUSES));
        this.currentView = 'bulk';
        this.selectedQuestionId = null;
        this.init();
    }

    init() {
        this.loadSampleQuestions();
        this.setupEventListeners();
        this.render();
    }

    loadSampleQuestions() {
        this.questions = [
            { id: 'q1', text: 'Describe your security controls and compliance framework.', category: 'Security & Compliance', relatedClauses: ['terms-liability', 'data-security'] },
            { id: 'q2', text: 'How do you protect PII and ensure data privacy?', category: 'Data & Privacy', relatedClauses: ['data-privacy', 'terms-confidentiality'] },
            { id: 'q3', text: 'What is your organizational structure and governance?', category: 'Organizational', relatedClauses: [] },
            { id: 'q4', text: 'Describe your cloud infrastructure and disaster recovery.', category: 'Technical', relatedClauses: ['terms-warranty'] },
            { id: 'q5', text: 'What are your patch management and maintenance procedures?', category: 'Operational', relatedClauses: ['terms-payment'] },
            { id: 'q6', text: 'How do you handle contract terms and liability?', category: 'General', relatedClauses: ['terms-liability', 'terms-indemnity', 'terms-termination'] }
        ];
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'bulk-mode') this.currentView = 'bulk';
            else if (e.target.dataset.action === 'single-mode') this.currentView = 'single';
            else if (e.target.dataset.action === 'clause-repo') this.currentView = 'clause-repo';
            this.render();
        });
    }

    render() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; min-height: 100vh;">
                ${this.renderHeader()}
                <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
                    ${this.currentView === 'bulk' ? this.renderBulkView() : 
                      this.currentView === 'single' ? this.renderSingleView() :
                      this.renderClauseRepo()}
                </div>
            </div>
        `;
    }

    renderHeader() {
        return `
            <div style="background: linear-gradient(135deg, #002C77 0%, #0052B4 100%); color: white; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="max-width: 1400px; margin: 0 auto;">
                    <h1 style="margin: 0; font-size: 28px;">🎯 RFP Q&A + Clause Voting System</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">AI-Generated Responses | Bulk Processing | Per-Question Edit | Clause Repository with Voting</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button data-action="bulk-mode" style="padding: 10px 16px; background: ${this.currentView === 'bulk' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 500;">📋 Bulk Q&A</button>
                        <button data-action="single-mode" style="padding: 10px 16px; background: ${this.currentView === 'single' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 500;">🎯 Single Q&A</button>
                        <button data-action="clause-repo" style="padding: 10px 16px; background: ${this.currentView === 'clause-repo' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; cursor: pointer; font-weight: 500;">⭐ Clause Repo</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderBulkView() {
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="grid-column: 1/-1;">
                    <button onclick="app.generateAllResponses()" style="padding: 12px 24px; background: #0052B4; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%;">
                        ⚡ GENERATE ALL RESPONSES AT ONCE
                    </button>
                </div>
                ${this.questions.map(q => `
                    <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #0052B4; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <strong style="color: #333;">${q.id.toUpperCase()}: ${q.text.substring(0, 60)}...</strong>
                            <span style="background: #0052B4; color: white; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; white-space: nowrap;">
                                ${this.responses.has(q.id) ? '✅ READY' : '⏳ PENDING'}
                            </span>
                        </div>
                        <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 13px; line-height: 1.5; color: #555; margin-bottom: 10px; max-height: 80px; overflow-y: auto;">
                            ${this.responses.has(q.id) ? this.responses.get(q.id).text : '<em style="color: #999;">Not generated yet</em>'}
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="app.generateResponse('${q.id}')" style="flex: 1; padding: 8px; background: #0052B4; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">Gen</button>
                            <button onclick="app.editResponse('${q.id}')" style="flex: 1; padding: 8px; background: #0052B4; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">✏️ Edit</button>
                            <button onclick="app.viewClauses('${q.id}')" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 500;">📌 Clauses</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSingleView() {
        return `
            <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                <h2 style="color: #333; margin-bottom: 20px;">Select a Question to Answer</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    ${this.questions.map(q => `
                        <div onclick="app.selectQuestion('${q.id}')" style="padding: 16px; background: ${this.selectedQuestionId === q.id ? '#e8f4f8' : '#f9f9f9'}; border: 2px solid ${this.selectedQuestionId === q.id ? '#0052B4' : '#ddd'}; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                            <strong style="color: #333;">${q.id.toUpperCase()}</strong>
                            <div style="font-size: 13px; color: #666; margin-top: 8px;">${q.text}</div>
                            <div style="font-size: 11px; color: #999; margin-top: 8px;">Category: ${q.category}</div>
                        </div>
                    `).join('')}
                </div>
                ${this.selectedQuestionId ? this.renderSingleQuestionEditor() : '<div style="color: #999; text-align: center; padding: 40px;">Select a question to begin</div>'}
            </div>
        `;
    }

    renderSingleQuestionEditor() {
        const q = this.questions.find(qq => qq.id === this.selectedQuestionId);
        const resp = this.responses.get(this.selectedQuestionId);
        
        return `
            <div style="border-top: 2px solid #ddd; padding-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #333; margin: 0;">Question: ${q.text}</h3>
                    <span style="background: ${resp ? '#d4edda' : '#fff3cd'}; color: ${resp ? '#155724' : '#856404'}; padding: 6px 12px; border-radius: 4px; font-weight: 500; font-size: 12px;">
                        ${resp ? '✅ COMPLETE' : '⏳ PENDING'}
                    </span>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #333;">Response:</label>
                    <textarea id="responseEditor" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; line-height: 1.6; min-height: 150px; font-family: inherit;" placeholder="Enter or edit response...">${resp ? resp.text : ''}</textarea>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button onclick="app.generateResponse('${q.id}')" style="flex: 1; padding: 12px; background: #0052B4; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">🤖 Generate with AI</button>
                    <button onclick="app.saveSingleResponse('${q.id}')" style="flex: 1; padding: 12px; background: #28a745; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">💾 Save Response</button>
                </div>
                
                <div style="background: #f9f9f9; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                    <strong style="display: block; margin-bottom: 10px; color: #333;">Related Clauses:</strong>
                    ${q.relatedClauses.length > 0 ? 
                        q.relatedClauses.map(cid => {
                            const clause = this.clauseRepo[cid];
                            return `
                                <div style="padding: 10px; background: white; border-radius: 4px; margin: 8px 0; border-left: 3px solid #28a745;">
                                    <div style="font-size: 12px; color: #666;">${clause.text}</div>
                                </div>
                            `;
                        }).join('')
                        : '<em style="color: #999;">No related clauses</em>'}
                </div>
                
                <button onclick="app.exportSingleResponse('${q.id}')" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px;">📥 Export This Response</button>
            </div>
        `;
    }

    renderClauseRepo() {
        return `
            <div>
                <h2 style="color: #333; margin-bottom: 20px;">Clause Repository (Vote & Rate)</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 15px;">
                    ${Object.entries(this.clauseRepo).map(([id, clause]) => `
                        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                                <strong style="color: #333;">📌 ${id}</strong>
                                <div style="display: flex; gap: 5px;">
                                    <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">👍 ${clause.votes}</span>
                                    <span style="background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: 600;">⭐ ${clause.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; font-size: 13px; line-height: 1.5; color: #555; margin-bottom: 12px;">
                                ${clause.text}
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button onclick="app.voteClause('${id}', 'up')" style="flex: 1; padding: 8px; background: #d4edda; color: #155724; border: 1px solid #28a745; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;">👍 Vote Up</button>
                                <button onclick="app.voteClause('${id}', 'down')" style="flex: 1; padding: 8px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;">👎 Vote Down</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    generateResponse(qid) {
        const q = this.questions.find(qq => qq.id === qid);
        const template = AI_RESPONSE_TEMPLATES[q.category] || AI_RESPONSE_TEMPLATES['General'];
        this.responses.set(qid, { text: template });
        this.render();
    }

    async generateAllResponses() {
        for (const q of this.questions) {
            this.generateResponse(q.id);
            await new Promise(r => setTimeout(r, 100));
        }
        alert('✅ All responses generated!');
    }

    editResponse(qid) {
        const current = this.responses.get(qid)?.text || '';
        const updated = prompt('Edit response:', current);
        if (updated !== null && updated.trim()) {
            this.responses.set(qid, { text: updated });
            this.render();
        }
    }

    saveSingleResponse(qid) {
        const editor = document.getElementById('responseEditor');
        if (editor && editor.value.trim()) {
            this.responses.set(qid, { text: editor.value });
            this.selectedQuestionId = null;
            alert('✅ Response saved!');
            this.render();
        }
    }

    selectQuestion(qid) {
        this.selectedQuestionId = this.selectedQuestionId === qid ? null : qid;
        this.render();
    }

    exportSingleResponse(qid) {
        const q = this.questions.find(qq => qq.id === qid);
        const resp = this.responses.get(qid);
        const csv = `"Question","Response"\n"${q.text}","${resp?.text || ''}"`;
        const a = document.createElement('a');
        a.href = 'data:text/csv,' + encodeURIComponent(csv);
        a.download = `${qid}_response.csv`;
        a.click();
    }

    viewClauses(qid) {
        const q = this.questions.find(qq => qq.id === qid);
        alert(`Related clauses: ${q.relatedClauses.map(cid => this.clauseRepo[cid].text).join('\n\n')}`);
    }

    voteClause(cid, direction) {
        const clause = this.clauseRepo[cid];
        if (direction === 'up') {
            clause.votes++;
            clause.rating = Math.min(5, clause.rating + 0.5);
        } else {
            clause.votes--;
            clause.rating = Math.max(0, clause.rating - 0.5);
        }
        this.render();
    }
}

let app = null;
window.addEventListener('DOMContentLoaded', () => {
    app = new EnterpriseRFPApp();
});
