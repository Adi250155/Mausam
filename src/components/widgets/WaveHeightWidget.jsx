function WaveHeightWidget({ marine }) {
  const value =
    marine?.current?.wave_height;

  return (
    <div>
      <h3>Wave Height</h3>

      <h2>
        {value != null
          ? `${value.toFixed(1)} m`
          : "—"}
      </h2>
    </div>
  );
}

export default WaveHeightWidget;