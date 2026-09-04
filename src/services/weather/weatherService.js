import {
  getOpenMeteoWeather,
  getOpenMeteoAirQuality,
  getOpenMeteoMarineWeather,
} from "./providers/openMeteoService";

import {
  getWeatherCache,
  setWeatherCache,
} from "./weatherCache";

async function safeCall(
  callback,
  fallback = null
) {
  try {
    return await callback();
  } catch (error) {
    console.warn(
      "Open-Meteo provider error:",
      error?.message || error
    );

    return fallback;
  }
}

export async function getWeather(
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

  const cached =
    getWeatherCache(
      latitude,
      longitude,
      "weather"
    );

  if (cached) {
    return cached;
  }

  const rawWeather =
    await safeCall(
      () =>
        getOpenMeteoWeather(
          latitude,
          longitude
        ),
      null
    );

  if (!rawWeather) {
    throw new Error(
      "Unable to load weather data."
    );
  }

  const data = {
    ...rawWeather,

    location: {
      latitude,
      longitude,
    },

    source: {
      currentWeather: "Open-Meteo",
      forecast: "Open-Meteo",
      weather: "Open-Meteo",
      airQuality: "Open-Meteo",
      marine: "Open-Meteo",
      warnings: "Unavailable",
    },

    official: {
      weather: false,
      forecast: false,
      airQuality: false,
      marine: false,
      warnings: false,
    },

    warnings: [],

    updatedAt:
      new Date().toISOString(),
  };

  setWeatherCache(
    latitude,
    longitude,
    data,
    "weather"
  );

  return data;
}

export async function getAirQuality(
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

  const cached =
    getWeatherCache(
      latitude,
      longitude,
      "air-quality"
    );

  if (cached) {
    return cached;
  }

  const data =
    await safeCall(
      () =>
        getOpenMeteoAirQuality(
          latitude,
          longitude
        ),
      null
    );

  if (!data) {
    throw new Error(
      "Unable to load air quality data."
    );
  }

  const normalized = {
    ...data,

    source:
      "Open-Meteo",

    official:
      false,
  };

  setWeatherCache(
    latitude,
    longitude,
    normalized,
    "air-quality"
  );

  return normalized;
}

export async function getMarineWeather(
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

  const cached =
    getWeatherCache(
      latitude,
      longitude,
      "marine"
    );

  if (cached) {
    return cached;
  }

  const data =
    await safeCall(
      () =>
        getOpenMeteoMarineWeather(
          latitude,
          longitude
        ),
      null
    );

  if (!data) {
    throw new Error(
      "Unable to load marine data."
    );
  }

  const normalized = {
    ...data,

    source:
      "Open-Meteo",

    official:
      false,
  };

  setWeatherCache(
    latitude,
    longitude,
    normalized,
    "marine"
  );

  return normalized;
}
