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
          "MOA & AOA with all amendments (for companies)",
          "Partnership deed / LLP Agreement (for firms / LLPs)",
          "Certificate of Incorporation / Registration certificate",
          "Board resolution / authority letter for borrowing",
          "List of directors / partners / shareholders with addresses",
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
      {
        title: "Loan Type Specific",
        items: [
          "Term Loan – capital expenditure details, payback schedule",
          "Working Capital – debtors / creditors / stock ageing",
          "Home Loan – property documents, builder NOC, approved plan",
          "LAP – property documents, current tenancy / rental income",
          "Business Loan – CIBIL report, ITR, GST returns",
          "Mudra / MSME Loan – Udyam certificate, business proof",
          "Education Loan – admission letter, fee structure, collateral",
          "Vehicle Loan – quotation, driving licence, insurance",
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
