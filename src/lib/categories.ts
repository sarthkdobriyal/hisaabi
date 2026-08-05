export const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Rent & Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Subscriptions",
  "Travel",
  "Loan / Borrowed",
  "Other",
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
