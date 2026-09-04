const WEATHER_API =
  "https://api.open-meteo.com/v1/forecast";

const AIR_API =
  "https://air-quality-api.open-meteo.com/v1/air-quality";

const MARINE_API =
  "https://marine-api.open-meteo.com/v1/marine";

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  if (data?.error) {
    throw new Error(
      data.reason || "API returned an error."
    );
  }

  return data;
}

export async function getOpenMeteoWeather(
  latitude,
  longitude
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "visibility",
      "surface_pressure",
    ].join(","),

    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation_probability",
      "precipitation",
      "rain",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "visibility",
      "uv_index",
      "soil_moisture_0_to_1cm",
      "soil_moisture_1_to_3cm",
      "evapotranspiration",
    ].join(","),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "et0_fao_evapotranspiration",
    ].join(","),

    timezone: "auto",
    forecast_days: "7",
  });

  return fetchJson(
    `${WEATHER_API}?${params.toString()}`
  );
}

export async function getOpenMeteoAirQuality(
  latitude,
  longitude
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      "european_aqi",
      "us_aqi",
      "pm2_5",
      "pm10",
      "uv_index",
    ].join(","),

    hourly: [
      "european_aqi",
      "us_aqi",
      "pm2_5",
      "pm10",
      "grass_pollen",
      "birch_pollen",
      "mugwort_pollen",
      "olive_pollen",
    ].join(","),

    timezone: "auto",
    forecast_days: "5",
  });

  return fetchJson(
    `${AIR_API}?${params.toString()}`
  );
}

export async function getOpenMeteoMarineWeather(
  latitude,
  longitude
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "sea_surface_temperature",
      "sea_level_height_msl",
    ].join(","),

    hourly: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "sea_surface_temperature",
      "sea_level_height_msl",
    ].join(","),

    timezone: "auto",
    forecast_days: "7",
  });

  return fetchJson(
    `${MARINE_API}?${params.toString()}`
  );
}