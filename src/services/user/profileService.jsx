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

export async function updateUserProfile(
  updates = {}
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const allowedUpdates = {};

  if (
    updates.full_name !== undefined
  ) {
    allowedUpdates.full_name =
      String(
        updates.full_name
      ).trim();
  }

  if (
    Object.keys(
      allowedUpdates
    ).length === 0
  ) {
    return getUserProfile();
  }

  const { data, error } =
    await supabase
      .from("profiles")
      .update(
        allowedUpdates
      )
      .eq("id", user.id)
      .select()
      .single();

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

  const { data, error } =
    await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: user.id,
          interests:
            Array.isArray(categories)
              ? categories
              : [],
          answers:
            answers &&
            typeof answers ===
              "object"
              ? answers
              : {},
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "user_id",
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

  const { data, error } =
    await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function saveLocation(
  location
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  if (
    location?.latitude ===
      undefined ||
    location?.longitude ===
      undefined
  ) {
    throw new Error(
      "Valid location coordinates are required."
    );
  }

  const existing =
    await getSavedLocations();

  const shouldBePrimary =
    existing.length === 0;

  if (shouldBePrimary) {
    // First location is automatically primary.
  }

  const { data, error } =
    await supabase
      .from("saved_locations")
      .insert({
        user_id: user.id,
        name:
          location.name ||
          "Saved Location",
        latitude:
          Number(
            location.latitude
          ),
        longitude:
          Number(
            location.longitude
          ),
        is_primary:
          shouldBePrimary,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSavedLocations() {
  const user =
    await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("saved_locations")
      .select("*")
      .eq("user_id", user.id)
      .order(
        "is_primary",
        {
          ascending: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

  if (error) {
    throw error;
  }

  return data || [];
}

export async function setPrimaryLocation(
  locationId
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  if (!locationId) {
    throw new Error(
      "Location ID is required."
    );
  }

  const { error: resetError } =
    await supabase
      .from("saved_locations")
      .update({
        is_primary: false,
      })
      .eq("user_id", user.id);

  if (resetError) {
    throw resetError;
  }

  const {
    data,
    error,
  } = await supabase
    .from("saved_locations")
    .update({
      is_primary: true,
    })
    .eq(
      "id",
      locationId
    )
    .eq(
      "user_id",
      user.id
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteLocation(
  locationId
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const locations =
    await getSavedLocations();

  const target =
    locations.find(
      (location) =>
        location.id ===
        locationId
    );

  if (!target) {
    throw new Error(
      "Location not found."
    );
  }

  if (
    locations.length === 1
  ) {
    throw new Error(
      "You must keep at least one saved location."
    );
  }

  const { error } =
    await supabase
      .from("saved_locations")
      .delete()
      .eq(
        "id",
        locationId
      )
      .eq(
        "user_id",
        user.id
      );

  if (error) {
    throw error;
  }

  if (target.is_primary) {
    const remaining =
      locations.filter(
        (location) =>
          location.id !==
          locationId
      );

    if (
      remaining.length > 0
    ) {
      await supabase
        .from(
          "saved_locations"
        )
        .update({
          is_primary: false,
        })
        .eq(
          "user_id",
          user.id
        );

      await supabase
        .from(
          "saved_locations"
        )
        .update({
          is_primary: true,
        })
        .eq(
          "id",
          remaining[0].id
        )
        .eq(
          "user_id",
          user.id
        );
    }
  }

  return true;
}