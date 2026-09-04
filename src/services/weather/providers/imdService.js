const IMD_BASE_URL =
  import.meta.env.VITE_IMD_API_BASE_URL || "";

const IMD_API_KEY =
  import.meta.env.VITE_IMD_API_KEY || "";

async function requestIMD(
  endpoint,
  params = {}
) {
  if (!IMD_BASE_URL) {
    throw new Error(
      "IMD API base URL is not configured."
    );
  }

  const url = new URL(
    `${IMD_BASE_URL}${endpoint}`
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

  if (IMD_API_KEY) {
    headers.Authorization =
      `Bearer ${IMD_API_KEY}`;
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
      `IMD API request failed with status ${response.status}.`
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
        "IMD API returned an error."
    );
  }

  return data;
}

export async function getIMDCurrentWeather(
  stationId
) {
  if (!stationId) {
    throw new Error(
      "IMD station ID is required."
    );
  }

  return requestIMD(
    "/current_wx",
    {
      id: stationId,
    }
  );
}

export async function getIMDForecast(
  stationId
) {
  if (!stationId) {
    throw new Error(
      "IMD station ID is required."
    );
  }

  return requestIMD(
    "/cityforecastloc",
    {
      id: stationId,
    }
  );
}

export async function getIMDWarnings(
  districtId
) {
  if (!districtId) {
    throw new Error(
      "IMD district ID is required."
    );
  }

  return requestIMD(
    "/districtwarning",
    {
      id: districtId,
    }
  );
}

export async function getIMDNowcast(
  districtId
) {
  if (!districtId) {
    throw new Error(
      "IMD district ID is required."
    );
  }

  return requestIMD(
    "/districtnowcast",
    {
      id: districtId,
    }
  );
}

export async function getIMDRainfall(
  districtId
) {
  if (!districtId) {
    throw new Error(
      "IMD district ID is required."
    );
  }

  return requestIMD(
    "/districtrainfall",
    {
      id: districtId,
    }
  );
}

export async function getIMDSunMoon(
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

  return requestIMD(
    "/sunmoon",
    {
      lat: latitude,
      lon: longitude,
    }
  );
}

export {
  requestIMD,
};