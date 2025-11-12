# Marsh MRS Suite - Complete Demo Walkthrough & Lifecycle Guide

## Executive Overview

This guide walks you through the **complete end-to-end lifecycle** of the Marsh MRS Suite with talking points, sample data, attachments, and demonstrable outcomes at each stage.

---

## Part 1: RFP Intake Analyzer (App #1)

### Business Context
The organization receives an RFP from a federal client. Your team needs to quickly understand regulatory requirements, business impact, and feasibility.

### Demo Flow

**Step 1: Load the App**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/01-intake-analyzer/`
- Show: Pre-loaded sample RFP (VA Medical Center - Phoenix)
- Talking Point: "Within 30 seconds, leadership can see what's being asked and the regulatory impact."

**Step 2: Review RFP Metadata**
- Show the RFP details panel on the left
- Client Name: "VA Medical Center - Phoenix"
- Sector: "Healthcare"
- Regulatory Framework: "HIPAA + FedRAMP (Moderate)"
- Talking Point: "The system automatically categorizes the RFP by sector and regulatory complexity. No manual classification."

**Step 3: Analyze Regulatory Language**
- Click through the "Regulatory Language" tab
- Show clauses extracted from the RFP (e.g., HIPAA BAA requirements, FedRAMP baseline controls)
- Talking Point: "Machine-readable extraction of regulatory language lets your team spot conflicts or overlaps immediately."

**Step 4: Business Impact Scoring**
- Show Business Impact slider: Set to "HIGH"
- Show Operational Constraints: "High" (migration timeline is tight)
- Show Legal Flexibility: "Conditional"
- Talking Point: "Weighted scoring shows decision-makers the real business risk in 3 dimensions: impact, operational fit, and legal room to negotiate."

**Step 5: Generate Intake Report**
- Click "📥 Export Intake Report"
- This generates a CSV with all RFP metadata, regulatory requirements, and business scores
- Talking Point: "This report becomes the input for the MRS Dashboard and gap analysis. No re-entry of data."

**Test Attachment:**
```
Sample RFP Excerpt:
---
"Contractor shall implement HIPAA Compliance as defined in 45 CFR §164.308. 
All systems must achieve FedRAMP Moderate baseline within 90 days. 
Contractor is responsible for BAA execution with customer within 14 days of award."
---
```

**Key Outcome:** Intake report with regulatory requirements scored and classified. Feeds directly to next step.

---

## Part 2: MRS Dashboard (App #2)

### Business Context
Now that you understand the RFP, your team needs a **single pane of glass** showing all 12 RFPs in the pipeline, their regulatory profiles, and decision status.

### Demo Flow

**Step 1: Load the Dashboard**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/02-mrs-dashboard/`
- Show: 12 RFPs listed with regulatory tags, business impact colors, and decision status
- Talking Point: "Your entire RFP pipeline in one view. Color-coded by risk: Red=Critical, Yellow=Review Needed, Green=Proceed."

**Step 2: Pipeline Status Overview**
- Show the pie chart: "In Progress" vs "Completed" vs "Blocked"
- Current breakdown: 5 completed, 4 in progress, 3 blocked waiting for compliance clarity
- Talking Point: "At a glance, you see where bottlenecks are. Blocked deals typically block on HIPAA BAA or FedRAMP readiness."

**Step 3: Regulatory Profile Heatmap**
- Show the matrix: RFPs (rows) × Regulatory Frameworks (columns)
- Darker shades = higher complexity
- Talking Point: "This heatmap shows which RFPs require the most regulatory heavy lifting. You can allocate your compliance team strategically."

**Step 4: Filter by Business Impact**
- Use the sidebar filter: "Business Impact = Very High"
- Result: 3 RFPs show (top revenue opportunities)
- Talking Point: "Filter down to strategic deals. Now your leadership team can focus on the opportunities that matter most."

**Step 5: Deep Dive on One RFP**
- Click on "VA Medical Center - Phoenix" row
- Show: Full regulatory breakdown, ATO status, operational constraints
- Talking Point: "One click from pipeline view to full compliance detail. No context switching."

**Step 6: Export Pipeline Report**
- Click "📥 Export Pipeline Report"
- Generate CSV with all 12 RFPs, regulatory profiles, and decision status
- Talking Point: "This report goes to your Global CISO and leadership. They see what's in flight and what needs executive decision."

**Test Attachment:**
```
Sample MRS Dashboard Report:
---
Client | Sector | Framework | Impact | ATO Status | Operational | Decision
VA Medical Center | Healthcare | HIPAA, FedRAMP | Very High | In Progress | High | PROCEED
DOD IT Modernization | Defense | FedRAMP High | Critical | Not Started | Very High | HOLD
---
```

**Key Outcome:** Leadership-level pipeline view. Enables strategic decision-making on which RFPs to pursue.

---

## Part 3: Gap Analyzer (App #3)

### Business Context
You've selected the VA RFP. Now you need to map your current NIST 800-53 controls against the FedRAMP Moderate baseline and identify gaps.

### Demo Flow

**Step 1: Load the Gap Analyzer**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/03-gap-analyzer/`
- Show: "NIST 800-53 Control Gap Analyzer"
- Pre-loaded data: VA Medical Center assessment
- Talking Point: "Gap analysis tells you exactly what you need to build or fix to meet compliance. This is your roadmap."

**Step 2: Control Family Overview**
- Show the horizontal bar chart with 16 control families (AC, AT, AU, CA, CM, CP, IA, IR, MA, PE, PL, PS, RA, SA, SC, SI)
- Current compliance shown as percentages
- Example: Access Control (AC) = 82%, Contingency Planning (CP) = 69%
- Talking Point: "See which families need the most work. CP and IR are always the hardest hits for healthcare organizations."

**Step 3: Review High-Priority Gaps**
- Show the "High-Priority Gaps" section
- Example gaps:
  - CP-4: Contingency Planning - Restoration (Not Implemented) — CRITICAL
  - SA-3: System & Services Acq. - Dev Lifecycle (Not Implemented) — CRITICAL
  - IR-4: Incident Response - Handling (Partial) — HIGH
- Talking Point: "These gaps are your blockers. If you don't close them, ATO is denied. Non-negotiable."

**Step 4: POA&M Table**
- Show the Plan of Action & Milestones (POA&M) table
- Columns: Control ID, Family, Current Status, Gap Description, Target Completion, Responsible, Priority
- Example row:
  - CP-4 | CP | Not Implemented | "Establish contingency recovery time objectives < 4 hours" | 2025-02-28 | Security Team | CRITICAL
- Talking Point: "This is your compliance roadmap. Each gap has a responsible party, completion date, and priority. No ambiguity."

**Step 5: Export POA&M**
- Click "📥 Export POA&M"
- Generates CSV with all gaps, owners, and timelines
- Talking Point: "Send this to your program manager. They track these across all systems. This is the source of truth for your remediation."

**Step 6: Reassess After Remediation**
- (Simulation) Show how the chart updates when gaps are closed
- Talk through: "Once you close CP-4 and SA-3, your overall compliance jumps from 73% to 85%."
- Talking Point: "The system shows you the before/after. Leadership loves this—they see progress."

**Test Attachment:**
```
Sample POA&M:
---
Control ID | Current Status | Gap | Target Date | Owner | Priority
CP-4 | Not Implemented | Implement RTO < 4hr recovery | 2025-02-28 | John Smith | CRITICAL
SA-3 | Not Implemented | Implement SDLC for cloud apps | 2025-01-31 | Sarah Chen | CRITICAL
IR-4 | Partial | Enhance incident response playbooks | 2025-03-31 | Mike Johnson | HIGH
---
```

**Key Outcome:** Detailed gap analysis with POA&M. Your team has a concrete remediation roadmap.

---

## Part 4: Risk Heatmap (App #4)

### Business Context
You know your gaps. But which gaps pose the **greatest risk** to the business? Which should you tackle first?

### Demo Flow

**Step 1: Load the Risk Heatmap**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/04-risk-heatmap/`
- Show: 2D grid with Likelihood (Y-axis) × Impact (X-axis)
- Talking Point: "Risk isn't just about what's broken. It's about likelihood × impact. Some gaps are showstoppers; others are nice-to-haves."

**Step 2: Identify Critical Risks (Red Zone)**
- Show risks in the upper-right quadrant (High Likelihood × High Impact)
- Example: CP-4 (contingency planning) = HIGH × HIGH (critical)
- Talking Point: "These are your risks that will kill the deal if not addressed. They get executive escalation."

**Step 3: Prioritization Matrix**
- Show the risk scores sorted from highest to lowest
- Explain the calculation: Risk Score = (Likelihood × Impact) + (Regulatory Weight)
- Top 5 risks identified with business impact quantified
- Talking Point: "Risk scoring removes emotion. It's data-driven. Your team debates data, not opinions."

**Step 4: Mitigation Strategy**
- For each critical risk, show recommended mitigation
- Example: "CP-4 — Establish backup data center in availability zone 2 (Timeline: 8 weeks, Cost: $250K)"
- Talking Point: "Each gap has an estimated fix. Your CFO can now see the investment required."

**Step 5: Timeline Impact Analysis**
- Show: If you fix gaps in priority order, when will you achieve compliance?
- Example: "With current team velocity (2 controls/week), you'll achieve FedRAMP Moderate in 6 weeks."
- Talking Point: "Executives want to know: Can we make the deadline? Show them the math."

**Step 6: Export Risk Report**
- Click "📥 Export Risk Report"
- Generates report with risk matrix, mitigation costs, and timeline
- Talking Point: "This goes to your program sponsor. It shows what will delay or threaten the schedule."

**Test Attachment:**
```
Sample Risk Heatmap:
---
Risk | Likelihood | Impact | Score | Mitigation | Cost | Timeline
CP-4 Recovery | High | Critical | 95 | Build secondary DC | $250K | 8 weeks
SA-3 SDLC | High | High | 85 | Implement tool + training | $50K | 4 weeks
PE-3 Physical | Medium | High | 60 | Upgrade locks + CCTV | $15K | 2 weeks
---
```

**Key Outcome:** Data-driven risk prioritization. Leadership makes better go/no-go decisions.

---

## Part 5: Capacity Planner (App #5)

### Business Context
You know what needs to be fixed and the timeline. But **do you have the people** to do it?

### Demo Flow

**Step 1: Load the Capacity Planner**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/05-capacity-planner/`
- Show: Team capacity view with FTEs allocated to this project
- Current team: 3 Security Engineers, 1 Compliance Lead, 1 Architect
- Talking Point: "Capacity planning prevents the classic mistake: great roadmap, no people to execute."

**Step 2: Map Remediation Tasks to Team**
- Show each gap mapped to required skillset
- CP-4 (contingency) → Requires: Architect + Security Engineer (120 hours)
- SA-3 (SDLC) → Requires: Compliance Lead + Security Engineer (80 hours)
- Talking Point: "The system shows you task → skillset → hours. You see immediately if you're over-allocated."

**Step 3: Identify Resource Conflicts**
- Show that your single Security Architect is allocated to 3 critical gaps simultaneously
- This creates a bottleneck
- Talking Point: "Without this view, your Architect becomes a single point of failure. Now you see it coming."

**Step 4: Adjust Capacity or Timeline**
- Option A: Hire or reallocate people → Timeline stays 6 weeks
- Option B: Keep team size → Timeline extends to 9 weeks
- Talking Point: "The math is automatic. More people = faster delivery, but at what cost? Show the tradeoff."

**Step 5: Forecast Team Utilization**
- Show burndown chart: How many hours/week will the team actually work?
- Account for: Meetings, other projects, vacation, ramp-up
- Realistic velocity: 60 hours/week actual execution (not 80)
- Talking Point: "Everyone says their team is at 100% utilization. This tool shows the reality. Better to forecast honestly."

**Step 6: Export Capacity Report**
- Click "📥 Export Capacity Plan"
- Includes: Team roster, task assignments, hours per person, timeline impact
- Talking Point: "Send this to your PMO. They'll use it to staff the engagement."

**Test Attachment:**
```
Sample Capacity Plan:
---
Resource | Role | Hours Available | Allocated Hours | Utilization | Risk
John Smith | Architect | 160 | 180 | 112% | OVERALLOCATED
Sarah Chen | Security Eng | 160 | 140 | 88% | OK
Mike Johnson | Compliance | 160 | 100 | 63% | UNDERUTILIZED
---
```

**Key Outcome:** Realistic capacity plan. No surprises when delivery slips.

---

## Part 6: Contract Monitor (App #6)

### Business Context
The RFP becomes a contract. Now you need to **track compliance obligations** in the contract language.

### Demo Flow

**Step 1: Load the Contract Monitor**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/06-contract-monitor/`
- Show: Contract clauses extracted and mapped to compliance obligations
- Talking Point: "The contract is your legal blueprint. This tool shows which clauses demand what action and when."

**Step 2: Extract Key Obligations**
- Show: CLIN-level breakdown (Contract Line Items)
- Example CLIN-001: "HIPAA BAA execution by 2025-01-15"
- Example CLIN-002: "FedRAMP ATO evidence by 2025-03-31"
- Example CLIN-003: "Penetration testing report by 2025-04-15"
- Talking Point: "Each CLIN is a commitment. Miss one = contract breach. Track them all."

**Step 3: Deadline Tracking**
- Show calendar view: All compliance deadlines mapped
- Color-coded: Green (On Track), Yellow (At Risk), Red (Overdue)
- Talking Point: "Your program manager sees deadline risk 60 days out, not on deadline day."

**Step 4: Link CLINs to Gaps**
- Show: "CLIN-001 (HIPAA BAA) requires these gaps to be closed: IA-2, AU-2, CA-7"
- Map each CLIN to POA&M items
- Talking Point: "You now see the connection: Contract obligation → Compliance gaps → Remediation plan."

**Step 5: Flag Risks**
- Show: "If CP-4 remediation slips 2 weeks, you'll miss CLIN-002 deadline."
- Alert threshold: 30 days out
- Talking Point: "Predictive alerting. You know about deadline risk before it happens."

**Step 6: Export Contract Obligations**
- Click "📥 Export Contract Compliance Report"
- Includes: CLINs, deadlines, status, gap linkage
- Talking Point: "Your contract manager now has a compliance tracking dashboard."

**Test Attachment:**
```
Sample Contract Monitor:
---
CLIN | Obligation | Deadline | Status | Linked Gaps | Risk
CLIN-001 | HIPAA BAA Execution | 2025-01-15 | ON TRACK | IA-2, AU-2 | GREEN
CLIN-002 | FedRAMP ATO Evidence | 2025-03-31 | AT RISK | CP-4, SA-3, SC-7 | YELLOW
CLIN-003 | Penetration Test Report | 2025-04-15 | NOT STARTED | CA-8, SI-3 | RED
---
```

**Key Outcome:** Contract obligations tied to compliance roadmap. Nothing falls through the cracks.

---

## Part 7: Steering Dashboard (App #7)

### Business Context
You're in execution. Your **executive sponsor needs a monthly status update** showing progress on all fronts.

### Demo Flow

**Step 1: Load the Steering Dashboard**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/07-steering-dashboard/`
- Show: Executive summary view with 4 key metrics
- Talking Point: "This is the slide you show at steering committee. One page, all the truth."

**Step 2: Show Progress on Key Metrics**
- Metric 1: Overall Compliance Score (73% → Target 95%)
- Metric 2: Gap Closure Rate (8 of 24 gaps closed, 33%)
- Metric 3: Schedule Adherence (On track, 92% confidence)
- Metric 4: Budget Utilization ($180K of $250K spent, 72%)
- Talking Point: "Four numbers tell the whole story. Green, yellow, red. No surprises."

**Step 3: Burndown Chart**
- Show: Remaining gaps → Closed gaps over time
- Target line: Complete by 2025-03-31
- Current trajectory: On track
- Talking Point: "If the line goes above the target, you escalate. Data-driven decision trigger."

**Step 4: Risk Summary**
- Show: Top 3 risks this month
  - Risk 1: Architect availability (MITIGATION: Started hiring)
  - Risk 2: HIPAA BAA negotiation stalled (MITIGATION: Escalated to sponsor)
  - Risk 3: Penetration test lab not ready (MITIGATION: Contractor engaged)
- Talking Point: "Risk section is brief. What matters? What's the mitigation? Done."

**Step 5: Milestone Status**
- Show: Target milestones this quarter
  - ✅ Gap analysis complete (done)
  - ✅ Capacity plan approved (done)
  - 🟡 Remediation 50% complete (on track)
  - ⚪ ATO submission ready (not yet started)
- Talking Point: "Traffic light status. Your sponsor glances at this and knows everything."

**Step 6: Financial Summary**
- Show: Budget allocation by category
  - People: $120K (70%)
  - Tools: $40K (18%)
  - Infrastructure: $25K (12%)
  - Total: $250K
- Variance: On budget (+/- 5%)
- Talking Point: "Show that money is being spent wisely. Finance appreciates clarity."

**Step 7: Export for Steering Committee**
- Click "📥 Export Steering Report"
- Generates polished PDF with all metrics, charts, and exec summary
- Talking Point: "This is your steering committee slide. Professional, complete, data-backed."

**Test Attachment:**
```
Sample Steering Dashboard:
---
COMPLIANCE PROGRAM STATUS — MONTH 3
Overall Compliance: 73% (Target: 95%) — YELLOW
Gaps Closed: 8/24 (33%) — ON TRACK
Schedule: 92% confidence of 2025-03-31 delivery — GREEN
Budget: $180K / $250K spent (72%) — GREEN

Top 3 Risks:
1. Architect availability — Hiring underway
2. HIPAA BAA negotiation — Escalated to sponsor
3. Penetration test lab — Contractor engaged

Next Month: Complete 8 more gaps, finalize ATO submission package
---
```

**Key Outcome:** Executive visibility into the program. Steering committee makes informed decisions.

---

## Part 8: Evidence Pack Generator (App #8)

### Business Context
It's March 31st. You've closed all gaps. Now the **3PAO (Third-Party Assessor) needs evidence** that you actually implemented every control.

### Demo Flow

**Step 1: Load the Evidence Pack Generator**
- URL: `https://raffa9000.github.io/marsh-mrs-suite-govcloud-assessment/apps/08-evidence-pack-generator/`
- Show: Control → Evidence mapping template
- Talking Point: "The 3PAO will grill you on every control. This tool ensures you have the receipts."

**Step 2: Build Evidence for Each Control**
- Show: For CP-4 (Contingency Planning)
  - Required evidence: RTO/RPO documentation, recovery procedures, test results
  - Upload: Disaster Recovery Plan.pdf, Backup Test Log.xlsx, Recovery Runbook.docx
- Talking Point: "Don't show up to assessment empty-handed. Organize your evidence ahead of time."

**Step 3: Map Evidence to Controls**
- Show: Each evidence artifact tagged with control(s) it satisfies
  - "Backup Test Log.xlsx" → Satisfies CP-4, CP-6, CP-9
  - "Disaster Recovery Plan.pdf" → Satisfies CP-2, CP-4
- Talking Point: "One document often proves multiple controls. This tool deduplicates and cross-references."

**Step 4: Generate Assessment Roadmap**
- Show: Control-by-control evidence checklist
- Example:
  - CP-4: Contingency Planning
    - Evidence 1: RTO/RPO doc (✅ Provided)
    - Evidence 2: Recovery procedures (✅ Provided)
    - Evidence 3: Test results (✅ Provided)
  - Status: 100% READY
- Talking Point: "You walk into the assessment knowing exactly what the 3PAO will ask and what you'll show."

**Step 5: Flag Gaps**
- Show: Any control with insufficient evidence highlighted
  - IR-4 (Incident Response): Only 1 of 3 evidence items provided (⚠️ INCOMPLETE)
- Talking Point: "You still have 14 days to get that evidence. Better to know now than in the assessment."

**Step 6: Generate ATO Evidence Package**
- Click "📥 Generate ATO Evidence Pack"
- Creates: Structured folder with all evidence organized by control
- Includes: Cover sheet, index, cross-reference map
- Talking Point: "Send this to the 3PAO. Organized, complete, professional. They notice. You look good."

**Step 7: Submit to 3PAO**
- Show: Evidence pack ready for formal assessment
- Include: "Formal ATO Assessment Package — VA Medical Center — FedRAMP Moderate"
- Timeline: 3PAO has 30 days to assess, issue SSP addendum, and recommend ATO
- Talking Point: "This is the finish line. Your evidence quality determines ATO speed."

**Test Attachment:**
```
Sample Evidence Pack Structure:
---
ATO_EVIDENCE_PACKAGE/
├── INDEX.txt (Control → Evidence mapping)
├── CP/
│   ├── CP-4/
│   │   ├── Disaster_Recovery_Plan.pdf
│   │   ├── RTO_RPO_Specifications.xlsx
│   │   ├── Recovery_Test_Results.pdf
│   └── CP-6/
├── IA/
│   ├── IA-2/
│   │   ├── MFA_Configuration_Evidence.pdf
│   │   └── Access_Log_Sample.xlsx
└── ASSESSMENT_READY_CHECKLIST.txt (100% complete)
---
```

**Key Outcome:** Complete evidence pack. ATO assessment moves at full speed.

---

## Part 9: Bringing It All Together - The End-to-End Story

### Walkthrough Timeline

**Week 0: RFP Received**
- VA Medical Center issues RFP with HIPAA + FedRAMP Moderate requirements
- Your team opens **RFP Intake Analyzer**
- In 15 minutes: Regulatory requirements understood, business impact scored, intake report generated

**Week 1: Go/No-Go Decision**
- Leadership reviews intake report + **MRS Dashboard**
- Sees: This is a high-impact opportunity (Very High business impact) but operationally constrained (tight 90-day ATO timeline)
- Decision: **PROCEED** (with risks understood)

**Week 2: Compliance Planning**
- You run **Gap Analyzer**: Current state is 73% NIST 800-53 Moderate compliant
- 24 gaps identified, POA&M generated
- You run **Risk Heatmap**: Identify top 5 risks (contingency, SDLC, incident response, physical security, assessment)
- You run **Capacity Planner**: Determine you need to hire 1 additional security engineer to stay on timeline

**Week 3: Execution Planning**
- **Capacity Planner** finalized; hiring approved
- **Contract Monitor** shows first key deadline: HIPAA BAA execution by day 30
- You link CLIN-001 to gaps IA-2, AU-2 (must be closed by day 30)

**Week 4-12: Execution (2+ months)**
- Every week, **Steering Dashboard** updated with progress
- Month 1: 8 gaps closed (33%) → Leadership briefing shows on-track status
- Month 2: 16 gaps closed (67%) → Risks being mitigated, capacity working as planned
- Risk re-assessment happens at 6-week mark; one risk escalated, mitigations approved

**Week 13: ATO Readiness**
- All 24 gaps closed (100% compliance)
- **Contract Monitor** confirms all CLINs on track
- **Evidence Pack Generator** used to organize 200+ artifacts into structured ATO evidence package

**Week 14: 3PAO Assessment Begins**
- You submit formal evidence package to 3PAO
- 3PAO has 30 days to assess
- Results: Minor findings only (not major); SSP addendum issued

**Week 16: ATO Awarded**
- **System Security Plan (SSP) approved** by authorizing official
- **Authorization to Operate (ATO) granted** for 3 years
- You've gone from RFP to ATO in 90 days — on time, on budget, all gaps closed

---

## Key Talking Points for Each Stage

| Stage | App | Key Message | Audience |
|-------|-----|-------------|----------|
| Intake | App 1 | "We understand the requirement in 15 minutes, not 2 weeks." | Sales, Business Development |
| Decision | App 2 | "We can forecast compliance risk before we bid." | Leadership, CFO |
| Planning | App 3 | "We have a concrete, data-driven remediation roadmap." | Program Manager, Compliance Lead |
| Risk | App 4 | "We know which gaps will kill the deal. They get priority." | CISO, Enterprise Risk |
| Capacity | App 5 | "We staff realistically. No surprises on schedule or budget." | PMO, HR, Finance |
| Obligations | App 6 | "Contract deadlines linked to compliance milestones. Nothing forgotten." | Legal, Contract Manager |
| Status | App 7 | "You get a one-page executive view every month. Complete transparency." | Steering Committee, Sponsor |
| Assessment | App 8 | "We arrive at ATO assessment 100% organized with complete evidence." | 3PAO, Compliance Officer |

---

## Demo Tips & Best Practices

### 1. **Time the Demo Right**
- Live 8-app demo: 45-60 minutes
- Executive demo: Use Steering Dashboard (App 7) as centerpiece; reference other apps as needed
- Technical demo: Start with RFP Intake (App 1) and flow sequentially

### 2. **Use Real Data**
- The apps come pre-loaded with sample data (12 RFPs, 16 NIST families, 24 gaps)
- Talk through **why** each number matters, not just what it is

### 3. **Show the Connections**
- "Notice how the gaps in App 3 are linked to contract CLINs in App 6?"
- "The risk scores in App 4 determine task priority in App 5?"
- Integration is the story

### 4. **Quantify the Benefit**
- "RFP intake in 15 minutes instead of 2 weeks = faster go/no-go decisions"
- "Gap analyzer prevents misses = reduces ATO delay risk"
- "Evidence pack cuts 3PAO assessment time by 30%"
- Make it about **business value**, not just features

### 5. **Address Pain Points**
- **Pain:** "We always miss something in compliance planning." **Solution:** App 3 (Gap Analyzer) + App 6 (Contract Monitor)
- **Pain:** "Leadership doesn't understand our roadmap." **Solution:** App 7 (Steering Dashboard) — one page, all truth
- **Pain:** "We spend weeks organizing evidence for 3PAO." **Solution:** App 8 (Evidence Pack Generator) — structured pack ready to go

### 6. **Leave with Takeaway Materials**
- Sample intake report (App 1 export)
- Sample POA&M (App 3 export)
- Sample steering dashboard (App 7 export)
- Printed one-pager: "Marsh MRS Suite: 8 Apps, 1 Lifecycle"

---

## FAQ for Audience

**Q: Do we need all 8 apps?**
A: Depends on your use case. Sales/BizDev? Start with Intake + Dashboard (Apps 1-2). Already in execution? Use Gap, Risk, Capacity, Contract (Apps 3-6). Ready for ATO? Use Evidence Pack (App 8). You adopt the apps as your program advances.

**Q: Can this integrate with our existing tools?**
A: Yes. Power Automate Bridge (not a visual app, but included) provides the integration layer. Export CSVs from any app; import into SharePoint, Teams, or your PMO tool.

**Q: What's the learning curve?**
A: Each app is intuitive — 5 minutes to learn, 15 minutes to extract value. The real value comes from **how you link them** (intake → decision → planning → execution → assessment). Walkthrough like this one shows the path.

**Q: How do I customize the sample data?**
A: Each app lets you edit inputs (client name, dates, frameworks). Changes propagate through the reports. For real projects, edit the app's local storage or work with us to customize the data model.

---

## Conclusion

The Marsh MRS Suite tells a **complete end-to-end compliance story**:

1. **Intake** → You understand the requirement
2. **Decision** → You decide to proceed (or pivot)
3. **Planning** → You map gaps and risks
4. **Execution** → You track progress monthly
5. **Assessment** → You submit organized evidence
6. **Authorization** → You get ATO

**The Suite compresses 90 days of painful compliance work into a streamlined, data-driven process.**

Each app is powerful alone. Together, they're a **compliance platform** that turns regulatory chaos into controlled, predictable outcomes.

---

## Appendix: Sample Test Data

### RFP Library (12 Sample RFPs)
1. VA Medical Center - Phoenix (Healthcare, HIPAA + FedRAMP Moderate)
2. DOD IT Modernization - Fort Meade (Defense, FedRAMP High)
3. CMS Analytics Platform - Maryland (Healthcare, HIPAA + FedRAMP Moderate)
4. HHS Research Cloud - DC (Federal, FedRAMP Moderate)
5. State Department Secure Collaboration - DC (Federal, FedRAMP Moderate + NIST SP 800-171)
6. FBI Data Center Consolidation - Quantico (Defense, FedRAMP High + CJIS)
7. Census Bureau Data Systems - Suitland (Federal, FedRAMP Moderate)
8. VA Benefits Processing - Denver (Healthcare, HIPAA + FedRAMP Moderate)
9. NIH Research Data - Bethesda (Healthcare, HIPAA + FISMA)
10. IRS Tax Processing - Kansas City (Federal, FedRAMP High + FISMA)
11. GSA Cloud Services - DC (Federal, FedRAMP Moderate)
12. Veteran Affairs Scheduling - Austin (Healthcare, HIPAA)

### NIST 800-53 Control Families (16 Families, 164 Controls Total)
- AC (Access Control) — 22 controls
- AT (Awareness & Training) — 4 controls
- AU (Audit & Accountability) — 12 controls
- CA (Security Assessment) — 8 controls
- CM (Configuration Management) — 10 controls
- CP (Contingency Planning) — 13 controls
- IA (Identification & Authentication) — 6 controls
- IR (Incident Response) — 10 controls
- MA (System Maintenance) — 7 controls
- PE (Physical Environment) — 14 controls
- PL (Planning) — 11 controls
- PS (Personnel Security) — 8 controls
- RA (Risk Assessment) — 5 controls
- SA (System & Services Acquisition) — 16 controls
- SC (System Communications) — 20 controls
- SI (System Information Protection) — 12 controls

---

**End of Walkthrough**
