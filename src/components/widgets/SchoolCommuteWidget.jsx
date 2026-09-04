function SchoolCommuteWidget({ weather }) {
  const probability =
    weather?.hourly
      ?.precipitation_probability?.[0] ?? 0;

  const visibility =
    weather?.current?.visibility ?? 10000;

  const safe =
    probability < 50 &&
    visibility >= 3000;

  return (
    <div>
      <h3>School Commute</h3>

      <h2>
        {safe
          ? "Favorable"
          : "Take Caution"}
      </h2>

      <p>
        Rain probability:{" "}
        {Math.round(probability)}%
      </p>

      <p>
        Visibility:{" "}
        {(visibility / 1000).toFixed(1)} km
      </p>
    </div>
  );
}

export default SchoolCommuteWidget;