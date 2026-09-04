/**
 * INCOIS Marine Provider
 *
 * INCOIS is the preferred Indian source for
 * ocean and marine information.
 */

const INCOIS_BASE_URL =
  import.meta.env.VITE_INCOIS_API_BASE_URL || "";

const INCOIS_API_KEY =
  import.meta.env.VITE_INCOIS_API_KEY || "";

/**
 * Generic INCOIS request helper.
 */
async function requestINCOIS(
  endpoint,
  params = {}
) {
  if (!INCOIS_BASE_URL) {
    throw new Error(
      "INCOIS API base URL is not configured."
    );
  }

  const url = new URL(
    `${INCOIS_BASE_URL}${endpoint}`
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

  if (INCOIS_API_KEY) {
    headers.Authorization =
      `Bearer ${INCOIS_API_KEY}`;
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
      `INCOIS API request failed with status ${response.status}.`
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
        "INCOIS API returned an error."
    );
  }

  return data;
}

/**
 * Get marine information.
 *
 * Currently kept behind the provider layer until
 * the exact INCOIS service endpoint is configured.
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

  /*
   * Do not guess an INCOIS endpoint.
   *
   * Open-Meteo Marine will remain the fallback
   * until the verified INCOIS service is connected.
   */
  throw new Error(
    "INCOIS provider is not configured yet."
  );
}

export {
  requestINCOIS,
};