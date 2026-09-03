function AqiWidget() {
  const aqi = 62;

  let status = "Good";

  if (aqi > 50 && aqi <= 100) {
    status = "Moderate";
  } else if (aqi > 100) {
    status = "Poor";
  }

  return (
    <div>
      <h3>Air Quality</h3>
      <h2>{aqi}</h2>
      <p>{status}</p>
    </div>
  );
}

export default AqiWidget;