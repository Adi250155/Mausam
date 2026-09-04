function HumidityWidget({ weather }) {
  const humidity =
    weather?.current?.relative_humidity_2m;

  return (
    <div>
      <h3>Humidity</h3>

      <h2>
        {humidity != null
          ? `${humidity}%`
          : "—"}
      </h2>
    </div>
  );
}

export default HumidityWidget;