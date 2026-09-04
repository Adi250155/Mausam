import {
  useEffect,
  useState,
} from "react";

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
  const [
    weatherAlerts,
    setWeatherAlerts,
  ] = useState([]);

  const [
    officialWarnings,
    setOfficialWarnings,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        setError("");

        const locations =
          await getSavedLocations();

        if (
          !locations?.length
        ) {
          throw new Error(
            "No saved location found."
          );
        }

        const primary =
          locations.find(
            (item) =>
              item.is_primary
          ) ||
          locations[0];

        const weather =
          await getWeather(
            primary.latitude,
            primary.longitude
          );

        setWeatherAlerts(
          generateAlerts(
            weather
          )
        );

        setOfficialWarnings(
          weather?.warnings || []
        );
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
    return (
      <h1>
        Loading alerts...
      </h1>
    );
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
      <h1>
        Weather Alerts
      </h1>

      <section>
        <h2>
          IMD Official Warnings
        </h2>

        {officialWarnings.length ===
        0 ? (
          <p>
            No active IMD warning
            available.
          </p>
        ) : (
          officialWarnings.map(
            (warning, index) => (
              <article
                key={
                  warning.id ||
                  `imd-${index}`
                }
              >
                <h3>
                  {warning.title}
                </h3>

                <p>
                  {warning.message}
                </p>

                {warning.area && (
                  <p>
                    Area:{" "}
                    {warning.area}
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

      <section>
        <h2>
          Mausam Weather Alerts
        </h2>

        {weatherAlerts.length ===
        0 ? (
          <p>
            No significant derived
            weather alerts right now.
          </p>
        ) : (
          weatherAlerts.map(
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
    </div>
  );
}

export default Alerts;