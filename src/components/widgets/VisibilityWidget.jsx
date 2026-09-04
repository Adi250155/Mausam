function VisibilityWidget({ weather }) {
  const visibility =
    weather?.current?.visibility;

  if (visibility == null) {
    return (
      <div>
        <h3>Visibility</h3>
        <p>Unavailable</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Visibility</h3>

      <h2>
        {(visibility / 1000).toFixed(1)} km
      </h2>
    </div>
  );
}

export default VisibilityWidget;