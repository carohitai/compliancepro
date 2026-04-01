// New Income Tax Act 2025 (Income Tax Bill, 2025)
// Introduced in Parliament: 13 February 2025
// Replaces: Income Tax Act, 1961
// Effective: Proposed from FY 2026-27 (TY 2026-27)
// Sources: incometaxindia.gov.in · PRS Legislative Research · ICAI

// ─── Nomenclature Changes ─────────────────────────────────────────────────────
export const NOMENCLATURE_CHANGES = [
  { old: "Assessment Year (AY)",          newTerm: "Tax Year (TY)",                         note: "The separate AY concept is merged — tax is assessed for the same Tax Year in which income arises." },
  { old: "Previous Year (PY)",            newTerm: "Tax Year (TY)",                         note: "Income earned in Tax Year is taxed in the same Tax Year." },
  { old: "Assessee",                      newTerm: "Taxpayer / Person",                     note: "More inclusive terminology used throughout the new Act." },
  { old: "Gross Total Income",            newTerm: "Total Income (before deductions)",       note: "Simplified computation; chapter-based income aggregation." },
  { old: "Heads of Income (5 heads)",     newTerm: "Sources of Income (chapters)",          note: "Income categorised in thematic chapters instead of 5 rigid heads." },
  { old: "Assessment Order (143(3))",     newTerm: "Determination Order",                   note: "Faceless determination replaces physical assessment proceedings." },
  { old: "Intimation u/s 143(1)",         newTerm: "Processing Intimation",                 note: "Auto-processed returns with AI-based validation." },
  { old: "Schedule VI-A Deductions",      newTerm: "Chapter-based Deductions",              note: "Deductions reorganised into logical chapters." },
  { old: "Profits and Gains of Business or Profession", newTerm: "Business Income",        note: "Profession income merged into Business Income chapter." },
  { old: "Capital Gains",                 newTerm: "Capital Gains (retained)",              note: "Term retained but holding period and rate rules simplified." },
  { old: "Income from Other Sources",     newTerm: "Residuary Income",                      note: "Catch-all head renamed for clarity." },
  { old: "Advance Ruling",               newTerm: "Pre-determination Ruling",               note: "Faster ruling mechanism for taxpayers." },
  { old: "Proviso",                       newTerm: "Exception / Condition",                 note: "Legal provisos replaced with plain-language conditions." },
  { old: "Notwithstanding",              newTerm: "Regardless of",                          note: "Legal jargon replaced with plain English throughout." },
  { old: "Challan",                       newTerm: "Tax Payment Voucher",                   note: "Digital-first payment terminology." },
  { old: "TDS Certificate (Form 16/16A)", newTerm: "Tax Deduction Statement",              note: "Digital statement replacing physical certificates." },
];

// ─── Changes in Operations ───────────────────────────────────────────────────
export const OPERATIONAL_CHANGES = {
  all: [
    {
      title: "Faceless Everything",
      description: "All assessments, appeals, scrutiny and penalty proceedings to be conducted in faceless/digital mode. No physical appearance required unless specifically ordered by ITAT.",
      impact: "High",
    },
    {
      title: "Pre-filled Returns with AI Validation",
      description: "ITR forms pre-filled with data from TDS, GST, banking, MCA and stock exchange. AI flags mismatches before submission.",
      impact: "High",
    },
    {
      title: "Tax Year = Previous Year",
      description: "Income earned in Tax Year 2026-27 will be taxed in Tax Year 2026-27 itself — no separate Assessment Year. This simplifies all date-related computations.",
      impact: "High",
    },
    {
      title: "Updated Return Window Extended",
      description: "Updated return (ITR-U) filing window extended to 4 years from Tax Year end (vs current 2 years). Additional tax 25%→50%→60%→70% based on delay.",
      impact: "Medium",
    },
    {
      title: "Dispute Resolution",
      description: "Vivad se Vishwas-type permanent dispute resolution mechanism. Taxpayers can resolve pending disputes at reduced tax rates.",
      impact: "Medium",
    },
    {
      title: "Digital Notices & Communication",
      description: "All notices issued digitally on ITBA portal / registered email. Physical notices only as backup. Response window standardised.",
      impact: "Medium",
    },
  ],
  business: [
    {
      title: "Presumptive Taxation Expanded",
      description: "Section 44AD turnover limit increased. Digital payment-based higher presumptive rate extended to more categories of business.",
      impact: "High",
    },
    {
      title: "43B(h) MSME Payment – Strict Compliance",
      description: "Disallowance for late payment to MSME vendors continues and is more prominently codified. Books must track MSME vendor payment dates.",
      impact: "High",
    },
    {
      title: "Block Assessment for Search Cases",
      description: "Search-based assessment consolidated into one block proceeding covering up to 6 Tax Years. Reduces prolonged uncertainty.",
      impact: "Medium",
    },
    {
      title: "E-invoicing Fully Integrated",
      description: "E-invoice data flows directly into ITR pre-fill. Mismatches between GST turnover and IT return turnover flagged automatically.",
      impact: "High",
    },
    {
      title: "Depreciation Rules Simplified",
      description: "Asset blocks consolidated. Written Down Value chart simplified. Goodwill depreciation restricted. New asset class definitions.",
      impact: "Medium",
    },
  ],
  professional: [
    {
      title: "44ADA Limit Increased (Effective TY 2025-26)",
      description: "Presumptive limit for professionals increased to ₹75 lakh (if 95% digital receipts). Covers doctors, lawyers, CAs, engineers, architects.",
      impact: "High",
    },
    {
      title: "Professional + Business Income Merged Chapter",
      description: "Previously 'Profits and Gains of Business or Profession' — now professionals taxed under unified 'Business Income' chapter with same computation rules.",
      impact: "Medium",
    },
  ],
  salaried: [
    {
      title: "Standard Deduction ₹75,000 (New Regime Default)",
      description: "From TY 2025-26, standard deduction is ₹75,000 under new regime (was ₹50,000). Old regime standard deduction remains ₹50,000.",
      impact: "High",
    },
    {
      title: "Employer NPS Deduction – 14%",
      description: "Employer contribution to NPS deductible up to 14% of salary under new regime (was 10%). Benefit in hand of employee also exempt.",
      impact: "Medium",
    },
  ],
  capital_gains: [
    {
      title: "LTCG Rate – 12.5% on Listed Securities",
      description: "Long-term capital gains on listed equity / equity mutual funds: rate increased to 12.5% (from 10%) from 23 July 2024. Exemption: ₹1.25 lakh.",
      impact: "High",
    },
    {
      title: "STCG Rate – 20% on Listed Securities",
      description: "Short-term capital gains on listed equity / equity mutual funds: rate increased to 20% (from 15%) from 23 July 2024.",
      impact: "High",
    },
    {
      title: "Holding Period Simplified",
      description: "Holding period for LTCG unified: 24 months for immovable property (was 24/36); 12 months for listed securities; 24 months for unlisted securities.",
      impact: "Medium",
    },
    {
      title: "Indexation Removed for Property",
      description: "Indexation benefit on sale of property (purchased after 23 Jul 2024) removed. Flat 12.5% LTCG without indexation. Pre-Jul 2024 assets have transitional rules.",
      impact: "High",
    },
  ],
};

// ─── Rate Changes ─────────────────────────────────────────────────────────────
export const RATE_CHANGES = [
  {
    category: "Individual – New Tax Regime (Default)",
    slabs: [
      { income: "Up to ₹3,00,000",              rate: "Nil" },
      { income: "₹3,00,001 – ₹7,00,000",       rate: "5%" },
      { income: "₹7,00,001 – ₹10,00,000",      rate: "10%" },
      { income: "₹10,00,001 – ₹12,00,000",     rate: "15%" },
      { income: "₹12,00,001 – ₹15,00,000",     rate: "20%" },
      { income: "Above ₹15,00,000",             rate: "30%" },
    ],
    note: "Rebate u/s 87A: Tax nil for income up to ₹7 lakh. Effective tax-free income = ₹7,75,000 with standard deduction.",
    changed: false,
  },
  {
    category: "Individual – Old Tax Regime (Optional)",
    slabs: [
      { income: "Up to ₹2,50,000",              rate: "Nil" },
      { income: "₹2,50,001 – ₹5,00,000",       rate: "5%" },
      { income: "₹5,00,001 – ₹10,00,000",      rate: "20%" },
      { income: "Above ₹10,00,000",             rate: "30%" },
    ],
    note: "Must be opted explicitly each year. Available with all deductions (80C, 80D, HRA, etc.)",
    changed: false,
  },
  {
    category: "Domestic Companies",
    slabs: [
      { income: "Existing companies",           rate: "22% + surcharge + cess" },
      { income: "New manufacturing companies",  rate: "15% + surcharge + cess" },
      { income: "Other companies",              rate: "30% + surcharge + cess" },
    ],
    note: "No change in corporate tax rates under new Act.",
    changed: false,
  },
  {
    category: "Capital Gains – New Rates (from 23 Jul 2024)",
    slabs: [
      { income: "LTCG – Listed equity/MF (>₹1.25L)",  rate: "12.5% (was 10%)" },
      { income: "STCG – Listed equity/MF",             rate: "20% (was 15%)" },
      { income: "LTCG – Other assets",                 rate: "12.5% without indexation" },
      { income: "STCG – Other assets",                 rate: "As per slab" },
    ],
    note: "Capital gains rate changes effective from Budget 2024 (23 Jul 2024).",
    changed: true,
  },
  {
    category: "TDS Rates – Key Changes",
    slabs: [
      { income: "194DA – Life insurance maturity",     rate: "5% on profit (no change)" },
      { income: "194F – MF repurchase (removed)",      rate: "Removed from 1 Oct 2024" },
      { income: "206C(1G) – LRS remittance",           rate: "20% (>₹7L except edu/medical)" },
      { income: "194S – VDA/Crypto",                   rate: "1% (threshold ₹50,000)" },
    ],
    note: "Most TDS sections continue. Section numbers may be renumbered in new Act.",
    changed: true,
  },
];

// ─── What Does NOT Change ─────────────────────────────────────────────────────
export const WHAT_STAYS_SAME = [
  { point: "TDS / TCS Framework",              detail: "Tax deduction at source mechanism remains intact. Same rates, same obligations. Section numbers may change but principles do not." },
  { point: "GST is Separate",                  detail: "GST is governed by CGST / IGST Act. The new Income Tax Act has no impact on GST compliance, returns or rates." },
  { point: "Advance Tax Obligation",           detail: "Quarterly advance tax payment (Jun 15 / Sep 15 / Dec 15 / Mar 15) continues unchanged for all taxpayers." },
  { point: "PAN / Aadhaar Requirement",        detail: "PAN and Aadhaar linkage mandatory. Required for all tax transactions, bank accounts, property, investments." },
  { point: "Return Filing Obligation",         detail: "Mandatory return filing for prescribed income levels / transactions continues. ITR forms may be revised but obligation remains." },
  { point: "Fundamental Income Computation",   detail: "How income is computed — receipts minus allowable expenditure — remains the same. Only the language and structure changes." },
  { point: "Tax Audit under 44AB",            detail: "Statutory tax audit requirement remains. Thresholds may be revised but the CA certification requirement is maintained." },
  { point: "Books of Accounts Requirement",   detail: "Obligation to maintain proper books of accounts under Section 44AA continues for businesses/professionals above limits." },
  { point: "Penalties for Non-Compliance",    detail: "Penalty and prosecution provisions continue. Default in TDS, return filing, concealment of income all carry penal consequences." },
  { point: "Set-off & Carry Forward of Losses", detail: "Losses can still be set off and carried forward (generally 8 years for business losses; 4 years for speculative)." },
  { point: "Deductions (80C, 80D, etc.)",     detail: "All existing deductions continue under equivalent chapters of new Act. 80C (₹1.5L), 80D (health insurance), 80G (donations) etc. remain." },
  { point: "Capital Gains Computation",       detail: "Principles of computing capital gains (full value of consideration minus cost) unchanged. Indexation rules revised but principle stays." },
];

// ─── Business-nature specific highlights ─────────────────────────────────────
export const BUSINESS_SPECIFIC_HIGHLIGHTS = {
  manufacturer: {
    topChanges: ["E-invoicing auto-sync with IT return", "43B(h) MSME payment tracking essential", "Depreciation chart simplified — review asset blocks", "Presumptive not available (turnover likely >₹3 Cr)"],
    priority: "high",
  },
  trader_wholesale: {
    topChanges: ["E-invoicing/GST turnover must match IT return", "194Q TDS on purchases if turnover >₹10 Cr", "MSME vendor payments — 15/45 day rule", "Books of accounts mandatory"],
    priority: "high",
  },
  trader_retail: {
    topChanges: ["44AD presumptive limit: ₹2 Cr (₹3 Cr with 95% digital)", "New regime default — review deduction strategy", "Cash limit: ₹2L per day per person (269ST)"],
    priority: "medium",
  },
  professional: {
    topChanges: ["44ADA limit: ₹50L (₹75L with 95% digital)", "Faceless assessment — keep all digital records", "New standard deduction ₹75,000 under new regime"],
    priority: "high",
  },
  service_provider: {
    topChanges: ["GST + IT turnover reconciliation mandatory", "TDS 194J (professional) or 194C (technical) — know the difference", "New regime default saves tax for most"],
    priority: "medium",
  },
  contractor: {
    topChanges: ["194C TDS on all contract payments — ensure compliance", "43B(h) — get MSME status of sub-contractors", "WCT / GST on works contract — verify applicability"],
    priority: "high",
  },
  ecommerce: {
    topChanges: ["194O TDS at 1% by e-commerce operator", "GST on every supply — GSTR-1 reconciliation", "Digital turnover — 44AD 95% digital limit applies"],
    priority: "high",
  },
  real_estate_developer: {
    topChanges: ["Indexation removed on property sold after 23 Jul 2024", "Capital gains 12.5% without indexation vs. 20% with (transitional choice)", "TDS 194IA on property sale >₹50L", "Joint development — 194IC applies"],
    priority: "high",
  },
  default: {
    topChanges: ["New regime is default from TY 2025-26 — review deductions", "Faceless assessment — maintain digital records", "Tax Year replaces Assessment Year concept", "Updated return window: 4 years"],
    priority: "medium",
  },
};

export function getBusinessHighlights(natureValue) {
  return BUSINESS_SPECIFIC_HIGHLIGHTS[natureValue] || BUSINESS_SPECIFIC_HIGHLIGHTS.default;
}

// ─── TDS Section Renumbering (IT Act 1961 → IT Bill 2025) ────────────────────
// Source: Income Tax Bill, 2025 (introduced Lok Sabha, 13 Feb 2025)
// Chapter XIX — Deduction and Collection of Tax at Source (Cl. 379 onwards)
// Note: Proposed section numbers — subject to final enactment and gazette notification
export const TDS_SECTION_RENUMBERING = [
  { old: "192",   oldTitle: "TDS on Salary",                              newCl: "379",  rate: "Slab rate",   threshold: "Any amount",         industries: ["all"] },
  { old: "193",   oldTitle: "TDS on Interest on Securities",              newCl: "380",  rate: "10%",         threshold: "₹5,000",             industries: ["fintech", "ngo_trust"] },
  { old: "194",   oldTitle: "TDS on Dividends (Companies)",               newCl: "381",  rate: "10%",         threshold: "₹5,000",             industries: ["all"] },
  { old: "194A",  oldTitle: "TDS on Interest (Bank/Other)",               newCl: "382",  rate: "10%",         threshold: "₹50,000 (Sr.Cit) / ₹40,000 (others)", industries: ["all", "fintech"] },
  { old: "194B",  oldTitle: "TDS on Lottery / Game Winnings",             newCl: "383",  rate: "30%",         threshold: "₹10,000",            industries: ["hospitality"] },
  { old: "194C",  oldTitle: "TDS on Contractor / Sub-contractor",         newCl: "385",  rate: "1% / 2%",     threshold: "₹30,000 single / ₹1,00,000 aggregate", industries: ["manufacturer", "contractor", "infrastructure", "real_estate_developer", "trader_wholesale", "trader_retail", "trader_both", "service_provider", "it_software", "healthcare", "hospitality", "education"] },
  { old: "194D",  oldTitle: "TDS on Insurance Commission",                newCl: "386",  rate: "5%",          threshold: "₹15,000",            industries: ["insurance", "commission_agent", "fintech"] },
  { old: "194H",  oldTitle: "TDS on Commission / Brokerage",              newCl: "390",  rate: "5%",          threshold: "₹15,000",            industries: ["commission_agent", "trader_wholesale", "ecommerce", "fintech", "insurance"] },
  { old: "194I",  oldTitle: "TDS on Rent",                                newCl: "391",  rate: "2% / 10%",    threshold: "₹2,40,000 p.a.",     industries: ["all"] },
  { old: "194IA", oldTitle: "TDS on Purchase of Immovable Property",      newCl: "392",  rate: "1%",          threshold: "₹50,00,000",         industries: ["real_estate_developer", "infrastructure", "manufacturer", "trader_wholesale"] },
  { old: "194IB", oldTitle: "TDS on Rent (Individuals / HUF)",            newCl: "393",  rate: "5%",          threshold: "₹50,000/month",      industries: ["all"] },
  { old: "194IC", oldTitle: "TDS on Joint Development Agreement",         newCl: "394",  rate: "10%",         threshold: "Any amount",         industries: ["real_estate_developer", "infrastructure"] },
  { old: "194J",  oldTitle: "TDS on Professional / Technical Fees",       newCl: "395",  rate: "2% / 10%",    threshold: "₹30,000",            industries: ["all"] },
  { old: "194M",  oldTitle: "TDS on Payments by Individuals to Contractor/Prof.", newCl: "398", rate: "5%", threshold: "₹50,00,000 p.a.",   industries: ["all"] },
  { old: "194N",  oldTitle: "TDS on Cash Withdrawal",                     newCl: "399",  rate: "2% / 5%",     threshold: "₹1 Cr (₹20L if no ITR)", industries: ["all"] },
  { old: "194O",  oldTitle: "TDS on E-commerce Operators",                newCl: "400",  rate: "1%",          threshold: "₹5,00,000",          industries: ["ecommerce", "it_software", "trader_retail", "trader_both"] },
  { old: "194Q",  oldTitle: "TDS on Purchase of Goods",                   newCl: "402",  rate: "0.1%",        threshold: "₹50,00,000 p.a.",    industries: ["manufacturer", "trader_wholesale", "trader_both", "contractor", "infrastructure"] },
  { old: "194R",  oldTitle: "TDS on Benefits / Perquisites to Business",  newCl: "403",  rate: "10%",         threshold: "₹20,000 p.a.",       industries: ["manufacturer", "trader_wholesale", "service_provider", "it_software", "fintech"] },
  { old: "194S",  oldTitle: "TDS on Virtual Digital Assets (Crypto)",     newCl: "404",  rate: "1%",          threshold: "₹50,000 / ₹10,000",  industries: ["fintech", "it_software", "startup"] },
  { old: "195",   oldTitle: "TDS on Non-Resident Payments",               newCl: "406",  rate: "Rates in force", threshold: "Any amount",      industries: ["it_software", "service_provider", "manufacturer", "fintech", "exporter", "import_export"] },
  { old: "196D",  oldTitle: "TDS on Income of FII from Securities",       newCl: "412",  rate: "20%",         threshold: "Any amount",         industries: ["fintech"] },
];

// Returns TDS sections relevant to the given industry
export function getTdsSectionsByIndustry(natureValue) {
  if (!natureValue || natureValue === "default") {
    return TDS_SECTION_RENUMBERING.filter((s) => s.industries.includes("all"));
  }
  return TDS_SECTION_RENUMBERING.filter(
    (s) => s.industries.includes("all") || s.industries.includes(natureValue)
  );
}
