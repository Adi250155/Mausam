function UvWidget({
  weather,
  airQuality,
}) {
  const weatherUv =
    weather?.daily?.uv_index_max?.[0];

  const airUv =
    airQuality?.current?.uv_index;

  const uv = weatherUv ?? airUv;

  if (uv == null) {
    return (
      <div>
        <h3>UV Index</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  let status = "Low";

  if (uv >= 3 && uv < 6) {
    status = "Moderate";
  } else if (uv >= 6 && uv < 8) {
    status = "High";
  } else if (uv >= 8 && uv < 11) {
    status = "Very High";
  } else if (uv >= 11) {
    status = "Extreme";
  }

  return (
    <div>
      <h3>UV Index</h3>
      <h2>{uv.toFixed(1)}</h2>
      <p>{status}</p>
    </div>
  );
}

export default UvWidget;