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

  /*
   * Open-Meteo is always available as the
   * fallback provider.
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
   * Resolve nearest IMD station/district.
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

  let imdCurrent = null;
  let imdForecast = [];
  let imdWarnings = [];
  let imdNowcast = null;
  let imdRainfall = null;
  let imdSunMoon = null;

  /*
   * Only call IMD if a valid mapping exists.
   */
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
   * Sun/moon can be requested by coordinates.
   */
  if (imdLocation) {
    imdSunMoon =
      await safeCall(
        () =>
          getIMDSunMoon(
            latitude,
            longitude
          ),
        null
      );
  }

  return normalizeMausamWeather({
    location: {
      latitude,
      longitude,
      imd: imdLocation,
    },

    imd: {
      current: imdCurrent,
      forecast: imdForecast,
      nowcast: imdNowcast,
      rainfall: imdRainfall,
      sunMoon: imdSunMoon,
    },

    imdWarnings,

    openMeteo,
  });
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

  const [
    cpcb,
    openMeteoAir,
  ] = await Promise.all([
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

  const [
    incois,
    openMeteoMarine,
  ] = await Promise.all([
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

  return normalized.marine;
}