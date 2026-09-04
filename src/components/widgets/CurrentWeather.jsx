import {
  getWeatherDescription,
  getWeatherIcon,
} from "../../services/weather/weatherUtils";

function CurrentWeather({ weather }) {
  const current = weather?.current;

  if (!current) {
    return (
      <div>
        <h3>Current Weather</h3>
        <p>Weather data unavailable.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Current Weather</h3>

      <h2>
        {getWeatherIcon(current.weather_code)}{" "}
        {Math.round(current.temperature_2m)}°C
      </h2>

      <p>
        {getWeatherDescription(current.weather_code)}
      </p>

      <p>
        Feels like{" "}
        {Math.round(current.apparent_temperature)}°C
      </p>

      <p>
        Humidity: {current.relative_humidity_2m}%
      </p>

      <p>
        Wind: {Math.round(current.wind_speed_10m)} km/h
      </p>
    </div>
  );
}

export default CurrentWeather;