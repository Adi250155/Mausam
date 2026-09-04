function RainWidget({ weather }) {
  const probability =
    weather?.daily?.precipitation_probability_max?.[0];

  const amount =
    weather?.daily?.precipitation_sum?.[0];

  return (
    <div>
      <h3>Rain Probability</h3>

      <h2>
        {probability != null
          ? `${Math.round(probability)}%`
          : "—"}
      </h2>

      <p>
        Expected rainfall:{" "}
        {amount != null
          ? `${amount.toFixed(1)} mm`
          : "—"}
      </p>
    </div>
  );
}

export default RainWidget;