import { useEffect, useState } from "react";

import {
  getSavedLocations,
} from "../../services/user/profileService";

import {
  getWeather,
} from "../../services/weather/weatherService";

import {
  generateAlerts,
} from "../../features/alerts/alertEngine";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        const locations =
          await getSavedLocations();

        if (!locations?.length) {
          throw new Error(
            "No saved location found."
          );
        }

        const primary =
          locations.find(
            (item) => item.is_primary
          ) || locations[0];

        const weather =
          await getWeather(
            primary.latitude,
            primary.longitude
          );

        const generatedAlerts =
          generateAlerts(weather);

        setAlerts(generatedAlerts);
      } catch (err) {
        console.error(
          "Alerts error:",
          err
        );

        setError(
          err.message ||
            "Unable to load alerts."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  if (loading) {
    return <h1>Loading alerts...</h1>;
  }

  if (error) {
    return (
      <div>
        <h1>Alerts</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Weather Alerts</h1>

      {alerts.length === 0 ? (
        <p>
          No significant weather alerts right now.
        </p>
      ) : (
        alerts.map((alert, index) => (
          <article
            key={`${alert.type}-${index}`}
          >
            <h2>{alert.title}</h2>

            <p>
              Severity: {alert.severity}
            </p>

            <p>{alert.message}</p>
          </article>
        ))
      )}
    </div>
  );
}

export default Alerts;