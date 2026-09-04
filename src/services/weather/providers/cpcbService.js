/**
 * CPCB Air Quality Provider
 *
 * CPCB is the preferred Indian source for AQI
 * and pollutant information.
 *
 * The exact API endpoint can be configured through
 * environment variables once API access is available.
 */

const CPCB_BASE_URL =
  import.meta.env.VITE_CPCB_API_BASE_URL || "";

const CPCB_API_KEY =
  import.meta.env.VITE_CPCB_API_KEY || "";

/**
 * Generic CPCB request helper.
 */
async function requestCPCB(
  endpoint,
  params = {}
) {
  if (!CPCB_BASE_URL) {
    throw new Error(
      "CPCB API base URL is not configured."
    );
  }

  const url = new URL(
    `${CPCB_BASE_URL}${endpoint}`
  );

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        url.searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const headers = {
    Accept: "application/json",
  };

  if (CPCB_API_KEY) {
    headers.Authorization =
      `Bearer ${CPCB_API_KEY}`;
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      `CPCB API request failed with status ${response.status}.`
    );
  }

  const data = await response.json();

  if (
    data?.error ||
    data?.status === false
  ) {
    throw new Error(
      data?.message ||
        data?.reason ||
        "CPCB API returned an error."
    );
  }

  return data;
}

/**
 * Get CPCB air quality information.
 *
 * Coordinates are kept in the function signature
 * so the provider can later resolve the nearest
 * monitoring station.
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

  /*
   * No endpoint is hardcoded until the actual
   * CPCB API/data access used by the project
   * is confirmed.
   */
  throw new Error(
    "CPCB provider is not configured yet."
  );
}

export {
  requestCPCB,
};