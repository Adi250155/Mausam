import {
  supabase,
} from "../supabase/supabaseClient";

import {
  getCurrentUser,
} from "./profileService";

export async function getUserWidgets() {
  const user =
    await getCurrentUser();

  if (!user) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase
    .from("user_widgets")
    .select("*")
    .eq("user_id", user.id)
    .order("is_pinned", {
      ascending: false,
    })
    .order("position", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function saveWidgetPreference(
  widgetId,
  updates = {}
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  if (!widgetId) {
    throw new Error(
      "Widget ID is required."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("user_widgets")
    .upsert(
      {
        user_id: user.id,
        widget_id: widgetId,
        ...updates,
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict:
          "user_id,widget_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function toggleWidgetPin(
  widgetId,
  pinned
) {
  return saveWidgetPreference(
    widgetId,
    {
      is_pinned:
        Boolean(pinned),
      is_hidden: false,
    }
  );
}

export async function hideWidget(
  widgetId
) {
  return saveWidgetPreference(
    widgetId,
    {
      is_hidden: true,
    }
  );
}

export async function showWidget(
  widgetId
) {
  return saveWidgetPreference(
    widgetId,
    {
      is_hidden: false,
    }
  );
}

export async function addWidget(
  widgetId
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const existing =
    await getUserWidgets();

  const maxPosition =
    existing.reduce(
      (max, widget) =>
        Math.max(
          max,
          Number(
            widget.position || 0
          )
        ),
      0
    );

  return saveWidgetPreference(
    widgetId,
    {
      is_hidden: false,
      is_pinned: false,
      position:
        maxPosition + 1,
    }
  );
}

export async function removeWidgetPreference(
  widgetId
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const {
    error,
  } = await supabase
    .from("user_widgets")
    .delete()
    .eq("user_id", user.id)
    .eq(
      "widget_id",
      widgetId
    );

  if (error) {
    throw error;
  }

  return true;
}