import {
  getWeatherDescription,
  getWeatherIcon,
} from "../../services/weather/weatherUtils";

function ForecastWidget({ weather }) {
  const daily = weather?.daily;

  if (!daily?.time) {
    return (
      <div>
        <h3>7 Day Forecast</h3>
        <p>Forecast unavailable.</p>
      </div>
    );
  }

  const formatDay = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      [],
      {
        weekday: "short",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <div>
      <h3>7 Day Forecast</h3>

      {daily.time.map((date, index) => (
        <div key={date}>
          <strong>
            {formatDay(date)}
          </strong>

          <p>
            {getWeatherIcon(
              daily.weather_code[index]
            )}{" "}
            {getWeatherDescription(
              daily.weather_code[index]
            )}
          </p>

          <p>
            {Math.round(
              daily.temperature_2m_max[index]
            )}
            ° /{" "}
            {Math.round(
              daily.temperature_2m_min[index]
            )}
            °C
          </p>

          <p>
            Rain:{" "}
            {Math.round(
              daily
                .precipitation_probability_max[
                index
              ]
            )}
            %
          </p>
        </div>
      ))}
    </div>
  );
}

export default ForecastWidget;