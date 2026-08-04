import { db, PROFILE_ID, SETTINGS_ID, type Profile, type Settings } from "./db";

const DEFAULT_PROFILE: Profile = {
  id: PROFILE_ID,
  currency: "INR",
  budgetGoals: [],
  recurringBills: [],
  customCategories: [],
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

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.get(SETTINGS_ID);
  if (existing) return existing;
  await db.settings.put(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}
