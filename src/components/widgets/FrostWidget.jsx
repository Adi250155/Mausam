function FrostWidget({ weather }) {
  const minTemp =
    weather?.daily?.temperature_2m_min?.[0];

  if (minTemp == null) {
    return (
      <div>
        <h3>Frost Risk</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  let risk = "Low";

  if (minTemp <= 4) {
    risk = "Moderate";
  }

  if (minTemp <= 0) {
    risk = "High";
  }

  return (
    <div>
      <h3>Frost Risk</h3>

      <h2>{risk}</h2>

      <p>
        Minimum temperature:{" "}
        {Math.round(minTemp)}°C
      </p>
    </div>
  );
}

export default FrostWidget;