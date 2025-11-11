// Compliance Attestation & Audit Trail Application
// In-memory data storage
let assessmentData = [];
let currentAssessment = null;
let filteredAssessments = [];

// Domain names mapping
const DOMAIN_NAMES = {
  C: 'Compliance Necessity',
  R: 'Readiness',
  B: 'Business Value',
  O: 'Opportunity Window',
  L: 'Legal Liability'
};

// Control families data
const CONTROL_FAMILIES = {
  AC: { name: 'Access Control', controls: 22 },
  AU: { name: 'Audit and Accountability', controls: 12 },
  CA: { name: 'Security Assessment and Authorization', controls: 8 },
  CM: { name: 'Configuration Management', controls: 9 },
  IA: { name: 'Identification and Authentication', controls: 10 },
  SC: { name: 'System and Communications Protection', controls: 27 }
};

// Sample assessment data
const SAMPLE_DATA = [
  {
    rfp_name: 'VA Medical Center - Phoenix',
    sector: 'Federal',
    assessor_name: 'John Smith',
    assessor_role: 'Security Architect',
    assessment_date: '2025-09-15',
    last_modified: '2025-09-20',
    status: 'Signed Off',
    signed_by: 'Jane Doe',
    signed_date: '2025-09-20',
    framework: 'FedRAMP Moderate',
    mrs_score: 4.9,
    gap_implementation_pct: 92,
    scores: { C: 5, R: 5, B: 5, O: 1, L: 5 },
    justifications: {
      C: {
        score: 5,
        justification: 'FedRAMP Authorization explicitly required in RFP contract language. This is a foundational requirement with zero flexibility. The regulatory framework mandates full compliance before system operation.',
        evidence: ['RFP Contract Section 5.2.1 - FedRAMP Required', 'VA Security Requirements Document', 'FedRAMP SAP in SharePoint'],
        confidence: 'High',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      R: {
        score: 5,
        justification: 'System holds active FedRAMP Moderate Authorization with current ATO. All security controls documented and assessed. Continuous monitoring in place.',
        evidence: ['Active FedRAMP ATO Certificate', 'SAP Document v3.2', 'Continuous Monitoring Dashboard'],
        confidence: 'High',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      B: {
        score: 5,
        justification: 'Critical healthcare system serving 500,000+ veterans annually. High mission value with direct patient care impact. Strategic priority for VA modernization.',
        evidence: ['VA Strategic Plan 2025', 'System Usage Analytics', 'Stakeholder Impact Assessment'],
        confidence: 'High',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 1,
        justification: 'Narrow 90-day procurement window with firm deadline. No flexibility for delays. Contract award contingent on immediate readiness.',
        evidence: ['RFP Section 2.3 - Timeline Requirements', 'Procurement Schedule'],
        confidence: 'High',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 5,
        justification: 'Protected Health Information (PHI) under HIPAA. Federal system subject to FISMA penalties. Material breach consequences include contract termination.',
        evidence: ['HIPAA Compliance Requirements', 'FISMA Compliance Documentation', 'Legal Review Memo'],
        confidence: 'High',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(92)
  },
  {
    rfp_name: 'CMS Medicare Portal',
    sector: 'Federal',
    assessor_name: 'Sarah Johnson',
    assessor_role: 'Compliance Analyst',
    assessment_date: '2025-09-18',
    last_modified: '2025-10-02',
    status: 'Ready for Review',
    framework: 'CMS ARS',
    mrs_score: 4.5,
    gap_implementation_pct: 78,
    scores: { C: 5, R: 4, B: 5, O: 3, L: 4 },
    justifications: {
      C: {
        score: 5,
        justification: 'CMS ARS 3.1 compliance required for all Medicare systems. Regulatory mandate with no exceptions. Critical for CMS authorization.',
        evidence: ['CMS ARS 3.1 Requirements', 'RFP Security Appendix B', 'CMS Authorization Memo'],
        confidence: 'High',
        methodology: 'CMS ARS Framework'
      },
      R: {
        score: 4,
        justification: 'System undergoing ATO process. 78% of controls implemented. Security assessment in progress. Minor gaps in continuous monitoring.',
        evidence: ['Security Assessment Report', 'Control Implementation Matrix', 'ConMon Dashboard'],
        confidence: 'Medium',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      B: {
        score: 5,
        justification: 'Mission-critical Medicare enrollment system. Serves 60M+ beneficiaries. Direct revenue impact of $800B annually. Strategic CMS priority.',
        evidence: ['CMS Strategic Roadmap', 'System Impact Analysis', 'Beneficiary Usage Data'],
        confidence: 'High',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 3,
        justification: 'Standard 6-month procurement cycle. Moderate timeline pressure. Some flexibility for ATO completion.',
        evidence: ['Procurement Timeline', 'RFP Section 4 - Schedule'],
        confidence: 'Medium',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 4,
        justification: 'Medicare data classified as PII/PHI. Subject to HIPAA and Privacy Act. Significant regulatory penalties for breach.',
        evidence: ['Privacy Impact Assessment', 'HIPAA Documentation', 'Legal Risk Memo'],
        confidence: 'High',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(78)
  },
  {
    rfp_name: 'State of California DMV',
    sector: 'State',
    assessor_name: 'Michael Chen',
    assessor_role: 'Security Engineer',
    assessment_date: '2025-09-20',
    last_modified: '2025-09-20',
    status: 'Draft',
    framework: 'NIST 800-53 Baseline',
    mrs_score: 3.7,
    gap_implementation_pct: 55,
    scores: { C: 4, R: 3, B: 4, O: 5, L: 4 },
    justifications: {
      C: {
        score: 4,
        justification: 'NIST 800-53 compliance strongly preferred in RFP. State security standards mandate baseline controls. Not explicitly required but heavily weighted.',
        evidence: ['RFP Section 7 - Security Requirements', 'CA State Security Policy'],
        confidence: 'Medium',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      R: {
        score: 3,
        justification: 'System in development phase. 55% of required controls implemented. Security architecture approved but implementation ongoing.',
        evidence: ['System Design Document', 'Control Implementation Status', 'Security Architecture Review'],
        confidence: 'Medium',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      B: {
        score: 4,
        justification: 'Major state DMV modernization initiative. Serves 27M CA drivers. High visibility and political priority.',
        evidence: ['DMV Modernization Plan', 'State Budget Allocation', 'Executive Sponsor Memo'],
        confidence: 'High',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 5,
        justification: 'Long 18-month procurement window. Flexible timeline allows for phased implementation. Low urgency pressure.',
        evidence: ['Procurement Schedule', 'RFP Timeline Section'],
        confidence: 'High',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 4,
        justification: 'Driver PII and biometric data. Subject to CA Privacy Act. State liability for data breaches under AB 1950.',
        evidence: ['Privacy Impact Assessment', 'CA Privacy Act Requirements', 'Legal Review'],
        confidence: 'Medium',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(55)
  },
  {
    rfp_name: 'DOD Logistics System',
    sector: 'Defense',
    assessor_name: 'John Smith',
    assessor_role: 'Security Architect',
    assessment_date: '2025-09-22',
    last_modified: '2025-09-25',
    status: 'Signed Off',
    signed_by: 'Jane Doe',
    signed_date: '2025-09-25',
    framework: 'IL4/IL5',
    mrs_score: 4.5,
    gap_implementation_pct: 88,
    scores: { C: 5, R: 5, B: 5, O: 1, L: 1 },
    justifications: {
      C: {
        score: 5,
        justification: 'IL4 authorization mandatory for DOD systems. Zero tolerance for non-compliance. Contract cannot proceed without authorization.',
        evidence: ['DOD Security Requirements', 'IL4 Authorization Package', 'RFP Section 3.1'],
        confidence: 'High',
        methodology: 'NIST 800-53 High Baseline'
      },
      R: {
        score: 5,
        justification: 'System holds active IL4 authorization. All 800+ controls implemented and assessed. Full DIACAP compliance verified.',
        evidence: ['IL4 ATO Certificate', 'Security Assessment Report', 'DIACAP Documentation'],
        confidence: 'High',
        methodology: 'NIST 800-53 High Baseline'
      },
      B: {
        score: 5,
        justification: 'Mission-critical logistics system supporting global military operations. $50B+ supply chain management. Strategic DOD priority.',
        evidence: ['DOD Strategic Plan', 'Mission Impact Assessment', 'System Criticality Rating'],
        confidence: 'High',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 1,
        justification: 'Immediate operational need. 60-day deployment requirement. Mission-critical timeline with no flexibility.',
        evidence: ['Operational Requirements Document', 'Deployment Schedule'],
        confidence: 'High',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 1,
        justification: 'National security system. Classified data handling. Breach consequences include criminal penalties and security clearance revocation.',
        evidence: ['Classification Guide', 'National Security Letter', 'Legal Analysis'],
        confidence: 'High',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(88)
  },
  {
    rfp_name: 'County Health Dept - Miami',
    sector: 'Healthcare',
    assessor_name: 'Sarah Johnson',
    assessor_role: 'Compliance Analyst',
    assessment_date: '2025-10-01',
    last_modified: '2025-10-01',
    status: 'Draft',
    framework: 'NIST 800-53 Baseline',
    mrs_score: 2.7,
    gap_implementation_pct: 8,
    scores: { C: 4, R: 1, B: 3, O: 5, L: 5 },
    justifications: {
      C: {
        score: 4,
        justification: 'HIPAA Security Rule compliance required. NIST 800-53 baseline strongly recommended in RFP. Health data protection mandate.',
        evidence: ['RFP Security Requirements', 'HIPAA Security Rule', 'County IT Policy'],
        confidence: 'Medium',
        methodology: 'NIST 800-53 Low Baseline'
      },
      R: {
        score: 1,
        justification: 'System in early planning phase. Minimal controls implemented. No current security authorization. Significant development needed.',
        evidence: ['Project Charter', 'Preliminary Design', 'Gap Analysis Report'],
        confidence: 'Low',
        methodology: 'NIST 800-53 Low Baseline'
      },
      B: {
        score: 3,
        justification: 'County health records modernization. Serves 450K residents. Moderate business value with local health department priority.',
        evidence: ['County Health IT Plan', 'Stakeholder Requirements', 'Budget Justification'],
        confidence: 'Medium',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 5,
        justification: 'Multi-year procurement with 24-month implementation window. Flexible timeline allows for phased development.',
        evidence: ['Procurement Timeline', 'Implementation Roadmap'],
        confidence: 'High',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 5,
        justification: 'Protected Health Information under HIPAA. Significant penalties for breaches. County liability for data protection failures.',
        evidence: ['HIPAA Risk Assessment', 'Legal Liability Analysis', 'Insurance Requirements'],
        confidence: 'High',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(8)
  },
  {
    rfp_name: 'Federal Student Aid Office',
    sector: 'Federal',
    assessor_name: 'Michael Chen',
    assessor_role: 'Security Engineer',
    assessment_date: '2025-10-03',
    last_modified: '2025-10-08',
    status: 'Ready for Review',
    framework: 'FedRAMP Moderate',
    mrs_score: 4.3,
    gap_implementation_pct: 82,
    scores: { C: 5, R: 4, B: 5, O: 2, L: 4 },
    justifications: {
      C: {
        score: 5,
        justification: 'FedRAMP Moderate required for all ED systems. Regulatory mandate for student aid platforms. Zero exceptions policy.',
        evidence: ['ED Security Policy', 'FedRAMP Requirements', 'RFP Section 5 - Security'],
        confidence: 'High',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      R: {
        score: 4,
        justification: 'System in final ATO stages. 82% controls implemented. Minor gaps in incident response and contingency planning.',
        evidence: ['Security Assessment Report', 'Control Matrix', 'ATO Package Draft'],
        confidence: 'Medium',
        methodology: 'NIST 800-53 Moderate Baseline'
      },
      B: {
        score: 5,
        justification: 'Federal student aid platform serving 10M+ students annually. $120B in aid disbursement. Critical ED mission system.',
        evidence: ['ED Strategic Plan', 'System Impact Analysis', 'Congressional Mandate'],
        confidence: 'High',
        methodology: 'Business Value Framework'
      },
      O: {
        score: 2,
        justification: 'Compressed 4-month timeline. Academic year deadline pressure. Limited flexibility for delays.',
        evidence: ['Procurement Schedule', 'Academic Calendar Requirements'],
        confidence: 'High',
        methodology: 'Timeline Analysis'
      },
      L: {
        score: 4,
        justification: 'Student PII and financial data. Subject to FERPA and Privacy Act. Significant federal penalties for data breaches.',
        evidence: ['Privacy Impact Assessment', 'FERPA Compliance', 'Legal Risk Memo'],
        confidence: 'High',
        methodology: 'Legal Risk Assessment'
      }
    },
    control_assessments: generateControlAssessments(82)
  }
];

// Generate control assessments based on implementation percentage
function generateControlAssessments(implPct) {
  const assessments = {};
  const families = Object.keys(CONTROL_FAMILIES);
  
  families.forEach(familyCode => {
    const family = CONTROL_FAMILIES[familyCode];
    const controls = [];
    
    for (let i = 1; i <= Math.min(5, family.controls); i++) {
      let status;
      const rand = Math.random() * 100;
      
      if (implPct >= 90) {
        status = rand < 90 ? 'Implemented' : 'Partial';
      } else if (implPct >= 70) {
        status = rand < 60 ? 'Implemented' : rand < 85 ? 'Partial' : 'Developing';
      } else if (implPct >= 50) {
        status = rand < 40 ? 'Implemented' : rand < 65 ? 'Partial' : rand < 85 ? 'Developing' : 'Planned';
      } else if (implPct >= 20) {
        status = rand < 20 ? 'Implemented' : rand < 40 ? 'Partial' : rand < 60 ? 'Developing' : rand < 80 ? 'Planned' : 'Not Started';
      } else {
        status = rand < 10 ? 'Partial' : rand < 30 ? 'Developing' : rand < 50 ? 'Planned' : 'Not Started';
      }
      
      controls.push({
        id: `${familyCode}-${i}`,
        name: `${family.name} - Control ${i}`,
        status: status,
        evidence: status === 'Implemented' ? `${familyCode} Policy Document, Section ${i}` : status === 'Partial' ? `${familyCode} Worksheet (partial)` : '-',
        assessor: status !== 'Not Started' ? 'John Smith' : '-',
        date: status !== 'Not Started' ? '2025-09-15' : '-',
        notes: status === 'Implemented' ? 'Fully implemented and documented' : 
               status === 'Partial' ? 'Implementation in progress' :
               status === 'Developing' ? 'Under development' :
               status === 'Planned' ? 'Planned for next quarter' : 'Not yet started'
      });
    }
    
    const implemented = controls.filter(c => c.status === 'Implemented').length;
    const partial = controls.filter(c => c.status === 'Partial').length;
    const pct = Math.round((implemented + partial * 0.5) / controls.length * 100);
    
    assessments[familyCode] = {
      name: family.name,
      controls: controls,
      total: family.controls,
      implementation_pct: pct,
      summary: `${implemented} Implemented, ${partial} Partial, ${controls.filter(c => c.status === 'Developing').length} Developing`
    };
  });
  
  return assessments;
}

// Generate audit trail events
function generateAuditTrail(assessment) {
  const events = [
    {
      date: assessment.assessment_date,
      assessor: assessment.assessor_name,
      action: 'Created',
      description: `Initial assessment completed by ${assessment.assessor_name}`,
      changes: 'Assessment record created with initial MRS scores and gap analysis'
    }
  ];
  
  if (assessment.status !== 'Draft') {
    events.push({
      date: addDays(assessment.assessment_date, 2),
      assessor: assessment.assessor_name,
      action: 'Modified',
      description: `Updated evidence links for Compliance domain`,
      changes: 'Added FedRAMP SAP reference document and RFP contract section links'
    });
  }
  
  if (assessment.status === 'Ready for Review' || assessment.status === 'Signed Off') {
    events.push({
      date: addDays(assessment.assessment_date, 3),
      assessor: assessment.assessor_name,
      action: 'Reviewed',
      description: `Marked assessment as ready for compliance review`,
      changes: 'Status updated from Draft to Ready for Review. All validation checks passed.'
    });
  }
  
  if (assessment.status === 'Signed Off') {
    events.push({
      date: assessment.signed_date,
      assessor: assessment.signed_by,
      action: 'Signed Off',
      description: `Compliance sign-off by ${assessment.signed_by}`,
      changes: 'Assessment certified as complete and accurate. Digital signature applied.'
    });
  }
  
  return events.reverse();
}

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Initialize data
function initializeData() {
  assessmentData = SAMPLE_DATA.map(a => ({
    ...a,
    audit_trail: generateAuditTrail(a)
  }));
  filteredAssessments = [...assessmentData];
}

// Render RFP list
function renderRFPList() {
  const list = document.getElementById('rfpList');
  list.innerHTML = '';
  
  if (filteredAssessments.length === 0) {
    list.innerHTML = '<li style="padding: 12px; color: #666; text-align: center;">No RFPs found</li>';
    return;
  }
  
  filteredAssessments.forEach(assessment => {
    const item = document.createElement('li');
    item.className = 'rfp-item';
    if (currentAssessment && currentAssessment.rfp_name === assessment.rfp_name) {
      item.classList.add('selected');
    }
    
    const statusClass = assessment.status === 'Signed Off' ? 'status-signed' :
                       assessment.status === 'Ready for Review' ? 'status-ready' :
                       assessment.status === 'Draft' ? 'status-draft' : 'status-expired';
    
    item.innerHTML = `
      <div class="rfp-item-name">${assessment.rfp_name}</div>
      <div class="rfp-item-meta">
        <span class="status-badge ${statusClass}">${assessment.status}</span>
        <span>${assessment.last_modified}</span>
      </div>
      <div class="rfp-item-meta">
        <span>${assessment.sector}</span>
        <span style="font-weight: 500;">${assessment.assessor_name.split(' ').map(n => n[0]).join('')}</span>
      </div>
    `;
    
    item.addEventListener('click', () => selectAssessment(assessment));
    list.appendChild(item);
  });
}

// Select assessment
function selectAssessment(assessment) {
  currentAssessment = assessment;
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('assessmentDetail').style.display = 'block';
  document.getElementById('completionChecklist').style.display = 'block';
  
  renderAssessmentDetail();
  renderRFPList();
}

// Render assessment detail
function renderAssessmentDetail() {
  if (!currentAssessment) return;
  
  // Update header
  document.getElementById('detailTitle').textContent = `Assessment Detail — ${currentAssessment.rfp_name}`;
  
  // Update badges
  const badges = document.getElementById('detailBadges');
  badges.innerHTML = `
    <span class="badge">${currentAssessment.sector}</span>
    <span class="badge">MRS: ${currentAssessment.mrs_score.toFixed(1)}</span>
    <span class="badge">${currentAssessment.framework}</span>
  `;
  
  // Render MRS justifications
  renderMRSJustifications();
  
  // Render gap assessments
  renderGapAssessments();
  
  // Render audit trail
  renderAuditTrail();
  
  // Update status panel
  renderStatusPanel();
  
  // Update checklist
  renderChecklist();
}

// Render MRS justifications
function renderMRSJustifications() {
  const container = document.getElementById('mrsJustifications');
  const domains = ['C', 'R', 'B', 'O', 'L'];
  
  container.innerHTML = domains.map(domain => {
    const just = currentAssessment.justifications[domain];
    const scoreClass = `score-${just.score}`;
    
    return `
      <div class="domain-card">
        <div class="domain-header" onclick="toggleDomain('${domain}')">
          <div class="domain-left">
            <div class="score-badge ${scoreClass}">${just.score}</div>
            <div>
              <div class="domain-name">${DOMAIN_NAMES[domain]}</div>
              <span class="confidence-badge">Confidence: ${just.confidence}</span>
            </div>
          </div>
          <div style="font-size: 24px; color: #5A6C7D;">▼</div>
        </div>
        <div class="domain-body" id="domain-${domain}">
          <div class="domain-section">
            <h4>Score Justification</h4>
            <p>${just.justification}</p>
          </div>
          
          <div class="domain-section">
            <h4>Evidence &amp; References</h4>
            <ul class="evidence-list">
              ${just.evidence.map(e => `<li>${e}</li>`).join('')}
            </ul>
          </div>
          
          <div class="domain-section">
            <h4>Assessor Information</h4>
            <div class="assessor-info">
              <span><strong>Assessed by:</strong> ${currentAssessment.assessor_name}, ${currentAssessment.assessor_role}</span>
              <span><strong>Date:</strong> ${currentAssessment.assessment_date}</span>
              <span><strong>Methodology:</strong> ${just.methodology}</span>
            </div>
          </div>
          
          <div class="domain-actions">
            <button class="btn btn--secondary btn--sm" onclick="viewEvidence('${domain}')">
              View Evidence
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render gap assessments
function renderGapAssessments() {
  const container = document.getElementById('gapAssessments');
  const families = Object.keys(currentAssessment.control_assessments);
  
  container.innerHTML = families.map(familyCode => {
    const family = currentAssessment.control_assessments[familyCode];
    const pct = family.implementation_pct;
    const progressColor = pct >= 80 ? '#1E865C' : pct >= 60 ? '#FDB913' : '#E03E36';
    
    return `
      <div class="control-family-card">
        <div class="control-family-header" onclick="toggleFamily('${familyCode}')">
          <div>
            <div class="family-name">${familyCode} - ${family.name}</div>
            <div style="font-size: 12px; color: #626C7C; margin-top: 4px;">
              ${family.controls.length} controls assessed
            </div>
          </div>
          <div class="family-stats">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${pct}%; background: ${progressColor};"></div>
            </div>
            <span style="font-weight: 600;">${pct}%</span>
            <span style="font-size: 24px; color: #5A6C7D;">▼</span>
          </div>
        </div>
        <div class="control-family-body" id="family-${familyCode}">
          <div style="margin-bottom: 16px; padding: 12px; background: rgba(90, 108, 125, 0.05); border-radius: 8px;">
            <strong>Summary:</strong> ${family.summary}
          </div>
          
          <table class="controls-table">
            <thead>
              <tr>
                <th>Control</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Assessor</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${family.controls.map(control => {
                const icon = control.status === 'Implemented' ? '✓' :
                           control.status === 'Partial' ? '⚠' :
                           control.status === 'Developing' ? '⚙' :
                           control.status === 'Planned' ? '📅' : '✗';
                return `
                  <tr>
                    <td><strong>${control.id}</strong></td>
                    <td><span class="control-status-icon">${icon}</span> ${control.status}</td>
                    <td>${control.evidence}</td>
                    <td>${control.assessor}</td>
                    <td>${control.date}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

// Render audit trail
function renderAuditTrail() {
  const container = document.getElementById('auditTimeline');
  
  container.innerHTML = currentAssessment.audit_trail.map(event => `
    <div class="audit-event">
      <div class="audit-event-header">
        <div>
          <strong>${event.action}</strong> by ${event.assessor}
        </div>
        <div class="audit-event-date">${event.date}</div>
      </div>
      <div class="audit-event-body">
        <div style="margin-bottom: 8px;">${event.description}</div>
        <div style="color: #626C7C; font-size: 12px;"><strong>Changes:</strong> ${event.changes}</div>
      </div>
    </div>
  `).join('');
}

// Render status panel
function renderStatusPanel() {
  const statusDiv = document.getElementById('currentStatus');
  const actionsDiv = document.getElementById('signoffActions');
  
  const statusClass = currentAssessment.status === 'Signed Off' ? 'status-signed' :
                     currentAssessment.status === 'Ready for Review' ? 'status-ready' :
                     'status-draft';
  
  statusDiv.innerHTML = `
    <div class="status-badge-large ${statusClass}">${currentAssessment.status}</div>
    <div class="status-subtext">Last modified: ${currentAssessment.last_modified}</div>
  `;
  
  if (currentAssessment.status === 'Draft') {
    actionsDiv.innerHTML = `
      <button class="btn btn--primary btn--sm btn--full" onclick="markReadyForReview()">
        Mark Ready for Review
      </button>
      <p style="font-size: 11px; color: #626C7C; margin-top: 8px; text-align: center;">
        Validates all required fields before submission
      </p>
    `;
  } else if (currentAssessment.status === 'Ready for Review') {
    actionsDiv.innerHTML = `
      <div style="padding: 12px; background: rgba(253, 185, 19, 0.1); border: 1px solid #FDB913; border-radius: 8px; margin-bottom: 12px; font-size: 12px;">
        ⏳ Awaiting sign-off from: <strong>Jane Doe</strong> (Compliance Officer)
      </div>
      <button class="btn btn--secondary btn--sm btn--full" onclick="sendReminder()">
        Send Reminder
      </button>
      <hr style="margin: 16px 0; border: none; border-top: 1px solid #DDD;">
      <div class="signoff-form">
        <h4 style="font-size: 14px; margin-bottom: 12px;">Compliance Officer Sign-Off</h4>
        <div class="form-group">
          <label>Your Name</label>
          <input type="text" value="Jane Doe" id="signoffName">
        </div>
        <div class="certification-text">
          I certify that this assessment was conducted in accordance with the NIST 800-53 security control standards and ${currentAssessment.framework} requirements. The findings documented herein accurately reflect the assessed system's compliance posture as of the assessment date.
        </div>
        <div class="form-group">
          <div class="checkbox-group">
            <input type="checkbox" id="certifyCheckbox">
            <label for="certifyCheckbox">I certify the accuracy of this assessment and authorize its use for compliance purposes</label>
          </div>
        </div>
        <button class="btn btn--danger btn--sm btn--full" onclick="signOffAssessment()">
          Sign &amp; Attest
        </button>
      </div>
    `;
  } else if (currentAssessment.status === 'Signed Off') {
    const expiryDate = addDays(currentAssessment.signed_date, 365);
    actionsDiv.innerHTML = `
      <div class="signoff-info">
        <div style="font-size: 20px; text-align: center; margin-bottom: 8px;">✓</div>
        <div style="font-size: 12px;">
          <strong>Signed by:</strong> ${currentAssessment.signed_by}<br>
          <strong>Date:</strong> ${currentAssessment.signed_date}<br>
          <strong>Valid until:</strong> ${expiryDate}
        </div>
      </div>
      <div class="certification-text">
        Assessment certified as compliant with ${currentAssessment.framework} requirements. This certification is valid for regulatory review and audit purposes.
      </div>
    `;
  }
}

// Render checklist
function renderChecklist() {
  const checklist = document.getElementById('checklistItems');
  
  const items = [
    { text: 'All 5 domains scored and justified', complete: true },
    { text: 'Evidence links provided', complete: currentAssessment.status !== 'Draft' },
    { text: 'Gap assessments documented', complete: currentAssessment.gap_implementation_pct > 0 },
    { text: 'Assessor info captured', complete: true },
    { text: 'Compliance officer assigned', complete: currentAssessment.status !== 'Draft' },
    { text: 'Ready to sign off', complete: currentAssessment.status === 'Signed Off' }
  ];
  
  checklist.innerHTML = items.map(item => `
    <li class="${item.complete ? 'complete' : ''}">${item.text}</li>
  `).join('');
}

// Toggle domain expansion
function toggleDomain(domain) {
  const body = document.getElementById(`domain-${domain}`);
  body.classList.toggle('expanded');
}

// Toggle family expansion
function toggleFamily(familyCode) {
  const body = document.getElementById(`family-${familyCode}`);
  body.classList.toggle('expanded');
}

// View evidence modal
function viewEvidence(domain) {
  const just = currentAssessment.justifications[domain];
  const modal = document.getElementById('evidenceModal');
  const title = document.getElementById('evidenceModalTitle');
  const body = document.getElementById('evidenceModalBody');
  
  title.textContent = `Evidence for ${DOMAIN_NAMES[domain]}`;
  
  body.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h4>Assessment Details</h4>
      <p><strong>Score:</strong> ${just.score}/5</p>
      <p><strong>Confidence:</strong> ${just.confidence}</p>
      <p><strong>Methodology:</strong> ${just.methodology}</p>
    </div>
    
    <div style="margin-bottom: 16px;">
      <h4>Evidence Sources</h4>
      <ul>
        ${just.evidence.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>
    
    <div style="padding: 12px; background: rgba(90, 108, 125, 0.05); border-radius: 8px; font-size: 13px;">
      <strong>Note:</strong> In a production system, this would show document previews, links to SharePoint/document management systems, and attachment downloads.
    </div>
  `;
  
  modal.classList.add('open');
}

// Actions
function markReadyForReview() {
  if (confirm('Mark this assessment as ready for compliance review?\n\nThis will notify the compliance officer and lock the assessment for editing.')) {
    currentAssessment.status = 'Ready for Review';
    currentAssessment.last_modified = new Date().toISOString().split('T')[0];
    currentAssessment.audit_trail.unshift({
      date: currentAssessment.last_modified,
      assessor: currentAssessment.assessor_name,
      action: 'Status Change',
      description: 'Assessment marked as ready for review',
      changes: 'Status updated from Draft to Ready for Review. Notification sent to compliance officer.'
    });
    renderAssessmentDetail();
    renderRFPList();
    alert('Assessment marked as Ready for Review.\nCompliance officer has been notified.');
  }
}

function sendReminder() {
  alert('Reminder sent to Jane Doe (Compliance Officer).\n\nIn a production system, this would send an email notification.');
}

function signOffAssessment() {
  const checkbox = document.getElementById('certifyCheckbox');
  const name = document.getElementById('signoffName').value;
  
  if (!checkbox.checked) {
    alert('Please check the certification box to sign off on this assessment.');
    return;
  }
  
  if (!name) {
    alert('Please enter your name.');
    return;
  }
  
  if (confirm(`Sign off on this assessment as ${name}?\n\nThis action certifies the assessment as complete and accurate for regulatory purposes.`)) {
    const today = new Date().toISOString().split('T')[0];
    currentAssessment.status = 'Signed Off';
    currentAssessment.signed_by = name;
    currentAssessment.signed_date = today;
    currentAssessment.last_modified = today;
    currentAssessment.audit_trail.unshift({
      date: today,
      assessor: name,
      action: 'Signed Off',
      description: `Compliance sign-off by ${name}`,
      changes: 'Assessment certified as complete and accurate. Digital signature applied. Valid for 12 months.'
    });
    renderAssessmentDetail();
    renderRFPList();
    alert('Assessment signed off successfully!\n\nThis assessment is now certified for regulatory use.');
  }
}

// Export functions
function exportPDF() {
  if (!currentAssessment) {
    alert('Please select an assessment first.');
    return;
  }
  alert(`Export Evidence Package (PDF)\n\nGenerating audit-ready PDF for: ${currentAssessment.rfp_name}\n\nWould include:\n• Cover page with assessment metadata\n• Executive summary\n• MRS justifications with evidence\n• Gap assessment results\n• Evidence appendix\n• Sign-off certifications\n\nThis feature requires a PDF generation library in production.`);
}

function exportZIP() {
  if (!currentAssessment) {
    alert('Please select an assessment first.');
    return;
  }
  alert(`Export Compliance Package (ZIP)\n\nBundling compliance package for: ${currentAssessment.rfp_name}\n\nWould include:\n• Evidence Package (PDF)\n• Detailed data (CSV)\n• Machine-readable data (JSON)\n• Supporting documentation\n\nThis feature requires ZIP generation in production.`);
}

function exportAuditTrail() {
  if (!currentAssessment) {
    alert('Please select an assessment first.');
    return;
  }
  
  let csv = 'Date,Assessor,Action,Description,Changes\n';
  currentAssessment.audit_trail.forEach(event => {
    csv += `"${event.date}","${event.assessor}","${event.action}","${event.description}","${event.changes}"\n`;
  });
  
  downloadFile(csv, `audit_trail_${currentAssessment.rfp_name.replace(/\s+/g, '_')}.csv`, 'text/csv');
}

function exportCertification() {
  if (!currentAssessment) {
    alert('Please select an assessment first.');
    return;
  }
  
  if (currentAssessment.status !== 'Signed Off') {
    alert('Assessment must be signed off before generating certification.');
    return;
  }
  
  const cert = `
COMPLIANCE ASSESSMENT CERTIFICATION

RFP: ${currentAssessment.rfp_name}
Sector: ${currentAssessment.sector}
Framework: ${currentAssessment.framework}

Assessment Date: ${currentAssessment.assessment_date}
Assessor: ${currentAssessment.assessor_name}, ${currentAssessment.assessor_role}

MRS Score: ${currentAssessment.mrs_score.toFixed(1)}/5.0
Control Implementation: ${currentAssessment.gap_implementation_pct}%

CERTIFICATION STATEMENT:

I certify that this assessment was conducted in accordance with the NIST 800-53 security control standards and ${currentAssessment.framework} requirements. The findings documented herein accurately reflect the assessed system's compliance posture as of the assessment date.

Signed: ${currentAssessment.signed_by}
Date: ${currentAssessment.signed_date}
Title: Compliance Officer

This certification is valid for regulatory review and audit purposes.
Valid until: ${addDays(currentAssessment.signed_date, 365)}
  `;
  
  downloadFile(cert, `certification_${currentAssessment.rfp_name.replace(/\s+/g, '_')}.txt`, 'text/plain');
}

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

// Apply filters
function applyFilters() {
  const statusFilter = document.querySelector('input[name="statusFilter"]:checked').value;
  const sortBy = document.querySelector('input[name="sortBy"]:checked').value;
  const searchTerm = document.getElementById('searchRFP').value.toLowerCase();
  
  filteredAssessments = assessmentData.filter(a => {
    if (searchTerm && !a.rfp_name.toLowerCase().includes(searchTerm)) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });
  
  // Sort
  if (sortBy === 'name') {
    filteredAssessments.sort((a, b) => a.rfp_name.localeCompare(b.rfp_name));
  } else if (sortBy === 'status') {
    const statusOrder = { 'Draft': 0, 'Ready for Review': 1, 'Signed Off': 2 };
    filteredAssessments.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  } else {
    filteredAssessments.sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified));
  }
  
  renderRFPList();
}

// Event listeners
function attachEventListeners() {
  document.querySelectorAll('input[name="statusFilter"]').forEach(radio => {
    radio.addEventListener('change', applyFilters);
  });
  
  document.querySelectorAll('input[name="sortBy"]').forEach(radio => {
    radio.addEventListener('change', applyFilters);
  });
  
  document.getElementById('searchRFP').addEventListener('input', applyFilters);
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
  
  // Export buttons
  document.getElementById('exportPdfBtn').addEventListener('click', exportPDF);
  document.getElementById('exportZipBtn').addEventListener('click', exportZIP);
  document.getElementById('exportAuditBtn').addEventListener('click', exportAuditTrail);
  document.getElementById('exportCertBtn').addEventListener('click', exportCertification);
  
  // Modal close
  document.getElementById('evidenceModalClose').addEventListener('click', () => {
    document.getElementById('evidenceModal').classList.remove('open');
  });
  
  document.getElementById('evidenceModal').addEventListener('click', (e) => {
    if (e.target.id === 'evidenceModal') {
      document.getElementById('evidenceModal').classList.remove('open');
    }
  });
}

// Make functions global
window.toggleDomain = toggleDomain;
window.toggleFamily = toggleFamily;
window.viewEvidence = viewEvidence;
window.markReadyForReview = markReadyForReview;
window.sendReminder = sendReminder;
window.signOffAssessment = signOffAssessment;

// Initialize app
function init() {
  initializeData();
  attachEventListeners();
  renderRFPList();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}