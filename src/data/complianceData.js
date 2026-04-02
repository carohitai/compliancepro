// Compliance knowledge base — FY 2024-25 / AY 2025-26
// Sources: incometaxindia.gov.in · gst.gov.in · taxmann.in

export const ASSESSMENT_YEARS = [
  { value: "2026-27", label: "AY 2026-27 (FY 2025-26)" },
  { value: "2025-26", label: "AY 2025-26 (FY 2024-25)" },
  { value: "2024-25", label: "AY 2024-25 (FY 2023-24)" },
  { value: "2023-24", label: "AY 2023-24 (FY 2022-23)" },
];

// ─── TDS Limits ───────────────────────────────────────────────────────────────
export const TDS_SECTIONS = [
  { section: "192",  description: "Salary",                           rate: "As per slab",   threshold: "Basic exemption limit",      applicability: "All employers" },
  { section: "192A", description: "PF premature withdrawal",          rate: "10%",            threshold: "₹50,000",                   applicability: "All entities" },
  { section: "193",  description: "Interest on securities",           rate: "10%",            threshold: "₹10,000",                   applicability: "All entities" },
  { section: "194",  description: "Dividend",                         rate: "10%",            threshold: "₹5,000",                    applicability: "Companies" },
  { section: "194A", description: "Interest (other than securities)", rate: "10%",            threshold: "₹40,000 banks / ₹5,000 others (₹50,000 senior citizens)", applicability: "All entities" },
  { section: "194B", description: "Lottery / crossword winnings",     rate: "30%",            threshold: "₹10,000",                   applicability: "All entities" },
  { section: "194BB",description: "Horse racing winnings",            rate: "30%",            threshold: "₹10,000",                   applicability: "All entities" },
  { section: "194C", description: "Payment to contractors",           rate: "1% (individual/HUF) / 2% (others)", threshold: "₹30,000 single / ₹1,00,000 aggregate", applicability: "All entities (except individual/HUF below audit limit)" },
  { section: "194D", description: "Insurance commission",             rate: "5%",             threshold: "₹15,000",                   applicability: "Insurance companies" },
  { section: "194DA",description: "Life insurance maturity payout",   rate: "5% on profit",   threshold: "₹1,00,000",                 applicability: "Insurance companies" },
  { section: "194G", description: "Commission – lottery tickets",     rate: "5%",             threshold: "₹15,000",                   applicability: "All entities" },
  { section: "194H", description: "Commission / brokerage",           rate: "5%",             threshold: "₹15,000",                   applicability: "All entities (except individual/HUF below audit limit)" },
  { section: "194I", description: "Rent (land, building, furniture)", rate: "10% (land/building) / 2% (plant/machinery)", threshold: "₹2,40,000 p.a.", applicability: "All entities (except individual/HUF below audit limit)" },
  { section: "194IA",description: "Purchase of immovable property",   rate: "1%",             threshold: "₹50,00,000",                applicability: "All buyers" },
  { section: "194IB",description: "Rent by individual / HUF",         rate: "5%",             threshold: "₹50,000 per month",         applicability: "Individual / HUF (not subject to audit)" },
  { section: "194IC",description: "Joint development agreement",      rate: "10%",            threshold: "Any amount",                applicability: "Developers" },
  { section: "194J", description: "Professional / technical fees",    rate: "10% (professional) / 2% (technical)", threshold: "₹30,000",  applicability: "All entities (except individual/HUF below audit limit)" },
  { section: "194K", description: "Income from mutual fund units",    rate: "10%",            threshold: "₹5,000",                    applicability: "Mutual funds" },
  { section: "194M", description: "Contract / commission by individual", rate: "5%",          threshold: "₹50,00,000",                applicability: "Individual / HUF" },
  { section: "194N", description: "Cash withdrawal from bank",        rate: "2% (>₹1 Cr) / 5% (if no ITR filed, >₹20 lakh)", threshold: "₹1 Crore (₹20 lakh if no ITR)", applicability: "Banks / Post offices" },
  { section: "194O", description: "Payment to e-commerce participant", rate: "1%",            threshold: "₹5,00,000",                 applicability: "E-commerce operators" },
  { section: "194Q", description: "Purchase of goods",                rate: "0.1%",           threshold: "₹50,00,000",                applicability: "Buyer with turnover >₹10 Cr" },
  { section: "194R", description: "Benefit / perquisite to business", rate: "10%",            threshold: "₹20,000",                   applicability: "All entities" },
  { section: "194S", description: "VDA / Cryptocurrency transfer",    rate: "1%",             threshold: "₹50,000 (₹10,000 specified persons)", applicability: "All entities" },
  { section: "206C(1H)", description: "TCS on sale of goods",         rate: "0.1%",           threshold: "₹50,00,000",                applicability: "Seller with turnover >₹10 Cr" },
  { section: "206C(1G)", description: "TCS – overseas remittance (LRS)", rate: "20% (5% if for education/medical)", threshold: "₹7,00,000 p.a.", applicability: "Authorised dealers" },
];

// ─── Cash Transaction Limits ─────────────────────────────────────────────────
export const CASH_LIMITS = [
  { section: "269ST",  limit: "₹2,00,000", description: "Cash receipt from any person in single day", consequence: "100% penalty on amount received" },
  { section: "269SS",  limit: "₹20,000",   description: "Accept loan / deposit / advance in cash",    consequence: "100% penalty (Sec 271D)" },
  { section: "269T",   limit: "₹20,000",   description: "Repay loan / deposit / advance in cash",     consequence: "100% penalty (Sec 271E)" },
  { section: "40A(3)", limit: "₹10,000",   description: "Single cash payment for business expenses",  consequence: "Disallowed as business expenditure" },
  { section: "35AD",   limit: "₹10,000",   description: "Capital expenditure in cash",                consequence: "No deduction allowed" },
  { section: "43(1)",  limit: "₹10,000",   description: "Cash payment for asset purchase",           consequence: "No depreciation on excess amount" },
  { section: "80G",    limit: "₹2,000",    description: "Donation in cash",                          consequence: "No 80G deduction for excess" },
  { section: "194N",   limit: "₹1 Crore",  description: "Cash withdrawal from bank (per account)",    consequence: "TDS @ 2%; 5% if ITR not filed" },
];

// ─── Turnover Thresholds ──────────────────────────────────────────────────────
export const TURNOVER_LIMITS = [
  { threshold: "₹2,00,000",    provision: "Presumptive – Professional (44ADA)",     description: "Gross receipts limit for professionals opting 44ADA (w.e.f. FY 2023-24)", regime: "Income Tax" },
  { threshold: "₹20,00,000",   provision: "GST Registration – Services",             description: "Mandatory GST registration for service providers (₹10 lakh for NE/special category states)", regime: "GST" },
  { threshold: "₹40,00,000",   provision: "GST Registration – Goods",                description: "Mandatory GST registration for goods suppliers (₹20 lakh for NE states)", regime: "GST" },
  { threshold: "₹50,00,000",   provision: "Presumptive – Professional (44ADA)",      description: "Gross receipts limit for professionals (earlier ₹50L; increased to ₹75L if 95% digital)", regime: "Income Tax" },
  { threshold: "₹75,00,000",   provision: "Presumptive – Professional 95% digital",  description: "Extended limit under 44ADA if 95%+ receipts are through banking channels", regime: "Income Tax" },
  { threshold: "₹1,50,00,000", provision: "GST Composition / QRMP Scheme",           description: "Composition scheme eligibility; QRMP quarterly filing threshold for goods", regime: "GST" },
  { threshold: "₹2,00,00,000", provision: "Presumptive – Business (44AD)",            description: "Turnover limit for businesses opting for presumptive taxation under 44AD", regime: "Income Tax" },
  { threshold: "₹3,00,00,000", provision: "Presumptive – Business 95% digital (44AD)", description: "Extended limit under 44AD if 95%+ receipts are through banking channels", regime: "Income Tax" },
  { threshold: "₹5,00,00,000", provision: "GSTR-9 Mandatory Filing",                 description: "Annual return GSTR-9 mandatory for taxpayers with aggregate turnover > ₹5 Cr", regime: "GST" },
  { threshold: "₹10,00,00,000",provision: "Tax Audit – Business (Sec 44AB)",          description: "Mandatory tax audit if turnover exceeds ₹10 Cr (95% digital transactions)", regime: "Income Tax" },
  { threshold: "₹10,00,00,000",provision: "TCS / TDS on Goods (194Q / 206C-1H)",     description: "TDS on purchase / TCS on sale of goods applicable if turnover > ₹10 Cr", regime: "Income Tax" },
  { threshold: "₹1,00,00,000", provision: "Tax Audit – Business (Sec 44AB) – cash",  description: "Mandatory tax audit if cash transactions > 5% and turnover > ₹1 Cr", regime: "Income Tax" },
  { threshold: "₹1,00,00,000", provision: "Companies Act Statutory Audit",            description: "All companies (regardless of turnover) must get accounts audited under Companies Act", regime: "Companies Act" },
];

// ─── Key Due Dates ────────────────────────────────────────────────────────────
export const DUE_DATES = {
  "2026-27": [
    { date: "15 Jun 2026", event: "Advance Tax – Q1 instalment (15% of tax)", category: "Income Tax" },
    { date: "31 Jul 2026", event: "ITR Filing – Individuals, HUF, Firms (non-audit)", category: "Income Tax" },
    { date: "15 Sep 2026", event: "Advance Tax – Q2 instalment (45% cumulative)", category: "Income Tax" },
    { date: "30 Sep 2026", event: "Tax Audit Report (Form 3CA/3CB/3CD) submission", category: "Income Tax" },
    { date: "31 Oct 2026", event: "ITR Filing – Companies & audit cases", category: "Income Tax" },
    { date: "15 Dec 2026", event: "Advance Tax – Q3 instalment (75% cumulative)", category: "Income Tax" },
    { date: "31 Dec 2026", event: "ITR – Belated / Revised return deadline", category: "Income Tax" },
    { date: "15 Mar 2027", event: "Advance Tax – Q4 instalment (100%)", category: "Income Tax" },
    { date: "31 Mar 2027", event: "Updated return (ITR-U) – 2 yrs from AY", category: "Income Tax" },
    { date: "10th monthly", event: "GSTR-1 – Monthly filers (outward supplies)", category: "GST" },
    { date: "13th monthly", event: "GSTR-1 – QRMP quarterly filers (IFF)", category: "GST" },
    { date: "20th monthly", event: "GSTR-3B – Monthly filers (summary + payment)", category: "GST" },
    { date: "22nd/24th quarterly", event: "GSTR-3B – QRMP scheme quarterly filers", category: "GST" },
    { date: "31 Dec 2026", event: "GSTR-9 & GSTR-9C – Annual return FY 2025-26", category: "GST" },
    { date: "7th monthly",  event: "TDS / TCS deposit (non-March month)", category: "TDS" },
    { date: "30 Apr 2026",  event: "TDS deposit – March 2026 deductions", category: "TDS" },
    { date: "31 Jul 2026",  event: "TDS Return – Q1 (24Q / 26Q / 27Q)", category: "TDS" },
    { date: "31 Oct 2026",  event: "TDS Return – Q2", category: "TDS" },
    { date: "31 Jan 2027",  event: "TDS Return – Q3", category: "TDS" },
    { date: "31 May 2026",  event: "TDS Return – Q4 (FY 2025-26)", category: "TDS" },
    { date: "15 Jun 2026",  event: "Form 16 issue to employees (Q4 TDS cert)", category: "TDS" },
    { date: "15 Aug / Nov / Feb / Jun", event: "Form 16A – Non-salary TDS certificate", category: "TDS" },
    { date: "31 Oct 2026",  event: "ROC – Annual Filing (AOC-4 / MGT-7) for companies", category: "ROC" },
  ],
  "2025-26": [
    { date: "15 Jun 2025", event: "Advance Tax – Q1 instalment (15% of tax)", category: "Income Tax" },
    { date: "31 Jul 2025", event: "ITR Filing – Individuals, HUF, Firms (non-audit)", category: "Income Tax" },
    { date: "15 Sep 2025", event: "Advance Tax – Q2 instalment (45% cumulative)", category: "Income Tax" },
    { date: "30 Sep 2025", event: "Tax Audit Report (Form 3CA/3CB/3CD) submission", category: "Income Tax" },
    { date: "31 Oct 2025", event: "ITR Filing – Companies & audit cases", category: "Income Tax" },
    { date: "15 Dec 2025", event: "Advance Tax – Q3 instalment (75% cumulative)", category: "Income Tax" },
    { date: "31 Dec 2025", event: "ITR – Belated / Revised return deadline", category: "Income Tax" },
    { date: "15 Mar 2026", event: "Advance Tax – Q4 instalment (100%)", category: "Income Tax" },
    { date: "31 Mar 2026", event: "Updated return (ITR-U) – 2 yrs from AY", category: "Income Tax" },
    { date: "10th monthly", event: "GSTR-1 – Monthly filers (outward supplies)", category: "GST" },
    { date: "13th monthly", event: "GSTR-1 – QRMP quarterly filers (IFF)", category: "GST" },
    { date: "20th monthly", event: "GSTR-3B – Monthly filers (summary + payment)", category: "GST" },
    { date: "22nd/24th quarterly", event: "GSTR-3B – QRMP scheme quarterly filers", category: "GST" },
    { date: "31 Dec 2025", event: "GSTR-9 & GSTR-9C – Annual return FY 2024-25", category: "GST" },
    { date: "7th monthly",  event: "TDS / TCS deposit (non-March month)", category: "TDS" },
    { date: "30 Apr",       event: "TDS deposit – March deductions", category: "TDS" },
    { date: "31 Jul",       event: "TDS Return – Q1 (24Q / 26Q / 27Q)", category: "TDS" },
    { date: "31 Oct",       event: "TDS Return – Q2", category: "TDS" },
    { date: "31 Jan",       event: "TDS Return – Q3", category: "TDS" },
    { date: "31 May",       event: "TDS Return – Q4", category: "TDS" },
    { date: "15 Jun",       event: "Form 16 issue to employees (Q4 TDS cert)", category: "TDS" },
    { date: "15 Aug / Nov / Feb / Jun", event: "Form 16A – Non-salary TDS certificate", category: "TDS" },
    { date: "31 Oct",       event: "ROC – Annual Filing (AOC-4 / MGT-7) for companies", category: "ROC" },
  ],
};

// ─── Sector-specific Compliance ───────────────────────────────────────────────
export const SECTOR_COMPLIANCE = {
  manufacturing: {
    label: "Manufacturing",
    keyChanges: [
      "New tax regime mandatory for domestic companies – 22% + surcharge for existing co.; 15% for new manufacturing co.",
      "Section 43B(h) – MSME payments must be made within 15/45 days or deduction disallowed",
      "ITC reversal for exempt/non-business use (Rule 42/43) – monthly obligation",
      "E-invoicing mandatory if turnover > ₹5 Cr (from Aug 2023)",
      "GST Amnesty – waiver of interest & penalty for FY 2017-21 if paid by 31 Mar 2025",
    ],
    gstRate: "Varies 5%–28% by product; check GST Rate Schedule",
    auditTrigger: "Turnover > ₹1 Cr (or ₹10 Cr with 95% digital)",
    tdsHighlight: ["194C – Contractors", "194Q – Goods purchase >₹50L", "206C(1H) – Goods sale >₹50L"],
  },
  trading: {
    label: "Trading / Wholesale / Retail",
    keyChanges: [
      "QRMP scheme (quarterly filing with monthly payment) for turnover up to ₹5 Cr",
      "E-way bill required for goods movement > ₹50,000",
      "TDS 194Q on purchase of goods if buyer turnover > ₹10 Cr",
      "TCS 206C(1H) on sale of goods if seller turnover > ₹10 Cr",
      "Section 43B(h) – MSME vendor payment within 15/45 days",
      "Composition scheme available up to ₹1.5 Cr turnover (1% GST on goods)",
    ],
    gstRate: "5%/12%/18%/28% depending on commodity",
    auditTrigger: "Turnover > ₹1 Cr (cash) or ₹10 Cr (digital)",
    tdsHighlight: ["194C – Freight/transport", "194H – Commission", "194Q – Purchases"],
  },
  services: {
    label: "Service Sector",
    keyChanges: [
      "GST mandatory if turnover > ₹20 lakh (₹10 lakh in special category states)",
      "RCM applicable on certain specified services (GTA, legal, security etc.)",
      "Section 44ADA – Presumptive taxation @ 50% of gross receipts (up to ₹75L with 95% digital)",
      "New tax regime default from AY 2024-25 – lower rates but no exemptions",
      "TDS 194J – Technical/professional fees threshold ₹30,000",
    ],
    gstRate: "18% for most services; 12% for some; 5% for construction/works contract",
    auditTrigger: "Gross receipts > ₹50L (professionals) / ₹1 Cr (others)",
    tdsHighlight: ["194J – Professional fees", "194C – Sub-contractors", "192 – Salary"],
  },
  construction: {
    label: "Construction / Real Estate",
    keyChanges: [
      "GST on under-construction flats – 5% (no ITC) / 1% for affordable housing",
      "TDS 194IC on JDA payments mandatory",
      "TDS 194IA on property purchase > ₹50 lakh",
      "GST ITC not available on construction for own use (blocked credit)",
      "RERA compliance – project registration mandatory",
      "80-IBA deduction for affordable housing projects",
    ],
    gstRate: "5% (residential under-construction); 12% (commercial); 18% (works contract)",
    auditTrigger: "Turnover > ₹1 Cr",
    tdsHighlight: ["194C – Contractors", "194IA – Property sale", "194IC – JDA"],
  },
  it_software: {
    label: "IT / Software / Technology",
    keyChanges: [
      "Software exports – STPI/SEZ registration for tax holiday benefits",
      "Section 10AA – SEZ export income deduction (FY wise phased out)",
      "No GST on software exports (zero-rated supply)",
      "ESOP taxation – perquisite at exercise + capital gains on sale",
      "Angel Tax (Sec 56(2)(viib)) – FMV valuation of shares issued to investors",
      "TDS 194J @ 2% on technical services (not professional) from FY 2020-21",
    ],
    gstRate: "18% on IT services (software services, SaaS, etc.)",
    auditTrigger: "Turnover > ₹1 Cr (₹10 Cr digital)",
    tdsHighlight: ["194J – Tech services", "192 – Salary/ESOP", "194O – E-commerce"],
  },
  healthcare: {
    label: "Healthcare / Hospitals / Clinics",
    keyChanges: [
      "GST exempt on health care services by clinical establishments",
      "GST @ 5% on hospital rooms with tariff > ₹5,000/day (from July 2022)",
      "Medicines & surgical equipment at various GST rates (0%–12%)",
      "TDS 194J – Consulting doctors / specialists treated as professionals",
      "Section 80D – Health insurance premium deduction for patients",
      "Drug price control under NPPA – margin regulation",
    ],
    gstRate: "Nil on healthcare services; 12% on medicines; 5% on room rent >₹5000",
    auditTrigger: "Gross receipts > ₹50 lakh (individual doctor); ₹1 Cr (hospitals)",
    tdsHighlight: ["194J – Consultant doctors", "194C – Housekeeping/laundry", "192 – Salary"],
  },
  education: {
    label: "Education / Coaching / Schools",
    keyChanges: [
      "GST exempt on educational services by recognized institutions",
      "GST @ 18% on coaching services and online educational services",
      "Section 10(23C) – Exemption for educational trusts/institutions",
      "Section 80G – Donations to educational trusts (50% or 100% deduction)",
      "New Education Policy compliance for recognized institutions",
      "TDS 194C applicable on printing, transport, canteen contractors",
    ],
    gstRate: "Nil for recognized institutions; 18% for coaching/online education",
    auditTrigger: "Gross receipts > ₹1 Cr",
    tdsHighlight: ["194J – Faculty (if professional)", "194C – Contractors", "194I – Rent"],
  },
  hospitality: {
    label: "Hotels / Restaurants / Hospitality",
    keyChanges: [
      "GST on hotel rooms: Nil (<₹1,000/night); 12% (₹1,001–₹7,500); 18% (>₹7,500) from FY 2022",
      "Restaurant GST: 5% (no ITC) for regular; 18% for restaurants in 5-star hotels",
      "ITC blocked on food & beverages except as obligatory under law",
      "TDS 194I on rent for premises; 194C on laundry/catering contractors",
      "FSSAI compliance mandatory",
      "Tour operator GST: 5% on package tours",
    ],
    gstRate: "5%–18% based on room tariff / restaurant type",
    auditTrigger: "Turnover > ₹1 Cr",
    tdsHighlight: ["194C – Contractors", "194I – Rent", "194J – Entertainment"],
  },
  financial: {
    label: "Financial Services / NBFC",
    keyChanges: [
      "RBI circular on NPA recognition and provisioning norms",
      "Section 36(1)(viia) – Provision for bad debts for banks (not NBFCs)",
      "GST on financial services: 18% on interest (exempt for loans); 18% on fees",
      "TCS 206C(1G) on LRS remittances > ₹7 lakh @ 20% (5% for education/medical)",
      "Section 194A – TDS on interest payments above threshold",
      "PMLA compliance – KYC, suspicious transaction reporting",
    ],
    gstRate: "18% on processing fees / advisory; Nil on interest income",
    auditTrigger: "Turnover > ₹1 Cr (NBFCs all must have statutory audit)",
    tdsHighlight: ["194A – Interest", "194N – Cash withdrawal", "194C – Outsourcing"],
  },
};

// ─── Constitution-specific Compliance ────────────────────────────────────────
// Used when clientInfo.constitution is Individual / Salaried / HUF etc.
export const INDIVIDUAL_COMPLIANCE = {
  salaried: {
    label: "Individual – Salaried",
    keyCompliance: [
      "Submit investment declaration (Form 12BB) to HR at start of year — affects TDS deduction from salary",
      "Submit actual investment proofs to employer by Feb/Mar — prevents excess TDS or short deduction",
      "Report additional income (rent, interest, capital gains) to employer or pay advance tax directly",
      "File ITR-1 or ITR-2 based on income type — deadline 31 Jul (non-audit cases)",
      "Verify Form 26AS and AIS before filing to ensure all TDS credits are reflected",
      "Claim 80C deductions (LIC, PPF, ELSS, tuition fees, home loan principal) up to ₹1.5 lakh",
      "Claim 80D for health insurance premium — ₹25,000 (self/family) + ₹25,000 (parents)",
      "If switching jobs: collect Form 16 from all employers; disclose previous salary to new employer",
      "Maintain proofs for all deductions claimed for 6 years (in case of scrutiny)",
    ],
    tdsSections: [
      "§192 – TDS on salary (by employer as per slab)",
      "§194A – TDS on interest income > ₹40,000 (banks)",
      "§194IB – TDS on rent paid > ₹50,000/month (by individual)",
      "§194IA – TDS @ 1% on property purchase > ₹50 lakh",
      "§194M – TDS @ 5% on contractor/professional fees > ₹50 lakh (by individual)",
      "§194S – TDS @ 1% on crypto/VDA transfers > ₹50,000",
    ],
    deductions: [
      { section: "80C", description: "LIC, PPF, ELSS, tuition fees, home loan principal", limit: "₹1,50,000" },
      { section: "80CCD(1B)", description: "Additional NPS contribution", limit: "₹50,000" },
      { section: "80D", description: "Health insurance – self/family + parents", limit: "₹25,000 + ₹25,000" },
      { section: "80E", description: "Interest on education loan", limit: "No limit (8 years)" },
      { section: "80EEA", description: "Additional interest on affordable housing loan", limit: "₹1,50,000" },
      { section: "80G", description: "Donations to approved funds (cash max ₹2,000)", limit: "50%–100% of donation" },
      { section: "24(b)", description: "Home loan interest (self-occupied)", limit: "₹2,00,000" },
      { section: "10(13A)", description: "HRA exemption (if not opting new regime)", limit: "Least of: actual HRA / 50% salary (metro) / rent paid – 10% salary" },
    ],
  },
  individual_business: {
    label: "Individual – Business / Professional",
    keyCompliance: [
      "Presumptive taxation u/s 44AD available if turnover ≤ ₹3 Cr (95% digital) — declare 8%/6% as income",
      "Presumptive taxation u/s 44ADA for professionals if gross receipts ≤ ₹75 lakh — declare 50% as income",
      "If not opting presumptive: maintain books of accounts; get tax audit if turnover > ₹1 Cr (₹10 Cr digital)",
      "Advance tax mandatory if tax liability > ₹10,000 — pay in 4 instalments (Jun/Sep/Dec/Mar)",
      "File ITR-3 (business/profession income) — deadline 31 Jul (or 31 Oct if audit required)",
      "GST registration mandatory if turnover > ₹20 lakh (₹10 lakh for special category states)",
      "TDS deducted by payers on professional fees (§194J) — reconcile with Form 26AS",
      "Deduct TDS on contractor/professional payments if books are subject to audit",
    ],
    tdsSections: [
      "§194J – TDS on professional fees received (by payer @ 10%)",
      "§194C – TDS on contract receipts (by payer @ 1% individual)",
      "§194A – TDS on interest earned",
      "§194IB – TDS on rent paid > ₹50,000/month",
      "§194M – Deduct TDS on contractor/professional fees > ₹50 lakh",
    ],
    deductions: [
      { section: "80C", description: "LIC, PPF, ELSS, tuition fees, home loan principal", limit: "₹1,50,000" },
      { section: "80D", description: "Health insurance – self/family + parents", limit: "₹25,000 + ₹25,000" },
      { section: "Sec 30-37", description: "Business expenses (rent, salary, depreciation, etc.)", limit: "Actual (as per books)" },
      { section: "44AD/44ADA", description: "Presumptive income declaration", limit: "6%/8% of turnover or 50% of gross receipts" },
    ],
  },
  huf: {
    label: "Hindu Undivided Family (HUF)",
    keyCompliance: [
      "HUF is a separate taxable entity — file separate ITR (ITR-2 or ITR-3) for HUF income",
      "HUF can claim basic exemption limit (₹2.5 lakh old regime / ₹3 lakh new regime) separately",
      "HUF cannot claim 80C deductions for individual contributions — only HUF-level investments qualify",
      "Gifts received by HUF from members not taxable; from non-members taxable if > ₹50,000",
      "Partition of HUF has specific tax implications — consult CA before partial/total partition",
      "PAN for HUF is mandatory; separate bank account should be maintained for HUF transactions",
      "Karta (head) responsible for filing ITR and maintaining books on behalf of HUF",
    ],
    tdsSections: [
      "§192A – TDS on PF withdrawal",
      "§194A – TDS on interest income",
      "§194C – TDS @ 1% on contracts (individual/HUF rate)",
      "§194IB – TDS @ 5% on rent > ₹50,000/month",
      "§194M – TDS on contractor/professional fees > ₹50 lakh",
    ],
    deductions: [
      { section: "80C", description: "HUF-level investments (LIC, ELSS, NSC etc.)", limit: "₹1,50,000" },
      { section: "80D", description: "Health insurance for HUF members", limit: "₹25,000" },
      { section: "24(b)", description: "Home loan interest on HUF property", limit: "₹2,00,000" },
    ],
  },
};

// Detect if clientInfo is an individual / salaried / HUF constitution
export function getIndividualComplianceKey(clientInfo) {
  const constitution = (clientInfo?.constitution?.label || clientInfo?.constitution || "").toLowerCase();
  const nature = (clientInfo?.nature?.label || "").toLowerCase();
  if (constitution.includes("huf") || constitution.includes("hindu")) return "huf";
  if (
    constitution.includes("individual") ||
    constitution.includes("proprietor") ||
    nature.includes("salaried") ||
    nature.includes("individual")
  ) {
    const isBusiness = nature.includes("business") || nature.includes("professional") || nature.includes("freelan");
    return isBusiness ? "individual_business" : "salaried";
  }
  return null; // not individual — use sector-based compliance
}


export const KEY_AMENDMENTS = [
  {
    title: "New Tax Regime – Default Regime",
    description: "From AY 2024-25, new tax regime is the default. Old regime must be opted explicitly. Rebate u/s 87A increased to ₹25,000 (new regime) for income up to ₹7 lakh.",
    impact: "High",
    category: "Income Tax",
  },
  {
    title: "LTCG – STT Securities (Sec 112A)",
    description: "LTCG on listed equity/equity MF increased from 10% to 12.5% (w.e.f. 23 Jul 2024). Exemption limit raised from ₹1 lakh to ₹1.25 lakh.",
    impact: "High",
    category: "Income Tax",
  },
  {
    title: "STCG – STT Securities (Sec 111A)",
    description: "STCG on listed equity/equity MF increased from 15% to 20% (w.e.f. 23 Jul 2024).",
    impact: "High",
    category: "Income Tax",
  },
  {
    title: "Section 43B(h) – MSME Payment Disallowance",
    description: "Payments to micro/small enterprises must be made within 15 days (no agreement) or 45 days (with agreement). Delayed payments disallowed until actual payment.",
    impact: "High",
    category: "Income Tax",
  },
  {
    title: "Increased Standard Deduction",
    description: "Standard deduction for salaried employees increased from ₹50,000 to ₹75,000 under new tax regime from AY 2025-26.",
    impact: "Medium",
    category: "Income Tax",
  },
  {
    title: "NPS Employer Contribution Deduction",
    description: "Employer deduction for NPS contribution increased from 10% to 14% of salary under new tax regime.",
    impact: "Medium",
    category: "Income Tax",
  },
  {
    title: "GST Amnesty Scheme 2024",
    description: "Waiver of interest and penalty for demand notices for FY 2017-18 to 2019-20 if tax paid by 31 March 2025.",
    impact: "High",
    category: "GST",
  },
  {
    title: "Input Service Distributor (ISD) – Mandatory",
    description: "Businesses with multiple GSTINs receiving common services must mandatorily register as ISD from April 2025.",
    impact: "Medium",
    category: "GST",
  },
  {
    title: "GSTR-1A – Amendment Return",
    description: "New GSTR-1A facility to amend outward supplies before filing GSTR-3B, available from FY 2024-25.",
    impact: "Low",
    category: "GST",
  },
  {
    title: "TDS on Repurchase of Units – 194F Removed",
    description: "Section 194F (TDS on repurchase of mutual fund units) omitted from 1 Oct 2024 following removal of DDT.",
    impact: "Medium",
    category: "TDS",
  },
  {
    title: "TCS on LRS Remittance – 20%",
    description: "TCS on LRS remittances (other than education/medical) increased to 20% from 1 Oct 2023. Threshold ₹7 lakh.",
    impact: "High",
    category: "TDS",
  },
  {
    title: "Angel Tax Abolished",
    description: "Angel Tax under Sec 56(2)(viib) abolished from AY 2025-26 — startups receiving funds at premium no longer taxed.",
    impact: "High",
    category: "Income Tax",
  },
];
