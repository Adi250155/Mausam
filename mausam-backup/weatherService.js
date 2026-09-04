import {
  getIMDCurrentWeather,
  getIMDForecast,
  getIMDWarnings,
  getIMDNowcast,
  getIMDRainfall,
  getIMDSunMoon,
} from "./providers/imdService";

import {
  getCPCBAirQuality,
} from "./providers/cpcbService";

import {
  getINCOISMarineData,
} from "./providers/incoisService";

import {
  getOpenMeteoWeather,
  getOpenMeteoAirQuality,
  getOpenMeteoMarineWeather,
} from "./providers/openMeteoService";

import {
  normalizeMausamWeather,
} from "./weatherNormalizer";

import {
  findIMDLocation,
} from "../location/imdLocationService";

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
      "Provider unavailable:",
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

  /*
   * Open-Meteo remains the fallback.
   */
  const openMeteo =
    await safeCall(
      () =>
        getOpenMeteoWeather(
          latitude,
          longitude
        ),
      null
    );

  /*
   * Find nearest IMD station.
   */
  const imdLocation =
    await safeCall(
      () =>
        findIMDLocation(
          latitude,
          longitude
        ),
      null
    );

  let imdCurrent =
    null;

  let imdForecast =
    [];

  let imdWarnings =
    [];

  let imdNowcast =
    null;

  let imdRainfall =
    null;

  let imdSunMoon =
    null;

  if (
    imdLocation?.imdStationId
  ) {
    imdCurrent =
      await safeCall(
        () =>
          getIMDCurrentWeather(
            imdLocation.imdStationId
          ),
        null
      );

    imdForecast =
      await safeCall(
        () =>
          getIMDForecast(
            imdLocation.imdStationId
          ),
        []
      );
  }

  if (
    imdLocation?.imdDistrictId
  ) {
    imdWarnings =
      await safeCall(
        () =>
          getIMDWarnings(
            imdLocation.imdDistrictId
          ),
        []
      );

    imdNowcast =
      await safeCall(
        () =>
          getIMDNowcast(
            imdLocation.imdDistrictId
          ),
        null
      );

    imdRainfall =
      await safeCall(
        () =>
          getIMDRainfall(
            imdLocation.imdDistrictId
          ),
        null
      );
  }

  /*
   * SunMoon is coordinate based.
   */
  imdSunMoon =
    await safeCall(
      () =>
        getIMDSunMoon(
          latitude,
          longitude
        ),
      null
    );

  const normalized =
    normalizeMausamWeather({
      location: {
        latitude,
        longitude,

        imd: imdLocation,
      },

      imd: {
        current:
          imdCurrent,

        forecast:
          imdForecast,

        nowcast:
          imdNowcast,

        rainfall:
          imdRainfall,

        sunMoon:
          imdSunMoon,
      },

      imdWarnings,

      openMeteo,
    });

  setWeatherCache(
    latitude,
    longitude,
    normalized,
    "weather"
  );

  return normalized;
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

  const [
    cpcb,
    openMeteoAir,
  ] =
    await Promise.all([
      safeCall(
        () =>
          getCPCBAirQuality(
            latitude,
            longitude
          ),
        null
      ),

      safeCall(
        () =>
          getOpenMeteoAirQuality(
            latitude,
            longitude
          ),
        null
      ),
    ]);

  const normalized =
    normalizeMausamWeather({
      cpcb,

      openMeteo: {
        airQuality:
          openMeteoAir,
      },
    });

  setWeatherCache(
    latitude,
    longitude,
    normalized.airQuality,
    "air-quality"
  );

  return normalized.airQuality;
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

  const [
    incois,
    openMeteoMarine,
  ] =
    await Promise.all([
      safeCall(
        () =>
          getINCOISMarineData(
            latitude,
            longitude
          ),
        null
      ),

      safeCall(
        () =>
          getOpenMeteoMarineWeather(
            latitude,
            longitude
          ),
        null
      ),
    ]);

  const normalized =
    normalizeMausamWeather({
      incois,

      openMeteo: {
        marine:
          openMeteoMarine,
      },
    });

  setWeatherCache(
    latitude,
    longitude,
    normalized.marine,
    "marine"
  );

  return normalized.marine;
}