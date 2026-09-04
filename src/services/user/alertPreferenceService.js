import { supabase } from "../supabase/supabaseClient";
import { getCurrentUser } from "./profileService";

const DEFAULT_PREFERENCES = {
  rain: true,
  storm: true,
  heat: true,
  aqi: true,
  uv: true,
  visibility: true,
};

export async function getAlertPreferences() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("user_alert_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      user_id: user.id,
      ...DEFAULT_PREFERENCES,
    };
  }

  return data;
}

export async function saveAlertPreferences(
  preferences
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const payload = {
    user_id: user.id,

    rain:
      preferences.rain ??
      DEFAULT_PREFERENCES.rain,

    storm:
      preferences.storm ??
      DEFAULT_PREFERENCES.storm,

    heat:
      preferences.heat ??
      DEFAULT_PREFERENCES.heat,

    aqi:
      preferences.aqi ??
      DEFAULT_PREFERENCES.aqi,

    uv:
      preferences.uv ??
      DEFAULT_PREFERENCES.uv,

    visibility:
      preferences.visibility ??
      DEFAULT_PREFERENCES.visibility,

    updated_at:
      new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_alert_preferences")
    .upsert(payload, {
      onConflict: "user_id",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}