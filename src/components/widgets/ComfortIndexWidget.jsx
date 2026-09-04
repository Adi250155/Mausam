import {
  getComfortIndex,
} from "../../services/weather/weatherUtils";

function ComfortIndexWidget({ weather }) {
  const current =
    weather?.current;

  const rain =
    weather?.hourly
      ?.precipitation_probability?.[0] ?? 0;

  if (!current) {
    return (
      <div>
        <h3>Outdoor Comfort</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  const score =
    getComfortIndex({
      temperature:
        current.temperature_2m,

      humidity:
        current.relative_humidity_2m,

      wind:
        current.wind_speed_10m,

      rainProbability: rain,
    });

  const label =
    score >= 80
      ? "Excellent"
      : score >= 65
      ? "Good"
      : score >= 45
      ? "Fair"
      : "Poor";

  return (
    <div>
      <h3>Outdoor Comfort</h3>

      <h2>{score}/100</h2>

      <p>{label}</p>
    </div>
  );
}

export default ComfortIndexWidget;