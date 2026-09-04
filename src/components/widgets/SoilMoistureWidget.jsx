function SoilMoistureWidget({ weather }) {
  const value =
    weather?.hourly
      ?.soil_moisture_0_to_1cm?.[0];

  if (value == null) {
    return (
      <div>
        <h3>Soil Moisture</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Soil Moisture</h3>

      <h2>
        {(value * 100).toFixed(0)}%
      </h2>

      <p>
        Surface soil moisture estimate
      </p>
    </div>
  );
}

export default SoilMoistureWidget;