function FogWidget({ weather }) {
  const code =
    weather?.current?.weather_code;

  const visibility =
    weather?.current?.visibility;

  const fog =
    [45, 48].includes(code) ||
    (visibility != null &&
      visibility < 2000);

  return (
    <div>
      <h3>Fog Alert</h3>

      <h2>
        {fog ? "Possible" : "No Alert"}
      </h2>
    </div>
  );
}

export default FogWidget;