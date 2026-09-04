function SeaConditionWidget({ marine }) {
  const waveHeight =
    marine?.current?.wave_height;

  let condition = "Unavailable";

  if (waveHeight != null) {
    if (waveHeight < 0.5) {
      condition = "Calm";
    } else if (waveHeight < 1.5) {
      condition = "Moderate";
    } else if (waveHeight < 2.5) {
      condition = "Rough";
    } else {
      condition = "Very Rough";
    }
  }

  return (
    <div>
      <h3>Sea Condition</h3>

      <h2>{condition}</h2>

      {waveHeight != null && (
        <p>
          Wave height:{" "}
          {waveHeight.toFixed(1)} m
        </p>
      )}
    </div>
  );
}

export default SeaConditionWidget;