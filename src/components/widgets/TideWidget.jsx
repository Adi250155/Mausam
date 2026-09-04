function TideWidget({ marine }) {
  const seaLevel =
    marine?.current?.sea_level_height_msl;

  return (
    <div>
      <h3>Sea Level / Tide</h3>

      <h2>
        {seaLevel != null
          ? `${seaLevel.toFixed(2)} m`
          : "—"}
      </h2>

      <p>
        Current sea-level estimate.
      </p>
    </div>
  );
}

export default TideWidget;