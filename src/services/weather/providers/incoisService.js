
/**
 * INCOIS Marine Provider
 *
 * Responsible for marine and ocean-related information.
 */

const INCOIS_API_BASE =
  import.meta.env.VITE_INCOIS_API_BASE_URL || "";

const INCOIS_API_KEY =
  import.meta.env.VITE_INCOIS_API_KEY || "";

/**
 * Generic INCOIS request helper.
 */
async function incoisRequest(
  endpoint,
  options = {}
) {
  if (!INCOIS_API_BASE) {
    throw new Error(
      "INCOIS API base URL is not configured."
    );
  }

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (INCOIS_API_KEY) {
    headers.Authorization = `Bearer ${INCOIS_API_KEY}`;
  }

  const response = await fetch(
    `${INCOIS_API_BASE}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `INCOIS API request failed with status ${response.status}.`
    );
  }

  return response.json();
}

/**
 * Get marine conditions.
 */
export async function getINCOISMarineData(
  latitude,
  longitude
) {
  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "Latitude and longitude are required."
    );
  }

  // TODO:
  // Connect exact INCOIS marine endpoint.

  throw new Error(
    "INCOIS marine endpoint is not configured yet."
  );
}

export { incoisRequest };