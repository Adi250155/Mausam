import { useEffect, useMemo, useState } from "react";

import {
  getUserPreferences,
  getSavedLocations,
} from "../../services/user/profileService";

import {
  getWeather,
  getAirQuality,
  getMarineWeather,
} from "../../services/weather/weatherService";

import { getPersonalizedWidgets } from "../../personalization/widgetEngine";

import WidgetRenderer from "../../components/widgets/WidgetRenderer";
import LogoutButton from "../../components/auth/LogoutButton";

function Home() {
  const [preferences, setPreferences] = useState(null);
  const [location, setLocation] = useState(null);

  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [marine, setMarine] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          preferencesData,
          locationsData,
        ] = await Promise.all([
          getUserPreferences(),
          getSavedLocations(),
        ]);

        if (!preferencesData) {
          throw new Error(
            "Complete personalization first."
          );
        }

        if (!locationsData?.length) {
          throw new Error(
            "No saved location found."
          );
        }

        const primary =
          locationsData.find(
            (item) => item.is_primary
          ) || locationsData[0];

        setPreferences(preferencesData);
        setLocation(primary);

        const categories =
          preferencesData.interests || [];

        // Weather + AQI are essential
        const [weatherResult, airResult] =
          await Promise.allSettled([
            getWeather(
              primary.latitude,
              primary.longitude
            ),
            getAirQuality(
              primary.latitude,
              primary.longitude
            ),
          ]);

        if (
          weatherResult.status === "rejected"
        ) {
          throw weatherResult.reason;
        }

        setWeather(weatherResult.value);

        if (airResult.status === "fulfilled") {
          setAirQuality(airResult.value);
        } else {
          console.warn(
            "AQI unavailable:",
            airResult.reason
          );
          setAirQuality(null);
        }

        // Marine data is optional
        if (categories.includes("beach")) {
          try {
            const marineData =
              await getMarineWeather(
                primary.latitude,
                primary.longitude
              );

            setMarine(marineData);
          } catch (marineError) {
            console.warn(
              "Marine data unavailable:",
              marineError
            );

            setMarine(null);
          }
        }
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const categories =
    preferences?.interests || [];

  const widgets = useMemo(
    () =>
      getPersonalizedWidgets(
        categories,
        weather
      ),
    [categories, weather]
  );

  if (loading) {
    return (
      <div>
        <h1>Loading Mausam...</h1>
        <p>Getting your personalized weather.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Something went wrong</h1>
        <p>{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>

        <LogoutButton />
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Mausam</h1>

        <h2>
          {location?.name || "Your Location"}
        </h2>

        <p>
          Personalized for{" "}
          {categories.length
            ? categories.join(", ")
            : "you"}
        </p>
      </header>

      <main>
        {widgets.length > 0 ? (
          widgets.map((widget) => (
            <WidgetRenderer
              key={widget}
              widget={widget}
              weather={weather}
              airQuality={airQuality}
              marine={marine}
            />
          ))
        ) : (
          <p>
            No personalized widgets available.
          </p>
        )}
      </main>

      <footer>
        <LogoutButton />
      </footer>
    </div>
  );
}

export default Home;