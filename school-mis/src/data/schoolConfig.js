// ─── School Configuration ────────────────────────────────────────────────────

export const CLASS_LIST = [
  "Nursery", "LKG", "UKG",
  "1st", "2nd", "3rd", "4th", "5th",
  "6th", "7th", "8th", "9th", "10th",
];

export const VEHICLE_LIST = [
  { bus_number: "Bus 1", route: "Route A", capacity: 40 },
  { bus_number: "Bus 2", route: "Route B", capacity: 40 },
  { bus_number: "Bus 3", route: "Route C", capacity: 40 },
  { bus_number: "Bus 4", route: "Route D", capacity: 40 },
  { bus_number: "Bus 5", route: "Route E", capacity: 40 },
];

export const FEE_TYPES = [
  { key: "SF",  label: "School Fees",        abbr: "SF"  },
  { key: "TF",  label: "Transport Fee",      abbr: "TF"  },
  { key: "BSR", label: "Book Sale Receipts",  abbr: "BSR" },
  { key: "CF",  label: "Canteen Fee",        abbr: "CF"  },
  { key: "OF",  label: "Other Fee",          abbr: "OF"  },
];

export const PAYMENT_METHODS = ["Cash", "UPI", "Cheque", "Bank Transfer"];

export const PAYMENT_MODES = [
  { key: "finance",  label: "Finance (EMI)" },
  { key: "one_time", label: "One-Time Payment" },
];
