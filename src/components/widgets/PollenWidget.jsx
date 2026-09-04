function getPollenValue(
  airQuality
) {
  const hourly =
    airQuality?.hourly;

  if (!hourly) {
    return null;
  }

  const values = [
    hourly.grass_pollen?.[0],
    hourly.birch_pollen?.[0],
    hourly.mugwort_pollen?.[0],
    hourly.olive_pollen?.[0],
  ].filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      Number.isFinite(
        Number(value)
      )
  );

  if (!values.length) {
    return null;
  }

  return Math.max(
    ...values.map(Number)
  );
}

function getPollenStatus(
  value
) {
  if (value == null) {
    return "Unavailable";
  }

  if (value < 10) {
    return "Low";
  }

  if (value < 50) {
    return "Moderate";
  }

  if (value < 100) {
    return "High";
  }

  return "Very High";
}

function PollenWidget({
  airQuality,
}) {
  const value =
    getPollenValue(
      airQuality
    );

  const status =
    getPollenStatus(
      value
    );

  return (
    <section>
      <h2>
        Pollen
      </h2>

      <h1>
        {status}
      </h1>

      {value == null ? (
        <p>
          Pollen data unavailable.
        </p>
      ) : (
        <p>
          Estimated pollen level:
          {" "}
          {value}
        </p>
      )}
    </section>
  );
}

export default PollenWidget;