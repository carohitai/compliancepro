// Business Activity Codes (BAC) based on NIC / ITR Schedule
// Grouped by major sector for searchable dropdown

export const BAC_SECTORS = [
  {
    group: "Agriculture, Forestry & Fishing",
    options: [
      { value: "01100", label: "01100 – Growing of cereals & other crops" },
      { value: "01200", label: "01200 – Growing of vegetables, fruits & nuts" },
      { value: "01400", label: "01400 – Animal husbandry & dairying" },
      { value: "01500", label: "01500 – Mixed farming" },
      { value: "02000", label: "02000 – Forestry & logging" },
      { value: "03000", label: "03000 – Fishing & aquaculture" },
    ],
  },
  {
    group: "Manufacturing – Food & Beverages",
    options: [
      { value: "10010", label: "10010 – Processing & preserving of meat" },
      { value: "10020", label: "10020 – Processing of fish & seafood" },
      { value: "10030", label: "10030 – Fruit & vegetable processing" },
      { value: "10040", label: "10040 – Manufacture of vegetable oils & fats" },
      { value: "10050", label: "10050 – Dairy products" },
      { value: "10060", label: "10060 – Grain mill products, starches" },
      { value: "10070", label: "10070 – Bakery & confectionery products" },
      { value: "10080", label: "10080 – Sugar manufacturing" },
      { value: "11000", label: "11000 – Manufacture of beverages" },
      { value: "12000", label: "12000 – Manufacture of tobacco products" },
    ],
  },
  {
    group: "Manufacturing – Textiles & Apparel",
    options: [
      { value: "13000", label: "13000 – Manufacture of textiles" },
      { value: "14000", label: "14000 – Manufacture of wearing apparel" },
      { value: "15000", label: "15000 – Manufacture of leather & footwear" },
    ],
  },
  {
    group: "Manufacturing – Wood, Paper & Printing",
    options: [
      { value: "16000", label: "16000 – Manufacture of wood products" },
      { value: "17000", label: "17000 – Manufacture of paper & paper products" },
      { value: "18000", label: "18000 – Printing & reproduction of media" },
    ],
  },
  {
    group: "Manufacturing – Chemicals & Pharma",
    options: [
      { value: "19000", label: "19000 – Coke & refined petroleum products" },
      { value: "20000", label: "20000 – Manufacture of chemicals & chemical products" },
      { value: "21000", label: "21000 – Manufacture of pharmaceuticals" },
      { value: "22000", label: "22000 – Manufacture of rubber & plastics" },
    ],
  },
  {
    group: "Manufacturing – Metals & Machinery",
    options: [
      { value: "24000", label: "24000 – Manufacture of basic metals" },
      { value: "25000", label: "25000 – Manufacture of fabricated metal products" },
      { value: "26000", label: "26000 – Manufacture of computer & electronic products" },
      { value: "27000", label: "27000 – Manufacture of electrical equipment" },
      { value: "28000", label: "28000 – Manufacture of machinery & equipment" },
      { value: "29000", label: "29000 – Manufacture of motor vehicles" },
      { value: "30000", label: "30000 – Manufacture of other transport equipment" },
    ],
  },
  {
    group: "Construction & Real Estate",
    options: [
      { value: "41000", label: "41000 – Construction of buildings" },
      { value: "42000", label: "42000 – Civil engineering / infrastructure" },
      { value: "43000", label: "43000 – Specialised construction activities" },
      { value: "68100", label: "68100 – Real estate activities with own property" },
      { value: "68200", label: "68200 – Real estate activities on a fee / contract basis" },
    ],
  },
  {
    group: "Wholesale & Retail Trade",
    options: [
      { value: "45000", label: "45000 – Wholesale & retail trade of motor vehicles" },
      { value: "46000", label: "46000 – Wholesale trade (except motor vehicles)" },
      { value: "47110", label: "47110 – Retail trade in non-specialised stores (supermarkets)" },
      { value: "47300", label: "47300 – Retail sale of fuel" },
      { value: "47410", label: "47410 – Retail sale of computers & electronics" },
      { value: "47710", label: "47710 – Retail sale of clothing" },
      { value: "47810", label: "47810 – Retail sale via stalls & markets – food" },
      { value: "47910", label: "47910 – Retail sale via internet / e-commerce" },
    ],
  },
  {
    group: "Transportation & Storage",
    options: [
      { value: "49100", label: "49100 – Railway passenger transport" },
      { value: "49200", label: "49200 – Freight transport by road / truck" },
      { value: "49400", label: "49400 – Pipeline transport" },
      { value: "50000", label: "50000 – Water transport" },
      { value: "51000", label: "51000 – Air transport" },
      { value: "52000", label: "52000 – Warehousing & storage" },
      { value: "53000", label: "53000 – Postal & courier activities" },
    ],
  },
  {
    group: "Hospitality – Hotels & Restaurants",
    options: [
      { value: "55100", label: "55100 – Hotels & similar accommodation" },
      { value: "55200", label: "55200 – Holiday camps, guesthouses, dharamshalas" },
      { value: "56100", label: "56100 – Restaurants & mobile food services" },
      { value: "56200", label: "56200 – Event catering & food service activities" },
      { value: "56300", label: "56300 – Bar & beverage serving activities" },
    ],
  },
  {
    group: "Information & Communication / IT",
    options: [
      { value: "58000", label: "58000 – Publishing activities" },
      { value: "59000", label: "59000 – Motion picture, video & TV production" },
      { value: "60000", label: "60000 – Broadcasting activities" },
      { value: "61000", label: "61000 – Telecommunications" },
      { value: "62010", label: "62010 – Software development & programming" },
      { value: "62020", label: "62020 – IT consulting & computer facilities management" },
      { value: "62090", label: "62090 – Other IT / technology services" },
      { value: "63000", label: "63000 – Data processing, hosting & portals" },
    ],
  },
  {
    group: "Financial Services & Insurance",
    options: [
      { value: "64100", label: "64100 – Monetary intermediation (banking)" },
      { value: "64200", label: "64200 – Activities of holding companies" },
      { value: "64300", label: "64300 – Trusts, funds & similar financial entities" },
      { value: "64910", label: "64910 – Financial leasing" },
      { value: "64920", label: "64920 – Money lending / microfinance" },
      { value: "64990", label: "64990 – Other financial services (chit funds, NBFCs)" },
      { value: "65000", label: "65000 – Insurance & reinsurance" },
      { value: "66000", label: "66000 – Activities auxiliary to financial services" },
    ],
  },
  {
    group: "Professional & Technical Services",
    options: [
      { value: "69100", label: "69100 – Legal activities (advocates / law firms)" },
      { value: "69200", label: "69200 – Accounting, bookkeeping, auditing, tax (CA/CMA)" },
      { value: "70100", label: "70100 – Activities of head offices / management consulting" },
      { value: "71000", label: "71000 – Architectural & engineering activities" },
      { value: "72000", label: "72000 – Scientific research & development" },
      { value: "73000", label: "73000 – Advertising & market research" },
      { value: "74000", label: "74000 – Other professional, scientific & technical activities" },
      { value: "75000", label: "75000 – Veterinary activities" },
    ],
  },
  {
    group: "Education",
    options: [
      { value: "85100", label: "85100 – Pre-primary education" },
      { value: "85200", label: "85200 – Primary education" },
      { value: "85300", label: "85300 – Secondary education" },
      { value: "85400", label: "85400 – Higher education (colleges / universities)" },
      { value: "85500", label: "85500 – Other education (coaching / vocational)" },
    ],
  },
  {
    group: "Healthcare & Social Work",
    options: [
      { value: "86100", label: "86100 – Hospital activities" },
      { value: "86200", label: "86200 – Medical & dental practice (clinics)" },
      { value: "86900", label: "86900 – Other human health activities" },
      { value: "87000", label: "87000 – Residential care activities (nursing homes)" },
      { value: "88000", label: "88000 – Social work activities" },
    ],
  },
  {
    group: "Arts, Entertainment & Recreation",
    options: [
      { value: "90000", label: "90000 – Creative, arts & entertainment activities" },
      { value: "91000", label: "91000 – Libraries, archives, museums" },
      { value: "92000", label: "92000 – Gambling & betting activities" },
      { value: "93000", label: "93000 – Sports & recreation activities" },
    ],
  },
  {
    group: "Other Services",
    options: [
      { value: "95000", label: "95000 – Repair of computers & personal goods" },
      { value: "96010", label: "96010 – Washing & dry-cleaning" },
      { value: "96020", label: "96020 – Hairdressing & beauty salons" },
      { value: "96030", label: "96030 – Funeral & related activities" },
      { value: "96090", label: "96090 – Other personal service activities" },
    ],
  },
];

// Flat list for easy lookup
export const ALL_BAC_OPTIONS = BAC_SECTORS.flatMap((s) =>
  s.options.map((o) => ({ ...o, group: s.group }))
);

// Nature of business options (common Indian business types)
export const NATURE_OF_BUSINESS = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "trader_wholesale", label: "Trader – Wholesale" },
  { value: "trader_retail", label: "Trader – Retail" },
  { value: "trader_both", label: "Trader – Wholesale & Retail" },
  { value: "service_provider", label: "Service Provider" },
  { value: "professional", label: "Professional (Doctor/CA/Lawyer/Engineer)" },
  { value: "contractor", label: "Contractor / Sub-contractor" },
  { value: "commission_agent", label: "Commission Agent / Broker" },
  { value: "exporter", label: "Exporter" },
  { value: "importer", label: "Importer" },
  { value: "import_export", label: "Importer & Exporter" },
  { value: "ecommerce", label: "E-commerce Seller" },
  { value: "real_estate_developer", label: "Real Estate Developer / Builder" },
  { value: "infrastructure", label: "Infrastructure / Civil Contractor" },
  { value: "hospitality", label: "Hospitality / Hotels / Restaurants" },
  { value: "it_software", label: "IT / Software / Technology" },
  { value: "fintech", label: "Fintech / NBFC / Financial Services" },
  { value: "insurance", label: "Insurance Agent / Broker" },
  { value: "agriculture", label: "Agriculturist / Farmer" },
  { value: "transporter", label: "Transporter / Logistics" },
  { value: "healthcare", label: "Healthcare / Hospital / Clinic" },
  { value: "education", label: "Education / Coaching / School" },
  { value: "ngo_trust", label: "NGO / Trust / Society" },
  { value: "startup", label: "Startup / New Business" },
  { value: "other", label: "Other Business" },
];
