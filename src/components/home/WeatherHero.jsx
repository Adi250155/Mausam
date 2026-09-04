import {
  getWeatherDescription,
  getWeatherIcon,
} from "../../services/weather/weatherUtils";

function formatUpdatedTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function WeatherHero({
  location,
  weather,
  airQuality,
}) {
  const current =
    weather?.current || {};

  const temperature =
    current.temperature_2m ??
    current.temperature ??
    null;

  const feelsLike =
    current.apparent_temperature ??
    current.feelsLike ??
    null;

  const humidity =
    current.relative_humidity_2m ??
    current.humidity ??
    null;

  const wind =
    current.wind_speed_10m ??
    current.windSpeed ??
    null;

  const code =
    current.weather_code ??
    current.weatherCode ??
    0;

  const description =
    current.description ||
    getWeatherDescription(code);

  const icon =
    current.icon ||
    getWeatherIcon(code);

  const aqi =
    airQuality?.current?.us_aqi ??
    airQuality?.current?.european_aqi ??
    airQuality?.aqi ??
    null;

  return (
    <section className="weather-hero">
      <div className="weather-hero-top">
        <div>
          <span className="weather-eyebrow">
            CURRENT WEATHER
          </span>

          <h1 className="weather-location">
            {location?.name ||
              "Current Location"}
          </h1>
        </div>

        <div className="weather-hero-icon">
          {icon}
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature">
          {temperature !== null
            ? `${Math.round(
                temperature
              )}°`
            : "--"}
        </div>

        <div className="weather-description">
          {description}
        </div>
      </div>

      <div className="weather-feels">
        Feels like{" "}
        {feelsLike !== null
          ? `${Math.round(
              feelsLike
            )}°C`
          : "--"}
      </div>

      <div className="weather-metrics">
        <div className="weather-metric">
          <span>💧</span>
          <strong>
            {humidity !== null
              ? `${Math.round(
                  humidity
                )}%`
              : "--"}
          </strong>
          <small>
            Humidity
          </small>
        </div>

        <div className="weather-metric">
          <span>💨</span>
          <strong>
            {wind !== null
              ? `${Math.round(
                  wind
                )} km/h`
              : "--"}
          </strong>
          <small>
            Wind
          </small>
        </div>

        <div className="weather-metric">
          <span>🌫️</span>
          <strong>
            {aqi !== null
              ? aqi
              : "--"}
          </strong>
          <small>
            AQI
          </small>
        </div>
      </div>

      <div className="weather-source-row">
        <span>
          Source:{" "}
          {weather?.source
            ?.weather ||
            "Open-Meteo"}
        </span>

        {weather?.updatedAt && (
          <span>
            Updated{" "}
            {formatUpdatedTime(
              weather.updatedAt
            )}
          </span>
        )}
      </div>
    </section>
  );
}

export default WeatherHero;