/**
 * CPCB Air Quality Provider
 *
 * Responsible for Indian air-quality data.
 */

const CPCB_API_BASE =
  import.meta.env.VITE_CPCB_API_BASE_URL || "";

const CPCB_API_KEY =
  import.meta.env.VITE_CPCB_API_KEY || "";

/**
 * Generic CPCB request helper.
 */
async function cpcbRequest(endpoint, options = {}) {
  if (!CPCB_API_BASE) {
    throw new Error(
      "CPCB API base URL is not configured."
    );
  }

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (CPCB_API_KEY) {
    headers.Authorization = `Bearer ${CPCB_API_KEY}`;
  }

  const response = await fetch(
    `${CPCB_API_BASE}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `CPCB API request failed with status ${response.status}.`
    );
  }

  return response.json();
}

/**
 * Get AQI and pollutant information.
 */
export async function getCPCBAirQuality(
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
  // Connect the appropriate CPCB endpoint.

  throw new Error(
    "CPCB air quality endpoint is not configured yet."
  );
}

export { cpcbRequest };