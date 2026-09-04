function WaterTemperatureWidget({
  marine,
}) {
  const value =
    marine?.current?.sea_surface_temperature;

  return (
    <div>
      <h3>Water Temperature</h3>

      <h2>
        {value != null
          ? `${value.toFixed(1)}°C`
          : "—"}
      </h2>
    </div>
  );
}

export default WaterTemperatureWidget;