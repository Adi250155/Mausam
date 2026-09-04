import { useEffect, useState } from "react";

import {
  getSavedLocations,
} from "../../services/user/profileService";

import {
  getWeather,
} from "../../services/weather/weatherService";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "../../services/weather/weatherUtils";

function Explore() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExplore = async () => {
      try {
        const locations =
          await getSavedLocations();

        if (!locations.length) {
          throw new Error(
            "No saved location found."
          );
        }

        const primary =
          locations.find(
            (item) => item.is_primary
          ) || locations[0];

        setLocation(primary);

        const weather =
          await getWeather(
            primary.latitude,
            primary.longitude
          );

        setData(weather);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadExplore();
  }, []);

  if (loading) {
    return <p>Loading explore...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const current = data.current;

  return (
    <div>
      <h1>Explore</h1>

      <h2>{location.name}</h2>

      <h3>
        {getWeatherIcon(current.weather_code)}{" "}
        {Math.round(current.temperature_2m)}°C
      </h3>

      <p>
        {getWeatherDescription(
          current.weather_code
        )}
      </p>

      <p>
        Feels like{" "}
        {Math.round(
          current.apparent_temperature
        )}
        °C
      </p>

      <p>
        Humidity:{" "}
        {current.relative_humidity_2m}%
      </p>

      <p>
        Wind:{" "}
        {Math.round(
          current.wind_speed_10m
        )} km/h
      </p>

      <h2>7 Day Forecast</h2>

      {data.daily.time.map(
        (day, index) => (
          <div key={day}>
            <strong>{day}</strong>

            <p>
              {
                getWeatherDescription(
                  data.daily
                    .weather_code[index]
                )
              }
            </p>

            <p>
              High:{" "}
              {
                Math.round(
                  data.daily
                    .temperature_2m_max[index]
                )
              }
              °C
            </p>

            <p>
              Low:{" "}
              {
                Math.round(
                  data.daily
                    .temperature_2m_min[index]
                )
              }
              °C
            </p>

            <p>
              Rain:{" "}
              {
                data.daily
                  .precipitation_probability_max[index]
              }%
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default Explore;