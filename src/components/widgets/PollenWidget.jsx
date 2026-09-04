function PollenWidget({ airQuality }) {
  const current =
    airQuality?.current;

  const hourly =
    airQuality?.hourly;

  const pollen = {
    grass:
      hourly?.grass_pollen?.[0] ?? null,

    birch:
      hourly?.birch_pollen?.[0] ?? null,

    mugwort:
      hourly?.mugwort_pollen?.[0] ?? null,

    olive:
      hourly?.olive_pollen?.[0] ?? null,
  };

  const values = Object.values(pollen).filter(
    (value) => value != null
  );

  const maxPollen = values.length
    ? Math.max(...values)
    : null;

  let level = "Low";

  if (maxPollen != null && maxPollen >= 10) {
    level = "Moderate";
  }

  if (maxPollen != null && maxPollen >= 50) {
    level = "High";
  }

  return (
    <div>
      <h3>Pollen</h3>

      <h2>{level}</h2>

      {pollen.grass != null && (
        <p>
          Grass: {pollen.grass.toFixed(1)}
        </p>
      )}

      {pollen.birch != null && (
        <p>
          Birch: {pollen.birch.toFixed(1)}
        </p>
      )}

      {pollen.mugwort != null && (
        <p>
          Mugwort:{" "}
          {pollen.mugwort.toFixed(1)}
        </p>
      )}

      {pollen.olive != null && (
        <p>
          Olive:{" "}
          {pollen.olive.toFixed(1)}
        </p>
      )}

      {!values.length && (
        <p>Pollen data unavailable.</p>
      )}
    </div>
  );
}

export default PollenWidget;