import {
  generateAlerts,
} from "../../features/alerts/alertEngine";

function AlertWidget({
  type = "Weather Alert",
  weather,
}) {
  const alerts =
    generateAlerts(weather);

  const matchingAlert =
    alerts.find((alert) => {
      if (
        type.toLowerCase().includes("rain")
      ) {
        return alert.type === "rain";
      }

      if (
        type.toLowerCase().includes("heat")
      ) {
        return alert.type === "heat";
      }

      return true;
    });

  return (
    <div>
      <h3>{type}</h3>

      {matchingAlert ? (
        <>
          <h4>
            {matchingAlert.title}
          </h4>

          <p>
            {matchingAlert.message}
          </p>
        </>
      ) : (
        <p>No active alert.</p>
      )}
    </div>
  );
}

export default AlertWidget;