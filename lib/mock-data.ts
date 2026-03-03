// Types aligned with the database schema
export type ContractType = "NDA" | "MSA" | "SOW"
export type State = "CA" | "NY" | "DE"
export type RiskTier = "LOW" | "MEDIUM" | "HIGH"
export type ContractStatus = "DRAFTING" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED"
export type ReviewStatus = "PENDING" | "AWAITING_DECISION" | "COMPLETED"

export interface User {
  id: number
  email: string
  role: "BU" | "LU"
  name: string
  created_at: string
}

export interface Contract {
  id: number
  contract_type: ContractType
  state: State
  risk_tier: RiskTier
  status: ContractStatus
  owner_id: number
  assigned_lu_id: number | null
  created_at: string
  updated_at: string
}

export interface ReviewRequest {
  id: number
  contract_id: number
  status: ReviewStatus
  created_at: string
}

export interface DraftForReview {
  draft_id: string
  contract_id: number
  contract_type: ContractType
  state: State
  risk_tier: RiskTier
  status: ContractStatus
  review_status: ReviewStatus
  submitted_by: string
  submitted_at: string
  version_no: number
  party_a: string
  party_b: string
}

// Contract template sections based on contract_skeleton (ordered_sections)
export interface ContractSection {
  section_id: string
  section_kind: string
  title: string
  required: boolean
  content: string
}

export interface ContractTemplate {
  contract_type: ContractType
  sections: ContractSection[]
}

// NDA Template Sections
const ndaSections: ContractSection[] = [
  {
    section_id: "sec-nda-1",
    section_kind: "header",
    title: "NON-DISCLOSURE AGREEMENT",
    required: true,
    content: `This Non-Disclosure Agreement ("Agreement") is entered into as of the Effective Date set forth below, by and between {{party_a}}, a corporation organized under the laws of {{state}} ("Disclosing Party"), and {{party_b}} ("Receiving Party"). Each may be referred to individually as a "Party" and collectively as the "Parties."`,
  },
  {
    section_id: "sec-nda-2",
    section_kind: "recitals",
    title: "RECITALS",
    required: true,
    content: `WHEREAS, the Disclosing Party possesses certain confidential and proprietary information relating to its business, technology, products, services, financial affairs, and strategic plans;\n\nWHEREAS, the Receiving Party desires to receive certain Confidential Information for the purpose of evaluating a potential business relationship between the Parties ("Purpose");\n\nWHEREAS, the Disclosing Party is willing to disclose such information subject to the terms and conditions set forth herein;\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`,
  },
  {
    section_id: "sec-nda-3",
    section_kind: "definitions",
    title: "1. DEFINITIONS",
    required: true,
    content: `1.1 "Confidential Information" means any and all non-public, proprietary, or confidential information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, or by any other means, including but not limited to:\n\n(a) Trade secrets, inventions, discoveries, know-how, techniques, processes, methods, algorithms, software code, designs, and specifications;\n\n(b) Business plans, strategies, financial data, projections, pricing, customer lists, supplier information, and marketing plans;\n\n(c) Technical data, research, product plans, product designs, engineering information, and test results;\n\n(d) Any information designated as "Confidential," "Proprietary," or with a similar marking at the time of disclosure.\n\n1.2 "Confidential Information" does not include information that: (a) is or becomes publicly available without breach of this Agreement; (b) was known to the Receiving Party prior to disclosure; (c) is independently developed by the Receiving Party without use of or reference to the Confidential Information; or (d) is rightfully received from a third party without restriction on disclosure.`,
  },
  {
    section_id: "sec-nda-4",
    section_kind: "obligations",
    title: "2. OBLIGATIONS OF THE RECEIVING PARTY",
    required: true,
    content: `2.1 The Receiving Party shall hold all Confidential Information in strict confidence and shall not disclose, publish, or otherwise disseminate any Confidential Information to any third party without the prior written consent of the Disclosing Party.\n\n2.2 The Receiving Party shall use the Confidential Information solely for the Purpose and shall not use the Confidential Information for any other purpose, including but not limited to any competitive purpose.\n\n2.3 The Receiving Party shall protect the Confidential Information using the same degree of care it uses to protect its own confidential information of a similar nature, but in no event less than reasonable care.\n\n2.4 The Receiving Party shall limit access to the Confidential Information to those of its employees, officers, directors, agents, and advisors who have a need to know such information for the Purpose and who are bound by confidentiality obligations no less restrictive than those contained herein.`,
  },
  {
    section_id: "sec-nda-5",
    section_kind: "permitted_disclosures",
    title: "3. PERMITTED DISCLOSURES",
    required: true,
    content: `3.1 The Receiving Party may disclose Confidential Information to the extent required by applicable law, regulation, or order of a court or governmental authority of competent jurisdiction, provided that the Receiving Party:\n\n(a) Provides the Disclosing Party with prompt written notice of such requirement prior to disclosure (to the extent legally permissible);\n\n(b) Cooperates with the Disclosing Party in seeking a protective order or other appropriate remedy;\n\n(c) Discloses only that portion of the Confidential Information that is legally required to be disclosed.`,
  },
  {
    section_id: "sec-nda-6",
    section_kind: "term",
    title: "4. TERM AND TERMINATION",
    required: true,
    content: `4.1 This Agreement shall be effective as of the Effective Date and shall continue in force for a period of two (2) years from the Effective Date, unless earlier terminated by either Party upon thirty (30) days' prior written notice.\n\n4.2 The confidentiality obligations set forth herein shall survive the termination or expiration of this Agreement for a period of three (3) years following such termination or expiration.\n\n4.3 Upon termination or expiration, the Receiving Party shall promptly return or destroy all Confidential Information in its possession, including all copies, notes, summaries, and extracts thereof, and shall certify such return or destruction in writing.`,
  },
  {
    section_id: "sec-nda-7",
    section_kind: "remedies",
    title: "5. REMEDIES",
    required: true,
    content: `5.1 The Parties acknowledge that any breach or threatened breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages would be an inadequate remedy.\n\n5.2 In the event of any such breach or threatened breach, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity, without the necessity of posting a bond or proving actual damages.`,
  },
  {
    section_id: "sec-nda-8",
    section_kind: "governing_law",
    title: "6. GOVERNING LAW AND JURISDICTION",
    required: true,
    content: `6.1 This Agreement shall be governed by and construed in accordance with the laws of the State of {{state}}, without regard to its conflict of laws principles.\n\n6.2 Any dispute arising out of or relating to this Agreement shall be submitted to the exclusive jurisdiction of the state and federal courts located in {{state}}.`,
  },
  {
    section_id: "sec-nda-9",
    section_kind: "miscellaneous",
    title: "7. MISCELLANEOUS",
    required: false,
    content: `7.1 Entire Agreement. This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions.\n\n7.2 Amendment. No amendment or modification of this Agreement shall be valid or binding unless made in writing and signed by both Parties.\n\n7.3 Severability. If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.\n\n7.4 Waiver. No failure or delay by either Party in exercising any right under this Agreement shall constitute a waiver of that right.\n\n7.5 Counterparts. This Agreement may be executed in counterparts, each of which shall be deemed an original.`,
  },
  {
    section_id: "sec-nda-10",
    section_kind: "signatures",
    title: "8. SIGNATURES",
    required: true,
    content: `IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the Effective Date.\n\nDISCLOSING PARTY: {{party_a}}\nBy: ___________________________\nName:\nTitle:\nDate:\n\nRECEIVING PARTY: {{party_b}}\nBy: ___________________________\nName:\nTitle:\nDate:`,
  },
]

// MSA Template Sections
const msaSections: ContractSection[] = [
  {
    section_id: "sec-msa-1",
    section_kind: "header",
    title: "MASTER SERVICES AGREEMENT",
    required: true,
    content: `This Master Services Agreement ("Agreement") is entered into as of the Effective Date set forth below, by and between {{party_a}}, a corporation organized under the laws of {{state}} ("Client"), and {{party_b}} ("Service Provider"). Each may be referred to individually as a "Party" and collectively as the "Parties."`,
  },
  {
    section_id: "sec-msa-2",
    section_kind: "recitals",
    title: "RECITALS",
    required: true,
    content: `WHEREAS, Client desires to engage Service Provider to perform certain professional services as described herein and in one or more Statements of Work;\n\nWHEREAS, Service Provider possesses the necessary skills, qualifications, and experience to perform such services;\n\nNOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`,
  },
  {
    section_id: "sec-msa-3",
    section_kind: "scope",
    title: "1. PURPOSE AND SCOPE",
    required: true,
    content: `1.1 This Agreement establishes the general terms and conditions under which Service Provider shall provide professional services to Client.\n\n1.2 The specific scope, deliverables, timelines, and fees for each engagement shall be set forth in individual Statements of Work ("SOW") executed by both Parties and attached as exhibits to this Agreement.\n\n1.3 Each SOW shall be governed by the terms of this Agreement. In the event of any conflict between the terms of this Agreement and a SOW, the terms of this Agreement shall prevail unless the SOW expressly states otherwise.\n\n1.4 No services shall be provided by Service Provider except as authorized by a fully executed SOW.`,
  },
  {
    section_id: "sec-msa-4",
    section_kind: "term",
    title: "2. TERM AND TERMINATION",
    required: true,
    content: `2.1 This Agreement shall be effective as of the Effective Date and shall continue for an initial term of one (1) year ("Initial Term"), unless earlier terminated as provided herein.\n\n2.2 Upon expiration of the Initial Term, this Agreement shall automatically renew for successive one (1) year renewal terms unless either Party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.\n\n2.3 Either Party may terminate this Agreement for convenience upon ninety (90) days' prior written notice.\n\n2.4 Either Party may terminate this Agreement immediately upon written notice if the other Party: (a) materially breaches this Agreement and fails to cure such breach within thirty (30) days of receiving written notice; or (b) becomes insolvent, files for bankruptcy, or ceases to conduct business in the normal course.\n\n2.5 Upon termination, Service Provider shall: (a) cease all work under outstanding SOWs; (b) deliver all completed and in-progress deliverables; (c) return or destroy all Client Confidential Information.`,
  },
  {
    section_id: "sec-msa-5",
    section_kind: "service_levels",
    title: "3. SERVICE LEVELS AND PERFORMANCE",
    required: true,
    content: `3.1 Service Provider shall perform all services in a professional and workmanlike manner, consistent with generally accepted industry standards and practices.\n\n3.2 Service Provider shall assign qualified personnel with appropriate skills and experience to perform the services described in each SOW.\n\n3.3 Service Provider shall comply with all applicable laws, regulations, and industry standards in the performance of services.\n\n3.4 Service Provider shall provide Client with regular progress reports as specified in the applicable SOW, but no less frequently than monthly.\n\n3.5 Any service level agreements, key performance indicators, or performance metrics shall be defined in the applicable SOW.`,
  },
  {
    section_id: "sec-msa-6",
    section_kind: "fees",
    title: "4. FEES AND PAYMENT",
    required: true,
    content: `4.1 Client shall pay Service Provider the fees set forth in each SOW for services satisfactorily performed in accordance with this Agreement.\n\n4.2 Unless otherwise specified in the applicable SOW, Service Provider shall submit invoices monthly in arrears for services performed during the preceding month.\n\n4.3 Client shall pay all undisputed invoices within thirty (30) days of receipt. Late payments shall bear interest at the rate of one and one-half percent (1.5%) per month or the maximum rate permitted by law, whichever is less.\n\n4.4 Client may dispute any invoice or portion thereof in good faith by providing written notice to Service Provider within fifteen (15) days of receipt, specifying the nature of the dispute.\n\n4.5 All fees are exclusive of applicable taxes. Client shall be responsible for all applicable sales, use, and value-added taxes.`,
  },
  {
    section_id: "sec-msa-7",
    section_kind: "ip_rights",
    title: "5. INTELLECTUAL PROPERTY RIGHTS",
    required: true,
    content: `5.1 All deliverables, work product, and materials created by Service Provider specifically for Client under any SOW ("Work Product") shall be the exclusive property of Client upon full payment.\n\n5.2 Service Provider hereby assigns to Client all right, title, and interest in and to the Work Product, including all intellectual property rights therein.\n\n5.3 Notwithstanding the foregoing, Service Provider shall retain all rights in its pre-existing intellectual property, tools, methodologies, know-how, and general skills ("Service Provider IP"). To the extent any Service Provider IP is incorporated into any Work Product, Service Provider grants Client a non-exclusive, perpetual, royalty-free license to use such Service Provider IP solely as part of the Work Product.\n\n5.4 Neither Party shall use the other Party's trademarks, trade names, or logos without prior written consent.`,
  },
  {
    section_id: "sec-msa-8",
    section_kind: "confidentiality",
    title: "6. CONFIDENTIALITY",
    required: true,
    content: `6.1 Each Party acknowledges that it may receive Confidential Information of the other Party in connection with this Agreement.\n\n6.2 "Confidential Information" means any non-public information disclosed by either Party that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.\n\n6.3 The Receiving Party shall: (a) hold the Disclosing Party's Confidential Information in strict confidence; (b) use such information solely for purposes of this Agreement; (c) not disclose such information to any third party without prior written consent; (d) protect such information with the same degree of care used to protect its own confidential information, but no less than reasonable care.\n\n6.4 These confidentiality obligations shall survive termination or expiration of this Agreement for a period of three (3) years.`,
  },
  {
    section_id: "sec-msa-9",
    section_kind: "liability",
    title: "7. LIMITATION OF LIABILITY",
    required: true,
    content: `7.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY, INDEMNIFICATION OBLIGATIONS, OR WILLFUL MISCONDUCT, NEITHER PARTY SHALL BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT.\n\n7.2 EXCEPT FOR BREACHES OF CONFIDENTIALITY, INDEMNIFICATION OBLIGATIONS, OR WILLFUL MISCONDUCT, EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE UNDER THE APPLICABLE SOW DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM.\n\n7.3 The limitations set forth in this Section shall apply regardless of the form of action, whether in contract, tort, strict liability, or otherwise, and shall survive the termination or expiration of this Agreement.`,
  },
  {
    section_id: "sec-msa-10",
    section_kind: "indemnification",
    title: "8. INDEMNIFICATION",
    required: true,
    content: `8.1 Service Provider shall indemnify, defend, and hold harmless Client from and against any and all claims, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) Service Provider's negligence or willful misconduct; (b) any breach of this Agreement by Service Provider; (c) any claim that the deliverables infringe any third-party intellectual property rights.\n\n8.2 Client shall indemnify, defend, and hold harmless Service Provider from and against any and all claims, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) Client's negligence or willful misconduct; (b) any breach of this Agreement by Client.`,
  },
  {
    section_id: "sec-msa-11",
    section_kind: "data_security",
    title: "9. DATA PROTECTION AND SECURITY",
    required: true,
    content: `9.1 Service Provider shall implement and maintain appropriate technical and organizational measures to protect Client data against unauthorized access, disclosure, alteration, or destruction.\n\n9.2 Service Provider shall comply with all applicable data protection laws and regulations in the performance of services.\n\n9.3 In the event of a data breach involving Client data, Service Provider shall: (a) notify Client within 48 hours of discovery; (b) provide reasonable cooperation in investigating and mitigating the breach; (c) take all necessary steps to prevent recurrence.\n\n9.4 Upon termination of this Agreement, Service Provider shall securely delete or return all Client data within thirty (30) days, and certify such deletion or return in writing.`,
  },
  {
    section_id: "sec-msa-12",
    section_kind: "governing_law",
    title: "10. GOVERNING LAW AND DISPUTE RESOLUTION",
    required: true,
    content: `10.1 This Agreement shall be governed by and construed in accordance with the laws of the State of {{state}}, without regard to its conflict of laws principles.\n\n10.2 The Parties agree to attempt to resolve any dispute arising out of this Agreement through good faith negotiation. If the dispute cannot be resolved within thirty (30) days, it shall be submitted to binding arbitration under the rules of the American Arbitration Association.\n\n10.3 The arbitration shall take place in {{state}}, and the decision of the arbitrator(s) shall be final and binding.`,
  },
  {
    section_id: "sec-msa-13",
    section_kind: "miscellaneous",
    title: "11. GENERAL PROVISIONS",
    required: false,
    content: `11.1 Entire Agreement. This Agreement, together with all SOWs and exhibits, constitutes the entire agreement between the Parties.\n\n11.2 Amendment. No modification shall be effective unless in writing and signed by authorized representatives of both Parties.\n\n11.3 Assignment. Neither Party may assign this Agreement without prior written consent, except in connection with a merger, acquisition, or sale of substantially all assets.\n\n11.4 Force Majeure. Neither Party shall be liable for delays or failures in performance caused by events beyond its reasonable control.\n\n11.5 Notices. All notices shall be in writing and delivered to the addresses specified herein.\n\n11.6 Severability. If any provision is found to be unenforceable, the remaining provisions shall continue in full force and effect.\n\n11.7 Waiver. No waiver of any provision shall be effective unless in writing and signed by the waiving Party.\n\n11.8 Counterparts. This Agreement may be executed in counterparts.`,
  },
  {
    section_id: "sec-msa-14",
    section_kind: "signatures",
    title: "12. SIGNATURES",
    required: true,
    content: `IN WITNESS WHEREOF, the Parties have executed this Master Services Agreement as of the Effective Date.\n\nCLIENT: {{party_a}}\nBy: ___________________________\nName:\nTitle:\nDate:\n\nSERVICE PROVIDER: {{party_b}}\nBy: ___________________________\nName:\nTitle:\nDate:`,
  },
]

// SOW Template Sections
const sowSections: ContractSection[] = [
  {
    section_id: "sec-sow-1",
    section_kind: "header",
    title: "STATEMENT OF WORK",
    required: true,
    content: `This Statement of Work ("SOW") is entered into pursuant to the Master Services Agreement dated [MSA Date] ("Agreement") by and between {{party_a}} ("Client") and {{party_b}} ("Service Provider"). This SOW is subject to and governed by the terms of the Agreement. In the event of any conflict, the Agreement shall prevail unless expressly stated otherwise herein.`,
  },
  {
    section_id: "sec-sow-2",
    section_kind: "project_overview",
    title: "1. PROJECT OVERVIEW",
    required: true,
    content: `1.1 Project Name: [Project Name]\n\n1.2 Project Description: Service Provider shall provide the services described herein to support Client's business objectives. The project involves the design, development, and delivery of the specified deliverables as outlined in this SOW.\n\n1.3 Background: [Brief description of the business context and rationale for this engagement.]\n\n1.4 Objectives: The primary objectives of this engagement are:\n(a) [Objective 1]\n(b) [Objective 2]\n(c) [Objective 3]`,
  },
  {
    section_id: "sec-sow-3",
    section_kind: "scope",
    title: "2. SCOPE OF WORK",
    required: true,
    content: `2.1 In-Scope Services:\n(a) [Service/Activity 1]\n(b) [Service/Activity 2]\n(c) [Service/Activity 3]\n(d) [Service/Activity 4]\n\n2.2 Out-of-Scope: The following items are explicitly excluded from this SOW and, if required, shall be addressed through a separate SOW or change order:\n(a) [Excluded item 1]\n(b) [Excluded item 2]\n\n2.3 Assumptions: This SOW is based on the following assumptions:\n(a) Client shall provide timely access to necessary systems, data, and personnel.\n(b) [Assumption 2]\n(c) [Assumption 3]\n\n2.4 Dependencies: [List any dependencies on Client or third parties.]`,
  },
  {
    section_id: "sec-sow-4",
    section_kind: "deliverables",
    title: "3. DELIVERABLES",
    required: true,
    content: `3.1 Service Provider shall deliver the following deliverables:\n\n| # | Deliverable | Description | Format | Due Date |\n|---|------------|-------------|--------|----------|\n| 1 | [Name] | [Description] | [Format] | [Date] |\n| 2 | [Name] | [Description] | [Format] | [Date] |\n| 3 | [Name] | [Description] | [Format] | [Date] |\n| 4 | [Name] | [Description] | [Format] | [Date] |\n\n3.2 All deliverables shall meet the acceptance criteria specified in Section 6 of this SOW.`,
  },
  {
    section_id: "sec-sow-5",
    section_kind: "timeline",
    title: "4. TIMELINE AND MILESTONES",
    required: true,
    content: `4.1 Project Timeline:\n\n| Phase | Description | Start Date | End Date | Milestone |\n|-------|------------|-----------|---------|----------|\n| Phase 1 | Discovery & Planning | [Date] | [Date] | Kickoff |\n| Phase 2 | Design & Development | [Date] | [Date] | Design Review |\n| Phase 3 | Testing & QA | [Date] | [Date] | UAT Signoff |\n| Phase 4 | Deployment & Handover | [Date] | [Date] | Go-Live |\n\n4.2 Estimated project duration: [X] weeks from the Effective Date of this SOW.\n\n4.3 The timeline is contingent upon Client meeting its obligations and providing timely feedback, reviews, and approvals.`,
  },
  {
    section_id: "sec-sow-6",
    section_kind: "acceptance",
    title: "5. ACCEPTANCE CRITERIA",
    required: true,
    content: `5.1 Upon delivery of each deliverable, Client shall have ten (10) business days to review and either accept or reject the deliverable ("Review Period").\n\n5.2 If Client rejects a deliverable, Client shall provide specific written reasons for rejection. Service Provider shall remedy the identified deficiencies and resubmit within five (5) business days.\n\n5.3 A deliverable shall be deemed accepted if: (a) Client provides written acceptance; or (b) Client fails to provide written notice of rejection within the Review Period.\n\n5.4 Acceptance Criteria for each deliverable:\n(a) Functional requirements are met as specified\n(b) Documentation is complete and accurate\n(c) Quality standards are met per agreed specifications\n(d) [Additional criteria as applicable]`,
  },
  {
    section_id: "sec-sow-7",
    section_kind: "fees",
    title: "6. FEES AND PAYMENT SCHEDULE",
    required: true,
    content: `6.1 Fee Structure: [Fixed Fee / Time and Materials / Milestone-Based]\n\n6.2 Total SOW Value: $[Amount]\n\n6.3 Payment Schedule:\n\n| Milestone | Amount | Due Date |\n|-----------|--------|----------|\n| Project Kickoff | $[Amount] (25%) | Upon SOW execution |\n| Design Approval | $[Amount] (25%) | Upon milestone completion |\n| UAT Signoff | $[Amount] (25%) | Upon milestone completion |\n| Final Delivery | $[Amount] (25%) | Upon final acceptance |\n\n6.4 Invoices shall be submitted per the payment schedule above. Payment terms are net thirty (30) days as specified in the Agreement.\n\n6.5 Travel and expenses, if applicable, shall be pre-approved in writing and reimbursed at cost.`,
  },
  {
    section_id: "sec-sow-8",
    section_kind: "team",
    title: "7. PROJECT TEAM AND GOVERNANCE",
    required: true,
    content: `7.1 Service Provider Project Team:\n- Project Manager: [Name]\n- Technical Lead: [Name]\n- [Other Key Personnel]\n\n7.2 Client Project Team:\n- Project Sponsor: [Name]\n- Project Manager: [Name]\n- [Other Key Contacts]\n\n7.3 Governance:\n(a) Weekly status meetings shall be held every [Day] at [Time].\n(b) Monthly executive steering committee reviews.\n(c) Change requests shall be documented and approved by both Project Managers before work commences.`,
  },
  {
    section_id: "sec-sow-9",
    section_kind: "change_control",
    title: "8. CHANGE CONTROL",
    required: true,
    content: `8.1 Any change to the scope, deliverables, timeline, or fees set forth in this SOW must be documented in a written Change Order signed by authorized representatives of both Parties.\n\n8.2 The Change Order shall specify: (a) the nature of the change; (b) the impact on deliverables, timeline, and fees; (c) any new or modified acceptance criteria.\n\n8.3 Service Provider shall not begin work on any change until the Change Order has been fully executed.`,
  },
  {
    section_id: "sec-sow-10",
    section_kind: "signatures",
    title: "9. SIGNATURES",
    required: true,
    content: `IN WITNESS WHEREOF, the Parties have executed this Statement of Work as of the date last signed below.\n\nCLIENT: {{party_a}}\nBy: ___________________________\nName:\nTitle:\nDate:\n\nSERVICE PROVIDER: {{party_b}}\nBy: ___________________________\nName:\nTitle:\nDate:`,
  },
]

export const contractTemplates: Record<ContractType, ContractTemplate> = {
  NDA: { contract_type: "NDA", sections: ndaSections },
  MSA: { contract_type: "MSA", sections: msaSections },
  SOW: { contract_type: "SOW", sections: sowSections },
}

// Resolve template placeholders for a given draft
export function resolveTemplate(draft: DraftForReview): ContractSection[] {
  const template = contractTemplates[draft.contract_type]
  return template.sections.map((section) => ({
    ...section,
    content: section.content
      .replace(/\{\{party_a\}\}/g, draft.party_a)
      .replace(/\{\{party_b\}\}/g, draft.party_b)
      .replace(/\{\{state\}\}/g, draft.state),
  }))
}

// Review finding types aligned with review_findings + review_suggestions tables
export type FindingSeverity = "HIGH" | "MEDIUM" | "LOW"
export type ClauseDecision = "PENDING" | "ACCEPTED" | "REJECTED"

export interface ReviewFinding {
  id: number
  review_id: number
  block_id: string            // maps to contract_block_index.block_id
  section_title: string
  issue_type: string
  severity: FindingSeverity
  original_clause_text: string
  issue_summary: string
  violation_explanation: string
  playbook_rule_citation: string
  approved_fallback_language: string
  risk_explanation: string
  decision: ClauseDecision
  legal_comment: string
}

export interface ReviewReport {
  review_id: number
  contract_id: number
  findings: ReviewFinding[]
  created_at: string
}

// Review findings generators per contract type
// NDA flagged clauses
const ndaFindings: Omit<ReviewFinding, "id" | "review_id" | "decision" | "legal_comment">[] = [
  {
    block_id: "sec-nda-4",
    section_title: "Obligations of the Receiving Party",
    issue_type: "Insufficient Protection Standard",
    severity: "HIGH",
    original_clause_text: `The Receiving Party shall protect the Confidential Information using the same degree of care it uses to protect its own confidential information of a similar nature, but in no event less than reasonable care.`,
    issue_summary: "Protection standard defaults to 'reasonable care' minimum which is below playbook threshold for HIGH risk NDAs.",
    violation_explanation: "For HIGH risk contracts, the playbook mandates a 'highest degree of care' standard rather than 'reasonable care'. The current clause allows the Receiving Party to apply a lower standard of protection, which is inadequate for sensitive disclosures involving trade secrets and proprietary technology.",
    playbook_rule_citation: "NDA Playbook v2.1 - Section 3.2: 'HIGH risk NDAs must require the highest degree of care, not merely reasonable care.'",
    approved_fallback_language: `The Receiving Party shall protect the Confidential Information using the highest degree of care it uses to protect its own most sensitive confidential information, and in no event less than the highest degree of care reasonably expected under the circumstances.`,
    risk_explanation: "A 'reasonable care' standard is subjective and may be interpreted as a lower bar. In HIGH risk scenarios involving trade secrets and strategic IP, this could lead to inadequate protection and expose the Disclosing Party to significant competitive harm.",
  },
  {
    block_id: "sec-nda-6",
    section_title: "Term and Termination",
    issue_type: "Non-Compliant Survival Period",
    severity: "MEDIUM",
    original_clause_text: `The confidentiality obligations set forth herein shall survive the termination or expiration of this Agreement for a period of three (3) years following such termination or expiration.`,
    issue_summary: "Survival period of 3 years is below the playbook minimum of 5 years for HIGH risk NDAs in California.",
    violation_explanation: "California HIGH risk NDAs require extended survival periods due to the state's strong trade secret protections under CUTSA. A 3-year survival period is insufficient and could leave sensitive IP unprotected during critical competitive windows.",
    playbook_rule_citation: "NDA Playbook v2.1 - Section 5.1: 'Survival period for HIGH risk NDAs in CA must be minimum 5 years, or perpetual for trade secrets.'",
    approved_fallback_language: `The confidentiality obligations set forth herein shall survive the termination or expiration of this Agreement for a period of five (5) years following such termination or expiration; provided, however, that with respect to any Confidential Information constituting trade secrets, such obligations shall survive for so long as such information remains a trade secret under applicable law.`,
    risk_explanation: "Trade secrets disclosed under this NDA may retain their commercial value well beyond 3 years. A shorter survival period could leave the Disclosing Party without contractual recourse if the Receiving Party discloses confidential information after the survival window closes.",
  },
  {
    block_id: "sec-nda-8",
    section_title: "Governing Law and Jurisdiction",
    issue_type: "Missing Arbitration Clause",
    severity: "LOW",
    original_clause_text: `Any dispute arising out of or relating to this Agreement shall be submitted to the exclusive jurisdiction of the state and federal courts located in {{state}}.`,
    issue_summary: "The dispute resolution mechanism defaults to litigation. Playbook recommends arbitration as the primary mechanism for NDA disputes.",
    violation_explanation: "While court jurisdiction is valid, the playbook guidance for NDAs recommends binding arbitration to maintain confidentiality of the dispute proceedings themselves, which is particularly important for confidential information disputes.",
    playbook_rule_citation: "NDA Playbook v2.1 - Section 7.2: 'Preferred dispute resolution for NDAs is binding arbitration to maintain confidentiality of proceedings.'",
    approved_fallback_language: `Any dispute arising out of or relating to this Agreement shall first be submitted to binding arbitration administered by the American Arbitration Association under its Commercial Arbitration Rules. The arbitration shall be conducted in {{state}}. The arbitrator's decision shall be final and binding. Notwithstanding the foregoing, either Party may seek injunctive relief in any court of competent jurisdiction.`,
    risk_explanation: "Litigation is a public process. For confidential information disputes, public court filings could inadvertently expose the very information the NDA seeks to protect. Arbitration keeps proceedings private.",
  },
]

// MSA flagged clauses
const msaFindings: Omit<ReviewFinding, "id" | "review_id" | "decision" | "legal_comment">[] = [
  {
    block_id: "sec-msa-9",
    section_title: "Limitation of Liability",
    issue_type: "Non-Compliant Liability Cap",
    severity: "HIGH",
    original_clause_text: `EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE UNDER THE APPLICABLE SOW DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM.`,
    issue_summary: "Liability cap references SOW-level fees instead of total agreement value. This is non-compliant for MEDIUM/HIGH risk MSAs.",
    violation_explanation: "The playbook requires that liability caps for MEDIUM and HIGH risk MSAs reference the total fees under the Agreement (across all SOWs), not individual SOW fees. Limiting liability to a single SOW's fees significantly undervalues potential exposure.",
    playbook_rule_citation: "MSA Playbook v3.2 - Section 4.1: 'Liability cap must reference total Agreement fees for MEDIUM+ risk. SOW-level caps are only permitted for LOW risk engagements.'",
    approved_fallback_language: `EACH PARTY'S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED TWO TIMES (2x) THE TOTAL FEES PAID OR PAYABLE UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE CLAIM.`,
    risk_explanation: "If the client has multiple active SOWs, a SOW-level cap could limit recovery to a fraction of the actual engagement value. For a $500K agreement with five $100K SOWs, the cap could be as low as $100K instead of $1M.",
  },
  {
    block_id: "sec-msa-4",
    section_title: "Term and Termination",
    issue_type: "Missing Transition Assistance",
    severity: "MEDIUM",
    original_clause_text: `Upon termination, Service Provider shall: (a) cease all work under outstanding SOWs; (b) deliver all completed and in-progress deliverables; (c) return or destroy all Client Confidential Information.`,
    issue_summary: "Termination provisions lack mandatory transition assistance period required by the playbook for MSAs.",
    violation_explanation: "The MSA playbook requires that all termination clauses include a transition assistance period of no less than 30 days, during which the Service Provider must cooperate with the Client or a successor provider to ensure business continuity.",
    playbook_rule_citation: "MSA Playbook v3.2 - Section 2.4: 'All MSAs must include transition assistance obligations of minimum 30 days upon termination.'",
    approved_fallback_language: `Upon termination, Service Provider shall: (a) cease all work under outstanding SOWs; (b) deliver all completed and in-progress deliverables; (c) return or destroy all Client Confidential Information; (d) provide transition assistance to Client or its designated successor for a period of not less than thirty (30) days at Service Provider's then-current rates, including knowledge transfer, documentation, and reasonable cooperation.`,
    risk_explanation: "Without transition assistance, the Client faces operational risk if the engagement is terminated mid-project. Critical knowledge, access credentials, and in-progress work could be lost, causing delays and additional costs.",
  },
  {
    block_id: "sec-msa-11",
    section_title: "Data Protection and Security",
    issue_type: "Inadequate Breach Notification Window",
    severity: "HIGH",
    original_clause_text: `In the event of a data breach involving Client data, Service Provider shall: (a) notify Client within 48 hours of discovery...`,
    issue_summary: "48-hour breach notification window exceeds the playbook maximum of 24 hours for MEDIUM+ risk MSAs.",
    violation_explanation: "New York regulatory requirements (NY SHIELD Act) and the playbook mandate a 24-hour notification window for data breaches involving personal or sensitive business data. The current 48-hour window may result in delayed regulatory filings by the Client.",
    playbook_rule_citation: "MSA Playbook v3.2 - Section 6.3: 'Data breach notification must be within 24 hours for MEDIUM and HIGH risk. 48 hours only permitted for LOW risk.'",
    approved_fallback_language: `In the event of a data breach involving Client data, Service Provider shall: (a) notify Client within twenty-four (24) hours of discovery; (b) provide reasonable cooperation in investigating and mitigating the breach; (c) take all necessary steps to prevent recurrence; (d) provide a detailed written incident report within five (5) business days.`,
    risk_explanation: "A 48-hour delay in breach notification can result in regulatory non-compliance for the Client, especially under the NY SHIELD Act. The Client needs prompt notification to meet its own reporting obligations and mitigate damages.",
  },
]

// SOW flagged clauses
const sowFindings: Omit<ReviewFinding, "id" | "review_id" | "decision" | "legal_comment">[] = [
  {
    block_id: "sec-sow-6",
    section_title: "Acceptance Criteria",
    issue_type: "Excessive Review Period",
    severity: "MEDIUM",
    original_clause_text: `Upon delivery of each deliverable, Client shall have ten (10) business days to review and either accept or reject the deliverable ("Review Period").`,
    issue_summary: "10-day review period is below the playbook minimum of 15 business days for SOW acceptance testing.",
    violation_explanation: "The playbook requires a minimum 15-business-day review period for SOW deliverables to ensure adequate time for quality assurance, user acceptance testing, and stakeholder review. A 10-day period may not provide sufficient time for thorough testing.",
    playbook_rule_citation: "SOW Playbook v1.4 - Section 4.2: 'Minimum acceptance review period is 15 business days. May be extended for complex deliverables.'",
    approved_fallback_language: `Upon delivery of each deliverable, Client shall have fifteen (15) business days to review and either accept or reject the deliverable ("Review Period"). For deliverables involving software or system integration, the Review Period shall be extended to twenty (20) business days.`,
    risk_explanation: "An insufficient review period may result in deemed acceptance of defective deliverables. If Client fails to respond within 10 days due to resource constraints, the deliverable is automatically accepted regardless of quality.",
  },
  {
    block_id: "sec-sow-9",
    section_title: "Change Control",
    issue_type: "Missing Cost Impact Provision",
    severity: "LOW",
    original_clause_text: `The Change Order shall specify: (a) the nature of the change; (b) the impact on deliverables, timeline, and fees; (c) any new or modified acceptance criteria.`,
    issue_summary: "Change control clause lacks mandatory cost impact ceiling provision from the playbook.",
    violation_explanation: "The playbook requires that change orders include a maximum cost impact threshold (typically 15% of SOW value) above which executive approval is required. Without this, incremental changes could cause significant budget overruns.",
    playbook_rule_citation: "SOW Playbook v1.4 - Section 6.1: 'Change orders exceeding 15% cumulative cost impact require executive-level approval from both Parties.'",
    approved_fallback_language: `The Change Order shall specify: (a) the nature of the change; (b) the impact on deliverables, timeline, and fees; (c) any new or modified acceptance criteria; (d) cumulative cost impact as a percentage of total SOW value. Any Change Order that would cause cumulative changes to exceed fifteen percent (15%) of the original SOW value shall require approval by authorized executive representatives of both Parties.`,
    risk_explanation: "Without a cost ceiling mechanism, multiple small change orders could collectively inflate the SOW budget well beyond the approved amount. The 15% threshold provides a governance checkpoint for budget management.",
  },
]

const findingsMap: Record<string, Omit<ReviewFinding, "id" | "review_id" | "decision" | "legal_comment">[]> = {
  NDA: ndaFindings,
  MSA: msaFindings,
  SOW: sowFindings,
}

// Simulates review agent output based on draft metadata
export function generateReviewReport(draft: DraftForReview): ReviewReport {
  const baseFindingsList = findingsMap[draft.contract_type] || []
  const findings: ReviewFinding[] = baseFindingsList.map((f, idx) => ({
    ...f,
    id: idx + 1,
    review_id: draft.contract_id * 10,
    decision: "PENDING" as ClauseDecision,
    legal_comment: "",
  }))

  // Replace placeholders in fallback language
  const resolvedFindings = findings.map((f) => ({
    ...f,
    original_clause_text: f.original_clause_text
      .replace(/\{\{party_a\}\}/g, draft.party_a)
      .replace(/\{\{party_b\}\}/g, draft.party_b)
      .replace(/\{\{state\}\}/g, draft.state),
    approved_fallback_language: f.approved_fallback_language
      .replace(/\{\{party_a\}\}/g, draft.party_a)
      .replace(/\{\{party_b\}\}/g, draft.party_b)
      .replace(/\{\{state\}\}/g, draft.state),
  }))

  return {
    review_id: draft.contract_id * 10,
    contract_id: draft.contract_id,
    findings: resolvedFindings,
    created_at: new Date().toISOString(),
  }
}

// Review progress steps shown during agent execution
export const reviewProgressSteps = [
  { label: "Initializing Review Agent", detail: "Loading playbook rules and clause library..." },
  { label: "Analyzing Contract Structure", detail: "Validating section ordering against contract skeleton..." },
  { label: "Checking Section Compliance", detail: "Comparing each clause against approved playbook rules..." },
  { label: "Detecting Deviations", detail: "Identifying clauses that violate or deviate from policy..." },
  { label: "Retrieving Fallback Language", detail: "Fetching approved alternative clauses from the clause library..." },
  { label: "Assessing Risk Severity", detail: "Scoring each finding based on contract risk tier and jurisdiction..." },
  { label: "Generating Review Report", detail: "Compiling findings, citations, and suggestions..." },
]

// Current Legal User
export const currentUser: User = {
  id: 2,
  email: "sarah.chen@legalteam.com",
  role: "LU",
  name: "Sarah Chen",
  created_at: "2025-09-01T00:00:00Z",
}

// Mock drafts pending review by the legal user
export const draftsForReview: DraftForReview[] = [
  {
    draft_id: "DFT-001",
    contract_id: 101,
    contract_type: "NDA",
    state: "CA",
    risk_tier: "HIGH",
    status: "IN_REVIEW",
    review_status: "PENDING",
    submitted_by: "John Mitchell",
    submitted_at: "2026-02-28T14:30:00Z",
    version_no: 1,
    party_a: "Acme Corp",
    party_b: "TechVenture Inc",
  },
  {
    draft_id: "DFT-002",
    contract_id: 102,
    contract_type: "MSA",
    state: "NY",
    risk_tier: "MEDIUM",
    status: "IN_REVIEW",
    review_status: "PENDING",
    submitted_by: "Emily Rodriguez",
    submitted_at: "2026-02-27T09:15:00Z",
    version_no: 1,
    party_a: "Global Services Ltd",
    party_b: "CloudPeak Solutions",
  },
  {
    draft_id: "DFT-003",
    contract_id: 103,
    contract_type: "SOW",
    state: "DE",
    risk_tier: "LOW",
    status: "IN_REVIEW",
    review_status: "PENDING",
    submitted_by: "Michael Park",
    submitted_at: "2026-02-26T16:45:00Z",
    version_no: 2,
    party_a: "Nexus Digital",
    party_b: "DataFlow Analytics",
  },
  {
    draft_id: "DFT-004",
    contract_id: 104,
    contract_type: "NDA",
    state: "CA",
    risk_tier: "MEDIUM",
    status: "IN_REVIEW",
    review_status: "AWAITING_DECISION",
    submitted_by: "Lisa Thompson",
    submitted_at: "2026-02-25T11:00:00Z",
    version_no: 1,
    party_a: "Pinnacle Corp",
    party_b: "Stratosphere Labs",
  },
  {
    draft_id: "DFT-005",
    contract_id: 105,
    contract_type: "MSA",
    state: "NY",
    risk_tier: "HIGH",
    status: "IN_REVIEW",
    review_status: "PENDING",
    submitted_by: "David Kim",
    submitted_at: "2026-02-24T08:30:00Z",
    version_no: 1,
    party_a: "Quantum Enterprises",
    party_b: "Apex Solutions Group",
  },
  {
    draft_id: "DFT-006",
    contract_id: 106,
    contract_type: "SOW",
    state: "CA",
    risk_tier: "LOW",
    status: "CHANGES_REQUESTED",
    review_status: "COMPLETED",
    submitted_by: "Anna Williams",
    submitted_at: "2026-02-23T13:20:00Z",
    version_no: 3,
    party_a: "Horizon Tech",
    party_b: "BlueStar Consulting",
  },
  {
    draft_id: "DFT-007",
    contract_id: 107,
    contract_type: "NDA",
    state: "DE",
    risk_tier: "HIGH",
    status: "IN_REVIEW",
    review_status: "PENDING",
    submitted_by: "Robert Garcia",
    submitted_at: "2026-02-22T10:45:00Z",
    version_no: 1,
    party_a: "Vertex Industries",
    party_b: "NovaTech Partners",
  },
  {
    draft_id: "DFT-008",
    contract_id: 108,
    contract_type: "MSA",
    state: "CA",
    risk_tier: "MEDIUM",
    status: "APPROVED",
    review_status: "COMPLETED",
    submitted_by: "Jennifer Lee",
    submitted_at: "2026-02-21T15:00:00Z",
    version_no: 2,
    party_a: "Catalyst Group",
    party_b: "Evergreen Services",
  },
]
