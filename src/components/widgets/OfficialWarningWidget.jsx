function OfficialWarningWidget({
  weather,
}) {
  const warnings =
    weather?.warnings || [];

  return (
    <section>
      <h2>
        IMD Official Warnings
      </h2>

      {warnings.length === 0 ? (
        <p>
          No active IMD warning available.
        </p>
      ) : (
        warnings.map(
          (warning, index) => (
            <article
              key={
                warning.id ||
                `warning-${index}`
              }
            >
              <h3>
                {warning.title}
              </h3>

              {warning.message && (
                <p>
                  {warning.message}
                </p>
              )}

              {warning.area && (
                <p>
                  Area:{" "}
                  {warning.area}
                </p>
              )}

              {warning.startTime && (
                <p>
                  Starts:{" "}
                  {warning.startTime}
                </p>
              )}

              {warning.endTime && (
                <p>
                  Ends:{" "}
                  {warning.endTime}
                </p>
              )}

              <small>
                Source: IMD
              </small>
            </article>
          )
        )
      )}
    </section>
  );
}

export default OfficialWarningWidget;