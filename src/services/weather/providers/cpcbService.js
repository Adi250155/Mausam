const CPCB_BASE_URL =
  import.meta.env.VITE_CPCB_API_BASE_URL || "";

const CPCB_API_KEY =
  import.meta.env.VITE_CPCB_API_KEY || "";

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
   * Keep the provider isolated until the
   * verified CPCB API/data endpoint is configured.
   */
  throw new Error(
    "CPCB provider is not configured yet."
  );
}

export {
  requestCPCB,
};