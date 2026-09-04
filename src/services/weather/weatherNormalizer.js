import {
  getWeatherDescription,
  getWeatherIcon,
} from "./weatherUtils";

/* ----------------------------- */
/* Utility helpers                */
/* ----------------------------- */

function toNumber(value, fallback = null) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function firstValue(...values) {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return null;
}

/* ----------------------------- */
/* Current weather normalization */
/* ----------------------------- */

function normalizeCurrent(
  imd = {},
  openMeteo = {}
) {
  const current =
    openMeteo?.current || {};

  const temperature = toNumber(
    firstValue(
      imd.temperature,
      imd.temp,
      imd.t,
      current.temperature_2m
    )
  );

  const humidity = toNumber(
    firstValue(
      imd.humidity,
      imd.relativeHumidity,
      imd.rh,
      current.relative_humidity_2m
    )
  );

  const apparentTemperature = toNumber(
    firstValue(
      imd.apparentTemperature,
      imd.feelsLike,
      imd.feels_like,
      current.apparent_temperature
    )
  );

  const windSpeed = toNumber(
    firstValue(
      imd.windSpeed,
      imd.wind_speed,
      imd.ws,
      current.wind_speed_10m
    )
  );

  const windDirection = toNumber(
    firstValue(
      imd.windDirection,
      imd.wind_direction,
      imd.wd,
      current.wind_direction_10m
    )
  );

  const visibility = toNumber(
    firstValue(
      imd.visibility,
      current.visibility
    )
  );

  const pressure = toNumber(
    firstValue(
      imd.pressure,
      imd.pressureMSL,
      current.surface_pressure
    )
  );

  const precipitation = toNumber(
    firstValue(
      imd.precipitation,
      imd.rainfall,
      imd.rain,
      current.precipitation
    )
  );

  const rain = toNumber(
    firstValue(
      imd.rain,
      current.rain
    )
  );

  const weatherCode = toNumber(
    firstValue(
      imd.weatherCode,
      imd.weather_code,
      current.weather_code
    )
  );

  const description =
    firstValue(
      imd.description,
      imd.weatherDescription
    ) ||
    (
      weatherCode !== null
        ? getWeatherDescription(weatherCode)
        : "Weather data unavailable"
    );

  return {
    /* Original normalized fields */
    temperature,
    feelsLike: apparentTemperature,
    humidity,
    windSpeed,
    windDirection,
    visibility,
    pressure,
    precipitation,
    rain,
    weatherCode,
    description,

    /* Existing widget compatibility */
    temperature_2m: temperature,
    apparent_temperature:
      apparentTemperature,
    relative_humidity_2m: humidity,
    wind_speed_10m: windSpeed,
    wind_direction_10m: windDirection,
    precipitation,
    rain,
    visibility,

    weather_code: weatherCode,

    /* UI helpers */
    icon:
      weatherCode !== null
        ? getWeatherIcon(weatherCode)
        : "🌤️",
  };
}

/* ----------------------------- */
/* Forecast normalization        */
/* ----------------------------- */

function normalizeDaily(
  imdForecast = [],
  openMeteo = {}
) {
  const daily =
    openMeteo?.daily;

  /*
   * Once actual IMD forecast response is available,
   * we can map it here.
   *
   * For now Open-Meteo remains the fallback source.
   */

  if (!daily?.time) {
    return {
      time: [],
      weather_code: [],
      temperature_2m_max: [],
      temperature_2m_min: [],
      apparent_temperature_max: [],
      apparent_temperature_min: [],
      precipitation_probability_max: [],
      precipitation_sum: [],
      wind_speed_10m_max: [],
      uv_index_max: [],
      sunrise: [],
      sunset: [],
    };
  }

  return {
    time: daily.time,

    weather_code:
      daily.weather_code || [],

    temperature_2m_max:
      daily.temperature_2m_max || [],

    temperature_2m_min:
      daily.temperature_2m_min || [],

    apparent_temperature_max:
      daily.apparent_temperature_max || [],

    apparent_temperature_min:
      daily.apparent_temperature_min || [],

    precipitation_probability_max:
      daily.precipitation_probability_max || [],

    precipitation_sum:
      daily.precipitation_sum || [],

    wind_speed_10m_max:
      daily.wind_speed_10m_max || [],

    uv_index_max:
      daily.uv_index_max || [],

    sunrise:
      daily.sunrise || [],

    sunset:
      daily.sunset || [],

    et0_fao_evapotranspiration:
      daily.et0_fao_evapotranspiration || [],
  };
}

/* ----------------------------- */
/* Hourly normalization          */
/* ----------------------------- */

function normalizeHourly(
  imd = {},
  openMeteo = {}
) {
  const hourly =
    openMeteo?.hourly;

  if (!hourly?.time) {
    return {
      time: [],
    };
  }

  return {
    time: hourly.time,

    temperature_2m:
      hourly.temperature_2m || [],

    relative_humidity_2m:
      hourly.relative_humidity_2m || [],

    apparent_temperature:
      hourly.apparent_temperature || [],

    precipitation_probability:
      hourly.precipitation_probability || [],

    precipitation:
      hourly.precipitation || [],

    rain:
      hourly.rain || [],

    weather_code:
      hourly.weather_code || [],

    wind_speed_10m:
      hourly.wind_speed_10m || [],

    wind_direction_10m:
      hourly.wind_direction_10m || [],

    visibility:
      hourly.visibility || [],

    uv_index:
      hourly.uv_index || [],

    soil_moisture_0_to_1cm:
      hourly.soil_moisture_0_to_1cm || [],

    soil_moisture_1_to_3cm:
      hourly.soil_moisture_1_to_3cm || [],

    evapotranspiration:
      hourly.evapotranspiration || [],
  };
}

/* ----------------------------- */
/* AQI normalization             */
/* ----------------------------- */

function normalizeAirQuality(
  cpcb = {},
  openMeteoAir = {}
) {
  const current =
    openMeteoAir?.current || {};

  const aqi = toNumber(
    firstValue(
      cpcb.aqi,
      cpcb.AQI,
      cpcb.air_quality_index,
      current.us_aqi,
      current.european_aqi
    )
  );

  const pm25 = toNumber(
    firstValue(
      cpcb.pm25,
      cpcb.pm2_5,
      cpcb.PM25,
      current.pm2_5
    )
  );

  const pm10 = toNumber(
    firstValue(
      cpcb.pm10,
      cpcb.PM10,
      current.pm10
    )
  );

  return {
    aqi,
    pm25,
    pm10,

    co: toNumber(
      firstValue(
        cpcb.co,
        cpcb.CO
      )
    ),

    no2: toNumber(
      firstValue(
        cpcb.no2,
        cpcb.NO2
      )
    ),

    so2: toNumber(
      firstValue(
        cpcb.so2,
        cpcb.SO2
      )
    ),

    o3: toNumber(
      firstValue(
        cpcb.o3,
        cpcb.O3
      )
    ),

    /* Keep raw-compatible names */
    pm2_5: pm25,
  };
}

/* ----------------------------- */
/* Marine normalization           */
/* ----------------------------- */

function normalizeMarine(
  incois = {},
  openMeteoMarine = {}
) {
  const current =
    openMeteoMarine?.current || {};

  return {
    waveHeight: toNumber(
      firstValue(
        incois.waveHeight,
        incois.wave_height,
        current.wave_height
      )
    ),

    waveDirection: toNumber(
      firstValue(
        incois.waveDirection,
        incois.wave_direction,
        current.wave_direction
      )
    ),

    wavePeriod: toNumber(
      firstValue(
        incois.wavePeriod,
        incois.wave_period,
        current.wave_period
      )
    ),

    seaTemperature: toNumber(
      firstValue(
        incois.seaTemperature,
        incois.sea_surface_temperature,
        current.sea_surface_temperature
      )
    ),

    seaLevel: toNumber(
      firstValue(
        incois.seaLevel,
        incois.sea_level_height_msl,
        current.sea_level_height_msl
      )
    ),

    tide: firstValue(
      incois.tide,
      incois.tideData,
      null
    ),
  };
}

/* ----------------------------- */
/* Official warnings              */
/* ----------------------------- */

function normalizeWarnings(
  warnings = []
) {
  if (!Array.isArray(warnings)) {
    return [];
  }

  return warnings.map(
    (warning, index) => ({
      id:
        warning.id ||
        warning.alertId ||
        `imd-${index}`,

      title:
        warning.title ||
        warning.event ||
        "Weather Warning",

      message:
        warning.message ||
        warning.description ||
        "",

      severity:
        warning.severity ||
        warning.level ||
        "unknown",

      area:
        warning.area ||
        warning.district ||
        warning.region ||
        "",

      startTime:
        warning.startTime ||
        warning.start ||
        null,

      endTime:
        warning.endTime ||
        warning.end ||
        null,

      source: "IMD",
      official: true,
    })
  );
}

/* ----------------------------- */
/* Complete Mausam object        */
/* ----------------------------- */

export function normalizeMausamWeather({
  location = null,
  imd = null,
  cpcb = null,
  incois = null,
  openMeteo = null,
  imdWarnings = [],
} = {}) {
  const imdCurrent =
    imd?.current ||
    {};

  const openMeteoAir =
    openMeteo?.airQuality ||
    {};

  const openMeteoMarine =
    openMeteo?.marine ||
    {};

  return {
    location,

    current: normalizeCurrent(
      imdCurrent,
      openMeteo
    ),

    hourly: normalizeHourly(
      imdCurrent,
      openMeteo
    ),

    daily: normalizeDaily(
      imd?.forecast || [],
      openMeteo
    ),

    airQuality:
      normalizeAirQuality(
        cpcb || {},
        openMeteoAir
      ),

    marine:
      normalizeMarine(
        incois || {},
        openMeteoMarine
      ),

    warnings:
      normalizeWarnings(
        imdWarnings
      ),

    nowcast:
      imd?.nowcast || null,

    /*
     * Keep provider information visible.
     * Useful later for transparency in UI.
     */
    source: {
      weather: imd
        ? "IMD"
        : openMeteo
        ? "Open-Meteo"
        : "Unavailable",

      airQuality: cpcb
        ? "CPCB"
        : openMeteoAir
        ? "Open-Meteo"
        : "Unavailable",

      marine: incois
        ? "INCOIS"
        : openMeteoMarine
        ? "Open-Meteo"
        : "Unavailable",
    },

    updatedAt:
      new Date().toISOString(),
  };
}