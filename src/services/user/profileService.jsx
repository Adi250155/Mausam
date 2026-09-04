import { supabase } from "../supabase/supabaseClient";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function getUserProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveUserPreferences(
  categories,
  answers
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .upsert(
      {
        user_id: user.id,
        interests: categories,
        answers: answers,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserPreferences() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveLocation(location) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const { data, error } = await supabase
    .from("saved_locations")
    .insert({
      user_id: user.id,
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      is_primary: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSavedLocations() {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_locations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data || [];
}