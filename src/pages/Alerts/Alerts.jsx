import { useCallback, useEffect, useState } from "react";

import BottomNavigation from "../../components/navigation/BottomNavigation";

import {
  getWeather,
  getAirQuality,
} from "../../services/weather/weatherService";

import {
  getCurrentLocation,
} from "../../services/location/locationService";

import {
  generateAlerts,
} from "../../features/alerts/alertEngine";

import {
  getAlertPreferences,
  saveAlertPreferences,
} from "../../services/user/alertPreferenceService";

const DEFAULT_PREFERENCES = {
  rain: true,
  storm: true,
  heat: true,
  aqi: true,
  uv: true,
  visibility: true,
};

function Alerts() {
  const [weather, setWeather] =
    useState(null);

  const [airQuality, setAirQuality] =
    useState(null);

  const [preferences, setPreferences] =
    useState(DEFAULT_PREFERENCES);

  const [alerts, setAlerts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadAlerts = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const location =
          await getCurrentLocation();

        if (!location) {
          throw new Error(
            "Location is unavailable."
          );
        }

        const [
          weatherData,
          airData,
          preferenceData,
        ] = await Promise.all([
          getWeather(
            location.latitude,
            location.longitude
          ),
          getAirQuality(
            location.latitude,
            location.longitude
          ),
          getAlertPreferences(),
        ]);

        setWeather(weatherData);
        setAirQuality(airData);

        const mergedPreferences = {
          ...DEFAULT_PREFERENCES,
          ...preferenceData,
        };

        setPreferences(
          mergedPreferences
        );

        const generatedAlerts =
          generateAlerts(
            weatherData,
            airData,
            mergedPreferences
          );

        setAlerts(
          generatedAlerts
        );
      } catch (loadError) {
        console.error(
          "Alerts loading failed:",
          loadError
        );

        setError(
          loadError?.message ||
            "Unable to load alerts."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  async function handleToggle(
    key
  ) {
    const nextPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(
      nextPreferences
    );

    try {
      setSaving(true);

      const saved =
        await saveAlertPreferences(
          nextPreferences
        );

      setPreferences({
        ...DEFAULT_PREFERENCES,
        ...saved,
      });

      const updatedAlerts =
        generateAlerts(
          weather,
          airQuality,
          saved
        );

      setAlerts(
        updatedAlerts
      );
    } catch (saveError) {
      console.error(
        "Alert preference save failed:",
        saveError
      );

      setPreferences(
        preferences
      );

      setError(
        saveError?.message ||
          "Unable to save alert preference."
      );
    } finally {
      setSaving(false);
    }
  }

  function getAlertIcon(type) {
    const icons = {
      rain: "🌧️",
      storm: "⛈️",
      wind: "💨",
      visibility: "🌫️",
      heat: "🔥",
      aqi: "😷",
    };

    return (
      icons[type] ||
      "⚠️"
    );
  }

  function getSeverityClass(
    severity
  ) {
    return `alert-item alert-${severity || "medium"}`;
  }

  return (
    <div className="mausam-page">
      <header className="page-header">
        <div>
          <span className="weather-eyebrow">
            MAUSAM ALERTS
          </span>

          <h1>
            Weather Alerts
          </h1>

          <p>
            Important weather changes
            for your location.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadAlerts}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </header>

      <main className="page-content alerts-page">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <section className="settings-card">
            <div className="loading-state">
              Checking current weather
              conditions...
            </div>
          </section>
        ) : (
          <>
            <section className="settings-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">
                    LIVE STATUS
                  </span>

                  <h2>
                    Active Alerts
                  </h2>
                </div>

                <span className="alert-count">
                  {alerts.length}
                </span>
              </div>

              {!alerts.length ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    ✅
                  </div>

                  <h3>
                    No active alerts
                  </h3>

                  <p>
                    Weather conditions look
                    normal for your current
                    location.
                  </p>
                </div>
              ) : (
                <div className="alerts-list">
                  {alerts.map(
                    (alert, index) => (
                      <article
                        key={`${alert.type}-${index}`}
                        className={getSeverityClass(
                          alert.severity
                        )}
                      >
                        <div className="alert-icon">
                          {getAlertIcon(
                            alert.type
                          )}
                        </div>

                        <div className="alert-content">
                          <div className="alert-title-row">
                            <h3>
                              {alert.title}
                            </h3>

                            <span className="alert-severity">
                              {alert.severity}
                            </span>
                          </div>

                          <p>
                            {alert.message ||
                              alert.description ||
                              "Weather conditions require attention."}
                          </p>
                        </div>
                      </article>
                    )
                  )}
                </div>
              )}
            </section>

            <section className="settings-card">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">
                    PERSONALIZATION
                  </span>

                  <h2>
                    Alert Preferences
                  </h2>

                  <p>
                    Choose which conditions
                    Mausam should monitor.
                  </p>
                </div>
              </div>

              <div className="alert-settings-list">
                <div className="alert-setting">
                  <div>
                    <strong>
                      🌧️ Rain
                    </strong>

                    <span>
                      Rain and heavy rainfall
                      warnings
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.rain
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "rain"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle rain alerts"
                  >
                    <span />
                  </button>
                </div>

                <div className="alert-setting">
                  <div>
                    <strong>
                      ⛈️ Storm
                    </strong>

                    <span>
                      Thunderstorm and severe
                      weather warnings
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.storm
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "storm"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle storm alerts"
                  >
                    <span />
                  </button>
                </div>

                <div className="alert-setting">
                  <div>
                    <strong>
                      🔥 Heat
                    </strong>

                    <span>
                      Extreme temperature
                      warnings
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.heat
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "heat"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle heat alerts"
                  >
                    <span />
                  </button>
                </div>

                <div className="alert-setting">
                  <div>
                    <strong>
                      😷 Air Quality
                    </strong>

                    <span>
                      Poor AQI notifications
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.aqi
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "aqi"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle AQI alerts"
                  >
                    <span />
                  </button>
                </div>

                <div className="alert-setting">
                  <div>
                    <strong>
                      🌫️ Visibility
                    </strong>

                    <span>
                      Fog and low visibility
                      warnings
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.visibility
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "visibility"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle visibility alerts"
                  >
                    <span />
                  </button>
                </div>

                <div className="alert-setting">
                  <div>
                    <strong>
                      ☀️ UV
                    </strong>

                    <span>
                      High UV exposure
                      warnings
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`toggle ${
                      preferences.uv
                        ? "toggle-on"
                        : ""
                    }`}
                    onClick={() =>
                      handleToggle(
                        "uv"
                      )
                    }
                    disabled={saving}
                    aria-label="Toggle UV alerts"
                  >
                    <span />
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default Alerts;