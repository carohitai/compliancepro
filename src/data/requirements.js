// Constitution types
export const CONSTITUTIONS = [
  "Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "Hindu Undivided Family (HUF)",
  "Trust",
  "Society",
  "Association of Persons (AOP)",
  "Body of Individuals (BOI)",
];

// Registration types
export const REGISTRATION_TYPES = [
  { key: "pan", label: "PAN", placeholder: "ABCDE1234F" },
  { key: "tan", label: "TAN", placeholder: "ABCD12345E" },
  { key: "gst", label: "GST", placeholder: "29ABCDE1234F1Z5" },
  { key: "cin", label: "CIN / LLPIN", placeholder: "U12345MH2020PTC123456" },
  { key: "udyam", label: "Udyam Registration", placeholder: "UDYAM-XX-00-0000000" },
  { key: "iec", label: "Import Export Code (IEC)", placeholder: "AABCE1234D" },
  { key: "esic", label: "ESIC", placeholder: "ESIC number" },
  { key: "pf", label: "Provident Fund (PF)", placeholder: "PF number" },
  { key: "pt", label: "Professional Tax (PT)", placeholder: "PT number" },
  { key: "fssai", label: "FSSAI", placeholder: "FSSAI License No." },
  { key: "shop_act", label: "Shop & Establishment", placeholder: "Registration No." },
];

// Assignment types
export const ASSIGNMENTS = [
  { id: "itr", label: "Income Tax – Return Filing", icon: "📄" },
  { id: "tds", label: "TDS", icon: "💰" },
  { id: "accounting", label: "Accounting", icon: "📒" },
  { id: "it_audit", label: "Income Tax Audit", icon: "🔍" },
  { id: "gst", label: "GST", icon: "🏷️" },
  { id: "gst_audit", label: "GST Audit", icon: "📋" },
  { id: "project_finance", label: "Project Finance", icon: "🏗️" },
];

// ─── Requirement definitions ──────────────────────────────────────────────────

const ITR_REQUIREMENTS = {
  itr: {
    label: "Income Tax – Return Filing",
    sections: [
      {
        title: "Identity & Basic Documents",
        items: [
          "PAN Card copy",
          "Aadhaar Card copy",
          "Previous year Income Tax Return (ITR) with acknowledgement",
          "Form 26AS (Annual Tax Statement) / AIS / TIS",
        ],
      },
      {
        title: "Income Details",
        items: [
          "Form 16 / Form 16A (from all employers / deductors)",
          "Salary slips (if applicable)",
          "Bank account details – IFSC, Account No. (all accounts)",
          "Bank statements (all accounts – full financial year)",
          "Rental income details with tenant name and address (if applicable)",
          "Capital gains statements – equity, mutual funds, property (if applicable)",
          "Business / professional income – P&L and Balance Sheet (if applicable)",
          "Agriculture income details (if applicable)",
          "Other income – interest, dividends, winnings, etc.",
        ],
      },
      {
        title: "Deductions & Investments",
        items: [
          "LIC / ULIP premium receipts (80C)",
          "PPF contribution statement (80C)",
          "ELSS / Mutual fund investment proof (80C)",
          "School / tuition fees receipts (80C)",
          "Home loan principal repayment certificate (80C)",
          "Housing loan interest certificate (Section 24)",
          "Mediclaim / Health insurance premium receipts (80D)",
          "Donations receipts with 80G certification",
          "NPS contribution proof (80CCD)",
          "Education loan interest certificate (80E)",
          "Disability / medical treatment certificates (80DD / 80DDB / 80U)",
          "Advance tax / self-assessment tax challans (if paid)",
        ],
      },
      {
        title: "Foreign Assets / Income (if applicable)",
        items: [
          "Details of foreign bank accounts",
          "Foreign assets / investments details",
          "Foreign income details with tax paid abroad",
        ],
      },
    ],
  },
};

const TDS_REQUIREMENTS = {
  tds: {
    label: "TDS",
    sections: [
      {
        title: "Registration & Setup",
        items: [
          "TAN (Tax Deduction Account Number) certificate",
          "List of deductees (employees / contractors / vendors) with PAN",
          "Nature of payments (salary, professional fees, contract, rent, etc.)",
        ],
      },
      {
        title: "Deduction & Payment Details",
        items: [
          "Monthly payroll statement / salary register",
          "Payment details to contractors / professionals / vendors",
          "TDS payment challans (ITNS 281) for all quarters",
          "Bank statements showing TDS remittance",
        ],
      },
      {
        title: "Return Filing Documents",
        items: [
          "Form 24Q data (salary TDS) – quarterly",
          "Form 26Q data (non-salary TDS) – quarterly",
          "Form 27Q data (non-residents TDS) – if applicable",
          "Previous TDS return acknowledgements (27A)",
          "Correction / rectification statements (if any)",
        ],
      },
      {
        title: "Certificate Issuance",
        items: [
          "Form 16 issuance data for all employees",
          "Form 16A issuance data for all deductees",
          "Lower deduction certificate details (Form 13) – if applicable",
        ],
      },
    ],
  },
};

const ACCOUNTING_REQUIREMENTS = {
  accounting: {
    label: "Accounting",
    sections: [
      {
        title: "Opening Balances",
        items: [
          "Previous year audited / finalized Balance Sheet and P&L",
          "Opening trial balance / ledger balances",
          "Fixed asset register with depreciation schedule",
          "Previous year's books of accounts (Tally / Excel / other software)",
        ],
      },
      {
        title: "Income & Revenue",
        items: [
          "Sales invoices / bills (all months)",
          "GST-wise sales summary (B2B, B2C, exports)",
          "Service income / professional receipts",
          "Other income documents",
        ],
      },
      {
        title: "Expenses & Purchases",
        items: [
          "Purchase invoices / bills (all months)",
          "Expense vouchers / petty cash records",
          "Salary and wage registers",
          "Rent agreements and payment receipts",
          "Utility bills (electricity, telephone, internet)",
          "Insurance premium receipts",
        ],
      },
      {
        title: "Banking & Finance",
        items: [
          "Bank statements for all accounts (full year)",
          "Bank reconciliation statements",
          "Loan account statements (all loans)",
          "Credit card statements (if business use)",
          "Cash book / cash register",
        ],
      },
      {
        title: "Assets & Liabilities",
        items: [
          "Asset purchase / disposal documents",
          "Creditor and debtor ledger / outstanding lists",
          "Advances paid / received details",
          "Stock / inventory register (if applicable)",
          "Security deposits paid / received",
        ],
      },
    ],
  },
};

const IT_AUDIT_REQUIREMENTS = {
  it_audit: {
    label: "Income Tax Audit (Sec. 44AB)",
    sections: [
      {
        title: "Books of Accounts",
        items: [
          "Audited / finalized Balance Sheet and Profit & Loss Account",
          "Trial balance as on 31st March",
          "Journal, ledger, cash book, bank book",
          "Fixed asset register with depreciation (as per Companies Act & Income Tax Act)",
          "Stock / inventory register with closing stock valuation method",
        ],
      },
      {
        title: "Turnover & Income",
        items: [
          "Complete sales / turnover register with month-wise summary",
          "Gross receipt details for professionals",
          "Other business income details",
          "Speculative / derivative trading P&L (if applicable)",
        ],
      },
      {
        title: "Tax & Compliance",
        items: [
          "Previous year Form 3CA / 3CB / 3CD (Tax Audit Report)",
          "TDS deducted and deposited details (Form 26AS / AIS)",
          "TDS / TCS compliance details",
          "Advance tax and self-assessment tax challans",
          "Details of expenses disallowable under IT Act (Sec. 40, 40A, 43B)",
          "Payments above Rs. 20,000 in cash details",
        ],
      },
      {
        title: "Loans & Transactions",
        items: [
          "Loans accepted / repaid (mode of acceptance/payment)",
          "Related party transaction details",
          "Specified domestic transactions (if applicable – Sec. 92BA)",
          "International transactions (if applicable – TP documentation)",
        ],
      },
      {
        title: "Audit Specific",
        items: [
          "Prior year observations / audit qualifications",
          "Changes in accounting policies during the year",
          "Details of brought forward losses / unabsorbed depreciation",
          "MAT computation details (for companies)",
          "ICDS adjustments (Income Computation & Disclosure Standards)",
        ],
      },
    ],
  },
};

const GST_REQUIREMENTS = {
  gst: {
    label: "GST",
    sections: [
      {
        title: "Registration & Setup",
        items: [
          "GST Registration Certificate (GSTIN)",
          "HSN / SAC code list for goods and services supplied",
          "Business activity and category of registration (Regular / Composition)",
        ],
      },
      {
        title: "Outward Supplies (Sales)",
        items: [
          "Sales invoices (month-wise) with GSTIN of buyers",
          "Credit notes / debit notes issued",
          "Export invoices with shipping bill / bill of export (if applicable)",
          "E-way bills generated",
          "Advance receipt details for services",
        ],
      },
      {
        title: "Inward Supplies (Purchases & Input Tax Credit)",
        items: [
          "Purchase invoices with supplier GSTIN",
          "Import documents / bill of entry (if applicable)",
          "ITC reversal details (Rule 42 / 43 – exempt / non-business use)",
          "GSTR-2B reconciliation workings",
          "RCM (Reverse Charge Mechanism) liability details",
        ],
      },
      {
        title: "Returns & Payments",
        items: [
          "GSTR-1 data (outward supplies) – monthly / quarterly",
          "GSTR-3B data (summary return) – monthly / quarterly",
          "GST payment challans (PMT-06 / Electronic Cash Ledger)",
          "Previous period GSTR filings and acknowledgements",
          "Pending liability / demand notice details (if any)",
        ],
      },
      {
        title: "Special Transactions (if applicable)",
        items: [
          "Composition scheme turnover details",
          "SEZ supply details",
          "Deemed export details",
          "E-commerce operator supplies (GSTR-8 if applicable)",
          "TDS / TCS under GST details",
        ],
      },
    ],
  },
};

const GST_AUDIT_REQUIREMENTS = {
  gst_audit: {
    label: "GST Audit (Annual Return GSTR-9 / 9C)",
    sections: [
      {
        title: "Annual Return Filing (GSTR-9)",
        items: [
          "Month-wise GSTR-1 and GSTR-3B filed during the year",
          "Books of accounts – sales register, purchase register",
          "HSN-wise summary of outward and inward supplies",
          "ITC claimed during the year (GSTR-2B vs Books reconciliation)",
          "ITC reversed / reclaimed details",
          "Tax paid details (IGST, CGST, SGST, Cess)",
          "Demands / refunds during the year",
        ],
      },
      {
        title: "Reconciliation Statement (GSTR-9C)",
        items: [
          "Audited financial statements (P&L and Balance Sheet)",
          "Turnover as per books vs. GST returns reconciliation",
          "ITC as per books vs. GSTR-2B reconciliation",
          "Tax payable reconciliation – books vs. returns",
          "Reasons for differences / adjustments",
          "Previous year GSTR-9C filed (if applicable)",
        ],
      },
      {
        title: "Supporting Documents",
        items: [
          "All GST payment challans for the year",
          "Pending/unpaid liability details",
          "Refund applications and orders (if applicable)",
          "GST audit / assessment orders (if any)",
          "e-Way bill summary for the year",
        ],
      },
    ],
  },
};

// Constitution types that require entity-level KYC (MOA, AOA, incorporation etc.)
export const ENTITY_CONSTITUTION_TYPES = [
  "Private Limited Company",
  "Public Limited Company",
  "Limited Liability Partnership (LLP)",
  "Trust",
  "Society",
];

// Base KYC items applicable to ALL constitutions
const KYC_BASE_ITEMS = [
  "PAN Card of entity and all promoters / partners / directors",
  "Aadhaar Card of all promoters / partners / directors",
  "Passport / Voter ID of promoters (as applicable)",
  "Latest utility bill / rent agreement as address proof",
];

// Additional KYC items only for companies, LLPs, trusts, societies
const KYC_ENTITY_ITEMS = [
  "MOA & AOA with all amendments",
  "Certificate of Incorporation / Registration certificate",
  "Board resolution / authority letter for borrowing",
  "List of directors / partners / shareholders with addresses",
  "KYC of all promoters / directors / partners (individual KYC)",
];

// Loan-type-specific document sections
export const LOAN_SPECIFIC_SECTIONS = {
  home_loan: {
    title: "Home Loan — Specific Documents",
    items: [
      "Approved building plan / layout plan (from municipal authority)",
      "Housing Sanction Plan from concerned authority",
      "Building permissions / commencement certificate",
      "Sale agreement / allotment letter from builder",
      "Title deed / property card / 7-12 extract",
      "Encumbrance certificate (EC) for last 13 years",
      "NOC from builder / housing society",
      "Occupancy / completion certificate (for ready properties)",
      "Chain of title documents (all previous sale deeds)",
      "Property tax paid receipts",
      "RERA registration of project (if applicable)",
    ],
  },
  lap: {
    title: "LAP (Loan Against Property) — Specific Documents",
    items: [
      "Title deed / sale deed of property offered as collateral",
      "Property valuation report from bank-approved valuer",
      "Encumbrance certificate (EC) for last 13 years",
      "Search report / legal opinion on property",
      "Current tenancy agreement / rental income proof (if rented)",
      "Latest property tax paid receipts",
      "Insurance on the mortgaged property",
      "NOC from existing mortgage holders (if any)",
    ],
  },
  business_loan: {
    title: "Business Loan — Specific Documents",
    items: [
      "CIBIL report / credit score (entity and promoters)",
      "ITR with computation – last 3 years",
      "GST returns (GSTR-1, GSTR-3B) – last 12 months",
      "Bank statements – primary operative account – last 12 months",
      "Business proof / vintage certificate",
      "Trade licence / shop establishment certificate",
      "Stock / debtor statements (if working capital component)",
    ],
  },
  working_capital: {
    title: "Working Capital — Specific Documents",
    items: [
      "Debtors ageing statement (as of date)",
      "Creditors ageing statement (as of date)",
      "Stock statement with valuation (as of date)",
      "GSTR-1 / GSTR-3B – last 12 months",
      "Bank statements – all CC / OD accounts – last 12 months",
      "Sanction letters of existing working capital facilities",
      "Drawing power calculation statement",
    ],
  },
  term_loan: {
    title: "Term Loan — Specific Documents",
    items: [
      "Capital expenditure details and purpose",
      "Quotations / estimates for assets / machinery",
      "Proposed repayment schedule",
      "Technical report / feasibility study (if applicable)",
      "Bank statements – last 12 months",
      "Existing term loan statements (if any)",
    ],
  },
  personal_loan: {
    title: "Personal Loan — Specific Documents",
    items: [
      "Salary slips – last 3 months (for salaried)",
      "Form 16 / ITR – last 2 years",
      "Bank statements – salary account – last 6 months",
      "Employment offer letter / appointment letter",
      "CIBIL score / credit report",
    ],
  },
  vehicle_loan: {
    title: "Vehicle Loan — Specific Documents",
    items: [
      "Proforma invoice / quotation from dealer",
      "Driving licence copy",
      "Vehicle insurance proposal",
      "RC book (for used vehicle loan)",
      "NOC from previous financer (for used vehicle)",
    ],
  },
  education_loan: {
    title: "Education Loan — Specific Documents",
    items: [
      "Admission letter / offer letter from institution",
      "Fee structure / course details",
      "Academic records (marksheets, certificates)",
      "Collateral documents (property / FD) if loan > ₹7.5 lakh",
      "Co-borrower (parent / guardian) income proof",
    ],
  },
  mudra: {
    title: "Mudra / MSME Loan — Specific Documents",
    items: [
      "Udyam Registration Certificate",
      "Business proof / vintage certificate",
      "GST registration certificate",
      "Bank statements – last 6 months",
      "Quotations for machinery / equipment (for Kishor / Tarun)",
    ],
  },
  msme: {
    title: "MSME Loan — Specific Documents",
    items: [
      "Udyam Registration Certificate",
      "MSME / SSI registration (if applicable)",
      "GST returns – last 12 months",
      "Bank statements – last 12 months",
      "Project report / business plan",
    ],
  },
};

// Build constitution-aware KYC section
export function getKycSection(constitution) {
  const isEntity = constitution && ENTITY_CONSTITUTION_TYPES.some(
    (t) => constitution.toLowerCase().includes(t.toLowerCase().split(" ")[0])
  );
  return {
    title: "KYC & Identity Documents",
    items: isEntity
      ? [...KYC_BASE_ITEMS, ...KYC_ENTITY_ITEMS]
      : KYC_BASE_ITEMS,
  };
}

const PROJECT_FINANCE_REQUIREMENTS = {
  project_finance: {
    label: "Project Finance",
    sections: [
      {
        title: "KYC & Entity Documents",
        items: [
          "PAN Card of entity and promoters / directors / partners",
          "Aadhaar Card of all promoters / directors / partners",
          "Passport / Voter ID of promoters (as applicable)",
          "MOA & AOA with all amendments (for companies / LLPs only)",
          "Partnership deed / LLP Agreement (for firms / LLPs only)",
          "Certificate of Incorporation / Registration certificate (for companies / LLPs / trusts only)",
          "Board resolution / authority letter for borrowing (for companies / LLPs only)",
          "List of directors / partners / shareholders with addresses (for companies / LLPs only)",
        ],
      },
      {
        title: "Financial Statements",
        items: [
          "Audited Balance Sheet and P&L – last 2-3 years",
          "Income Tax Returns (ITR) with computation – last 3 years",
          "Bank statements – all accounts – last 12-24 months",
          "Provisional Balance Sheet and P&L (for current year)",
          "CA-certified net worth statement of promoters",
          "Existing loan account statements (all loans – last 12 months)",
          "Repayment track record / credit facility details",
        ],
      },
      {
        title: "Project Details",
        items: [
          "Detailed project report (DPR)",
          "Financial projections / cash flow statements (5-7 years)",
          "Cost of project and means of finance",
          "Quotations / estimates for capital expenditure",
          "Technical feasibility report (if applicable)",
          "Market feasibility / demand analysis",
          "Environmental clearance / NOC (if required)",
        ],
      },
      {
        title: "Property & Security Documents",
        items: [
          "Property documents (title deed / sale deed) – for mortgage",
          "Property valuation report from approved valuer",
          "Encumbrance certificate",
          "Search report / legal opinion on property",
          "Insurance policies on assets / property",
          "Existing charge / mortgage details (if any)",
        ],
      },
      {
        title: "Business Specific (as applicable)",
        items: [
          "Sanctions / licenses / permits for business",
          "Work orders / purchase orders in hand",
          "Existing contracts / agreements",
          "Machinery / equipment list with specifications",
          "Supplier / vendor details with quotations",
          "Export orders (for export finance)",
          "Stock statements (for working capital limits)",
        ],
      },
    ],
  },
};

export const ALL_REQUIREMENTS = {
  ...ITR_REQUIREMENTS,
  ...TDS_REQUIREMENTS,
  ...ACCOUNTING_REQUIREMENTS,
  ...IT_AUDIT_REQUIREMENTS,
  ...GST_REQUIREMENTS,
  ...GST_AUDIT_REQUIREMENTS,
  ...PROJECT_FINANCE_REQUIREMENTS,
};
