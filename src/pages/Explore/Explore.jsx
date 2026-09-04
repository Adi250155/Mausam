import {
  useEffect,
  useState,
} from "react";

import {
  getSavedLocations,
} from "../../services/user/profileService";

import {
  getWeather,
  getAirQuality,
} from "../../services/weather/weatherService";

import {
  getTravelRisk,
  getBestRunningTime,
} from "../../features/recommendations/recommendationEngine";

import BottomNavigation from "../../components/navigation/BottomNavigation";

function Explore() {
  const [
    locations,
    setLocations,
  ] = useState([]);

  const [
    selectedLocation,
    setSelectedLocation,
  ] = useState(null);

  const [
    weather,
    setWeather,
  ] = useState(null);

  const [
    airQuality,
    setAirQuality,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function loadExplore() {
      try {
        setLoading(true);
        setError("");

        const saved =
          await getSavedLocations();

        if (!saved?.length) {
          throw new Error(
            "No saved locations found."
          );
        }

        const primary =
          saved.find(
            (location) =>
              location.is_primary
          ) || saved[0];

        setLocations(saved);
        setSelectedLocation(primary);

        const [
          weatherData,
          airData,
        ] = await Promise.all([
          getWeather(
            primary.latitude,
            primary.longitude
          ),

          getAirQuality(
            primary.latitude,
            primary.longitude
          ),
        ]);

        setWeather(
          weatherData
        );

        setAirQuality(
          airData
        );
      } catch (err) {
        console.error(
          "Explore error:",
          err
        );

        setError(
          err.message ||
            "Unable to load explore data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadExplore();
  }, []);

  async function handleLocationChange(
    location
  ) {
    try {
      setSelectedLocation(
        location
      );

      setLoading(true);
      setError("");

      const [
        weatherData,
        airData,
      ] = await Promise.all([
        getWeather(
          location.latitude,
          location.longitude
        ),

        getAirQuality(
          location.latitude,
          location.longitude
        ),
      ]);

      setWeather(
        weatherData
      );

      setAirQuality(
        airData
      );
    } catch (err) {
      console.error(
        "Location weather error:",
        err
      );

      setError(
        err.message ||
          "Unable to load weather."
      );
    } finally {
      setLoading(false);
    }
  }

  if (
    loading &&
    !weather
  ) {
    return (
      <div>
        <h1>
          Explore
        </h1>

        <p>
          Loading weather...
        </p>

        <BottomNavigation />
      </div>
    );
  }

  if (
    error &&
    !weather
  ) {
    return (
      <div>
        <h1>
          Explore
        </h1>

        <p>
          {error}
        </p>

        <BottomNavigation />
      </div>
    );
  }

  const travel =
    getTravelRisk(
      weather
    );

  const running =
    getBestRunningTime(
      weather
    );

  const aqi =
    airQuality?.aqi;

  return (
    <div>
      <header>
        <h1>
          Explore
        </h1>

        <p>
          Weather insights for
          your saved locations.
        </p>
      </header>

      <section>
        <h2>
          Saved Locations
        </h2>

        {locations.map(
          (location) => (
            <button
              type="button"
              key={location.id}
              onClick={() =>
                handleLocationChange(
                  location
                )
              }
            >
              {location.name}

              {location.is_primary
                ? " • Primary"
                : ""}
            </button>
          )
        )}
      </section>

      {selectedLocation && (
        <section>
          <h2>
            {selectedLocation.name}
          </h2>

          <p>
            Weather source:{" "}
            {weather?.source
              ?.weather ||
              "Unavailable"}
          </p>

          <p>
            Air quality source:{" "}
            {airQuality?.source ||
              "Unavailable"}
          </p>
        </section>
      )}

      <section>
        <h2>
          Quick Insights
        </h2>

        <article>
          <h3>
            Travel
          </h3>

          <strong>
            {travel.score}/100
          </strong>

          <p>
            {travel.label}
          </p>
        </article>

        <article>
          <h3>
            Outdoor Workout
          </h3>

          <strong>
            {running.value}
          </strong>

          <p>
            {running.reason}
          </p>
        </article>

        <article>
          <h3>
            Air Quality
          </h3>

          <strong>
            {aqi ??
              "Unavailable"}
          </strong>

          <p>
            {aqi != null
              ? "Current AQI"
              : "AQI unavailable"}
          </p>
        </article>
      </section>

      {loading && (
        <p>
          Updating weather...
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}

      <BottomNavigation />
    </div>
  );
}

export default Explore;