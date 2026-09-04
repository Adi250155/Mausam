import {
  generateAlerts,
} from "../../features/alerts/alertEngine";

function AlertWidget({
  type = "Weather Alert",
  weather,
}) {
  const alerts =
    generateAlerts(weather);

  let filteredAlerts =
    alerts;

  if (type === "Heat Alert") {
    filteredAlerts =
      alerts.filter(
        (alert) =>
          alert.type === "heat"
      );
  }

  if (type === "Rain Alert") {
    filteredAlerts =
      alerts.filter(
        (alert) =>
          alert.type === "rain"
      );
  }

  if (
    type === "Weather Alert" ||
    type === "Severe Weather"
  ) {
    filteredAlerts =
      alerts;
  }

  return (
    <section>
      <h2>{type}</h2>

      {filteredAlerts.length === 0 ? (
        <p>
          No active alert.
        </p>
      ) : (
        filteredAlerts.map(
          (alert, index) => (
            <article
              key={`${alert.type}-${index}`}
            >
              <h3>
                {alert.title}
              </h3>

              <p>
                {alert.message}
              </p>

              <small>
                Severity:{" "}
                {alert.severity}
              </small>
            </article>
          )
        )
      )}
    </section>
  );
}

export default AlertWidget;