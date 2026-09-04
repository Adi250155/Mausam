import {
  getWeatherDescription,
  getWeatherIcon,
} from "./weatherUtils";

function toNumber(
  value,
  fallback = null
) {
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

function hasData(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return false;
  }

  if (
    typeof value !== "object"
  ) {
    return true;
  }

  return Object.keys(value).length > 0;
}

function normalizeCurrent(
  imd = null,
  openMeteo = {}
) {
  const imdData =
    imd && hasData(imd)
      ? imd
      : null;

  const current =
    openMeteo?.current || {};

  const temperature =
    toNumber(
      firstValue(
        imdData?.temperature,
        imdData?.temp,
        imdData?.t,
        current.temperature_2m
      )
    );

  const feelsLike =
    toNumber(
      firstValue(
        imdData?.feelsLike,
        imdData?.feels_like,
        imdData?.apparentTemperature,
        current.apparent_temperature
      )
    );

  const humidity =
    toNumber(
      firstValue(
        imdData?.humidity,
        imdData?.relativeHumidity,
        imdData?.rh,
        current.relative_humidity_2m
      )
    );

  const windSpeed =
    toNumber(
      firstValue(
        imdData?.windSpeed,
        imdData?.wind_speed,
        imdData?.ws,
        current.wind_speed_10m
      )
    );

  const windDirection =
    toNumber(
      firstValue(
        imdData?.windDirection,
        imdData?.wind_direction,
        imdData?.wd,
        current.wind_direction_10m
      )
    );

  const visibility =
    toNumber(
      firstValue(
        imdData?.visibility,
        current.visibility
      )
    );

  const pressure =
    toNumber(
      firstValue(
        imdData?.pressure,
        imdData?.pressureMSL,
        current.surface_pressure
      )
    );

  const precipitation =
    toNumber(
      firstValue(
        imdData?.precipitation,
        imdData?.rainfall,
        current.precipitation
      )
    );

  const rain =
    toNumber(
      firstValue(
        imdData?.rain,
        current.rain
      )
    );

  const weatherCode =
    toNumber(
      firstValue(
        imdData?.weatherCode,
        imdData?.weather_code,
        current.weather_code
      )
    );

  const description =
    firstValue(
      imdData?.description,
      imdData?.weatherDescription
    ) ||
    (
      weatherCode !== null
        ? getWeatherDescription(
            weatherCode
          )
        : "Weather data unavailable"
    );

  return {
    ...current,

    temperature,
    feelsLike,
    humidity,
    windSpeed,
    windDirection,
    visibility,
    pressure,
    precipitation,
    rain,
    weatherCode,
    description,

    temperature_2m:
      temperature,

    apparent_temperature:
      feelsLike,

    relative_humidity_2m:
      humidity,

    wind_speed_10m:
      windSpeed,

    wind_direction_10m:
      windDirection,

    weather_code:
      weatherCode,

    icon:
      weatherCode !== null
        ? getWeatherIcon(weatherCode)
        : "🌤️",
  };
}

function normalizeHourly(
  openMeteo = {}
) {
  const hourly =
    openMeteo?.hourly;

  if (!hourly) {
    return {
      time: [],
      temperature_2m: [],
      relative_humidity_2m: [],
      apparent_temperature: [],
      precipitation_probability: [],
      precipitation: [],
      rain: [],
      weather_code: [],
      wind_speed_10m: [],
      wind_direction_10m: [],
      visibility: [],
      uv_index: [],
      soil_moisture_0_to_1cm: [],
      soil_moisture_1_to_3cm: [],
      evapotranspiration: [],
    };
  }

  return {
    ...hourly,

    time:
      hourly.time || [],

    temperature_2m:
      hourly.temperature_2m || [],

    relative_humidity_2m:
      hourly.relative_humidity_2m || [],

    apparent_temperature:
      hourly.apparent_temperature || [],

    precipitation_probability:
      hourly.precipitation_probability ||
      [],

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
      hourly.soil_moisture_0_to_1cm ||
      [],

    soil_moisture_1_to_3cm:
      hourly.soil_moisture_1_to_3cm ||
      [],

    evapotranspiration:
      hourly.evapotranspiration ||
      [],
  };
}

function normalizeDaily(
  imdForecast = [],
  openMeteo = {}
) {
  const daily =
    openMeteo?.daily;

  /*
   * Until the verified IMD forecast mapper is
   * connected, Open-Meteo remains the forecast
   * fallback.
   */
  if (!daily) {
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
      et0_fao_evapotranspiration: [],
    };
  }

  return {
    ...daily,

    time:
      daily.time || [],

    weather_code:
      daily.weather_code || [],

    temperature_2m_max:
      daily.temperature_2m_max || [],

    temperature_2m_min:
      daily.temperature_2m_min || [],

    apparent_temperature_max:
      daily.apparent_temperature_max ||
      [],

    apparent_temperature_min:
      daily.apparent_temperature_min ||
      [],

    precipitation_probability_max:
      daily.precipitation_probability_max ||
      [],

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
      daily.et0_fao_evapotranspiration ||
      [],
  };
}

function normalizeAirQuality(
  cpcb = null,
  openMeteoAir = {}
) {
  const cpcbData =
    cpcb && hasData(cpcb)
      ? cpcb
      : null;

  const current =
    openMeteoAir?.current || {};

  const aqi =
    toNumber(
      firstValue(
        cpcbData?.aqi,
        cpcbData?.AQI,
        cpcbData?.air_quality_index,
        current.us_aqi,
        current.european_aqi
      )
    );

  const pm25 =
    toNumber(
      firstValue(
        cpcbData?.pm25,
        cpcbData?.pm2_5,
        cpcbData?.PM25,
        current.pm2_5
      )
    );

  const pm10 =
    toNumber(
      firstValue(
        cpcbData?.pm10,
        cpcbData?.PM10,
        current.pm10
      )
    );

  return {
    ...openMeteoAir,

    aqi,
    pm25,
    pm10,
    pm2_5: pm25,

    co: toNumber(
      firstValue(
        cpcbData?.co,
        cpcbData?.CO
      )
    ),

    no2: toNumber(
      firstValue(
        cpcbData?.no2,
        cpcbData?.NO2
      )
    ),

    so2: toNumber(
      firstValue(
        cpcbData?.so2,
        cpcbData?.SO2
      )
    ),

    o3: toNumber(
      firstValue(
        cpcbData?.o3,
        cpcbData?.O3
      )
    ),

    current: {
      ...current,

      us_aqi:
        current.us_aqi ??
        aqi,

      european_aqi:
        current.european_aqi ??
        aqi,

      pm2_5:
        current.pm2_5 ??
        pm25,

      pm10:
        current.pm10 ??
        pm10,
    },

    source:
      cpcbData
        ? "CPCB"
        : hasData(openMeteoAir)
        ? "Open-Meteo"
        : "Unavailable",

    official:
      Boolean(cpcbData),
  };
}

function normalizeMarine(
  incois = null,
  openMeteoMarine = {}
) {
  const incoisData =
    incois && hasData(incois)
      ? incois
      : null;

  const current =
    openMeteoMarine?.current || {};

  const waveHeight =
    toNumber(
      firstValue(
        incoisData?.waveHeight,
        incoisData?.wave_height,
        current.wave_height
      )
    );

  const waveDirection =
    toNumber(
      firstValue(
        incoisData?.waveDirection,
        incoisData?.wave_direction,
        current.wave_direction
      )
    );

  const wavePeriod =
    toNumber(
      firstValue(
        incoisData?.wavePeriod,
        incoisData?.wave_period,
        current.wave_period
      )
    );

  const seaTemperature =
    toNumber(
      firstValue(
        incoisData?.seaTemperature,
        incoisData?.sea_surface_temperature,
        current.sea_surface_temperature
      )
    );

  const seaLevel =
    toNumber(
      firstValue(
        incoisData?.seaLevel,
        incoisData?.sea_level_height_msl,
        current.sea_level_height_msl
      )
    );

  return {
    ...openMeteoMarine,

    waveHeight,
    waveDirection,
    wavePeriod,
    seaTemperature,
    seaLevel,

    tide:
      firstValue(
        incoisData?.tide,
        incoisData?.tideData,
        null
      ),

    current: {
      ...current,

      wave_height:
        waveHeight,

      wave_direction:
        waveDirection,

      wave_period:
        wavePeriod,

      sea_surface_temperature:
        seaTemperature,

      sea_level_height_msl:
        seaLevel,
    },

    source:
      incoisData
        ? "INCOIS"
        : hasData(openMeteoMarine)
        ? "Open-Meteo"
        : "Unavailable",

    official:
      Boolean(incoisData),
  };
}

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

export function normalizeMausamWeather({
  location = null,
  imd = null,
  cpcb = null,
  incois = null,
  openMeteo = null,
  imdWarnings = [],
} = {}) {
  const imdCurrent =
    imd?.current || null;

  const imdForecast =
    imd?.forecast || [];

  const openMeteoAir =
    openMeteo?.airQuality || null;

  const openMeteoMarine =
    openMeteo?.marine || null;

  const hasIMDCurrent =
    hasData(imdCurrent);

  const hasIMDForecast =
    Array.isArray(imdForecast) &&
    imdForecast.length > 0;

  const hasIMDWarnings =
    Array.isArray(imdWarnings) &&
    imdWarnings.length > 0;

  return {
    location,

    current:
      normalizeCurrent(
        imdCurrent,
        openMeteo
      ),

    hourly:
      normalizeHourly(
        openMeteo
      ),

    daily:
      normalizeDaily(
        imdForecast,
        openMeteo
      ),

    airQuality:
      normalizeAirQuality(
        cpcb,
        openMeteoAir
      ),

    marine:
      normalizeMarine(
        incois,
        openMeteoMarine
      ),

    warnings:
      normalizeWarnings(
        imdWarnings
      ),

    nowcast:
      imd?.nowcast || null,

    rainfall:
      imd?.rainfall || null,

    sunMoon:
      imd?.sunMoon || null,

    source: {
      currentWeather:
        hasIMDCurrent
          ? "IMD"
          : hasData(openMeteo)
          ? "Open-Meteo"
          : "Unavailable",

      forecast:
        hasIMDForecast
          ? "IMD"
          : hasData(openMeteo)
          ? "Open-Meteo"
          : "Unavailable",

      weather:
        hasIMDCurrent
          ? "IMD"
          : hasData(openMeteo)
          ? "Open-Meteo"
          : "Unavailable",

      airQuality:
        hasData(cpcb)
          ? "CPCB"
          : hasData(openMeteoAir)
          ? "Open-Meteo"
          : "Unavailable",

      marine:
        hasData(incois)
          ? "INCOIS"
          : hasData(openMeteoMarine)
          ? "Open-Meteo"
          : "Unavailable",

      warnings:
        hasIMDWarnings
          ? "IMD"
          : "Unavailable",
    },

    official: {
      weather:
        hasIMDCurrent,

      forecast:
        hasIMDForecast,

      airQuality:
        hasData(cpcb),

      marine:
        hasData(incois),

      warnings:
        hasIMDWarnings,
    },

    updatedAt:
      new Date().toISOString(),
  };
}