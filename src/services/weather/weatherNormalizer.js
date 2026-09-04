import {
  getWeatherDescription,
  getWeatherIcon,
} from "./weatherUtils";

function getNumber(
  value,
  fallback = null
) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

export function normalizeWeather(
  weather
) {
  if (!weather) {
    return null;
  }

  const current =
    weather.current || {};

  return {
    ...weather,

    current: {
      ...current,

      temperature:
        getNumber(
          current.temperature_2m
        ),

      feelsLike:
        getNumber(
          current.apparent_temperature
        ),

      humidity:
        getNumber(
          current.relative_humidity_2m
        ),

      windSpeed:
        getNumber(
          current.wind_speed_10m
        ),

      windDirection:
        getNumber(
          current.wind_direction_10m
        ),

      visibility:
        getNumber(
          current.visibility
        ),

      precipitation:
        getNumber(
          current.precipitation
        ),

      rain:
        getNumber(
          current.rain
        ),

      weatherCode:
        getNumber(
          current.weather_code
        ),

      description:
        getWeatherDescription(
          current.weather_code
        ),

      icon:
        getWeatherIcon(
          current.weather_code
        ),
    },

    warnings: [],

    source: {
      ...(weather.source || {}),

      weather:
        weather.source?.weather ||
        "Open-Meteo",

      currentWeather:
        weather.source?.currentWeather ||
        "Open-Meteo",

      forecast:
        weather.source?.forecast ||
        "Open-Meteo",

      warnings: "Unavailable",
    },

    official: {
      weather: false,
      forecast: false,
      warnings: false,
      airQuality: false,
      marine: false,
    },
  };
}

export function normalizeAirQuality(
  airQuality
) {
  if (!airQuality) {
    return null;
  }

  const current =
    airQuality.current || {};

  return {
    ...airQuality,

    aqi:
      getNumber(
        current.us_aqi ??
          current.european_aqi
      ),

    pm25:
      getNumber(
        current.pm2_5
      ),

    pm10:
      getNumber(
        current.pm10
      ),

    source:
      "Open-Meteo",

    official:
      false,
  };
}

export function normalizeMarine(
  marine
) {
  if (!marine) {
    return null;
  }

  const current =
    marine.current || {};

  return {
    ...marine,

    waveHeight:
      getNumber(
        current.wave_height
      ),

    waveDirection:
      getNumber(
        current.wave_direction
      ),

    wavePeriod:
      getNumber(
        current.wave_period
      ),

    seaTemperature:
      getNumber(
        current.sea_surface_temperature
      ),

    seaLevel:
      getNumber(
        current.sea_level_height_msl
      ),

    source:
      "Open-Meteo",

    official:
      false,
  };
}

export function normalizeMausamWeather(
  {
    location = null,
    openMeteo = null,
  } = {}
) {
  return normalizeWeather({
    ...(openMeteo || {}),

    location,

    source: {
      weather: "Open-Meteo",
      currentWeather: "Open-Meteo",
      forecast: "Open-Meteo",
      airQuality: "Open-Meteo",
      marine: "Open-Meteo",
      warnings: "Unavailable",
    },

    warnings: [],
  });
}
