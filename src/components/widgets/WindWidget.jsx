function WindWidget({ weather }) {
  const current = weather?.current;

  if (!current) {
    return (
      <div>
        <h3>Wind</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Wind</h3>

      <h2>
        {Math.round(current.wind_speed_10m)} km/h
      </h2>

      <p>
        Direction:{" "}
        {Math.round(current.wind_direction_10m)}°
      </p>
    </div>
  );
}

export default WindWidget;