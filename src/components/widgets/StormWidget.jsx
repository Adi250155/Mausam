function StormWidget({ weather }) {
  const code =
    weather?.current?.weather_code;

  const storm =
    [95, 96, 99].includes(code);

  return (
    <div>
      <h3>Storm Alert</h3>

      <h2>
        {storm ? "Active" : "No Alert"}
      </h2>

      <p>
        {storm
          ? "Thunderstorm conditions detected."
          : "No thunderstorm conditions detected."}
      </p>
    </div>
  );
}

export default StormWidget;