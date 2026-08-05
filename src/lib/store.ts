import { db, PROFILE_ID, SETTINGS_ID, type Profile, type Settings } from "./db";

const DEFAULT_PROFILE: Profile = {
  id: PROFILE_ID,
  currency: "INR",
  budgetGoals: [],
  recurringBills: [],
  customCategories: [],
  cashBalance: 0,
  bankBalance: 0,
};

const DEFAULT_SETTINGS: Settings = {
  id: SETTINGS_ID,
  provider: "openai",
  apiKey: "",
  model: "",
};

export async function getProfile(): Promise<Profile> {
  const existing = await db.profile.get(PROFILE_ID);
  if (existing) return existing;
  await db.profile.put(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
}

// Read-only variant for useLiveQuery, which forbids writes inside the query.
export async function readProfile(): Promise<Profile> {
  return (await db.profile.get(PROFILE_ID)) ?? DEFAULT_PROFILE;
}

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.get(SETTINGS_ID);
  if (existing) return existing;
  await db.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

// Read-only variant for useLiveQuery, which forbids writes inside the query.
export async function readSettings(): Promise<Settings> {
  return (await db.settings.get(SETTINGS_ID)) ?? DEFAULT_SETTINGS;
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next = { ...current, ...patch, id: SETTINGS_ID };
  await db.settings.put(next);
  return next;
}

export async function saveProfile(patch: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const next = { ...current, ...patch, id: PROFILE_ID };
  await db.profile.put(next);
  return next;
}

export async function setCurrency(currency: string): Promise<void> {
  await saveProfile({ currency });
}
