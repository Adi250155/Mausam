function SunWidget({ weather }) {
  const sunrise =
    weather?.daily?.sunrise?.[0];

  const sunset =
    weather?.daily?.sunset?.[0];

  if (!sunrise || !sunset) {
    return (
      <div>
        <h3>Sunrise & Sunset</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  const formatTime = (value) =>
    new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div>
      <h3>Sunrise & Sunset</h3>

      <p>
        Sunrise: {formatTime(sunrise)}
      </p>

      <p>
        Sunset: {formatTime(sunset)}
      </p>
    </div>
  );
}

export default SunWidget;