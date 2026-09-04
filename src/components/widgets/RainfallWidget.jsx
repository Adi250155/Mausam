function RainfallWidget({ weather }) {
  const amount =
    weather?.daily?.precipitation_sum?.[0];

  return (
    <div>
      <h3>Rainfall Forecast</h3>

      <h2>
        {amount != null
          ? `${amount.toFixed(1)} mm`
          : "—"}
      </h2>

      <p>
        Expected precipitation today
      </p>
    </div>
  );
}

export default RainfallWidget;