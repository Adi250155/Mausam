import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCurrentLocation,
  searchLocations,
} from "../../services/location/locationService";

import {
  saveLocation,
} from "../../services/user/profileService";

function Location() {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [loadingCurrent, setLoadingCurrent] =
    useState(false);

  const [loadingSearch, setLoadingSearch] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setError("");
  }, []);

  async function handleCurrentLocation() {
    try {
      setLoadingCurrent(true);
      setError("");

      const location =
        await getCurrentLocation();

      setSelectedLocation({
        name: "Current Location",
        latitude:
          location.latitude,
        longitude:
          location.longitude,
        accuracy:
          location.accuracy,
      });

      setResults([]);
      setSearch("");
    } catch (err) {
      console.error(
        "Current location error:",
        err
      );

      setError(
        err.message ||
          "Unable to get your current location."
      );
    } finally {
      setLoadingCurrent(false);
    }
  }

  async function handleSearch(
    event
  ) {
    event.preventDefault();

    if (!search.trim()) {
      setResults([]);
      setError(
        "Enter a city or place name."
      );
      return;
    }

    try {
      setLoadingSearch(true);
      setError("");

      const locations =
        await searchLocations(
          search
        );

      if (!locations.length) {
        setResults([]);
        setError(
          "No matching locations found."
        );
        return;
      }

      setResults(
        locations
      );
    } catch (err) {
      console.error(
        "Location search error:",
        err
      );

      setError(
        err.message ||
          "Unable to search locations."
      );
    } finally {
      setLoadingSearch(
        false
      );
    }
  }

  function handleSelectLocation(
    location
  ) {
    setSelectedLocation(
      location
    );

    setResults([]);

    setSearch(
      location.name
    );

    setError("");
  }

  async function handleContinue() {
    if (!selectedLocation) {
      setError(
        "Please select a location first."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await saveLocation(
        selectedLocation
      );

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Save location error:",
        err
      );

      setError(
        err.message ||
          "Unable to save your location."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <header>
        <p>
          Step 2 of 2
        </p>

        <progress
          value="2"
          max="2"
        />

        <h1>
          Where are you?
        </h1>

        <p>
          Mausam uses your location to
          provide relevant weather
          information.
        </p>
      </header>

      <main>
        <section>
          <button
            type="button"
            onClick={
              handleCurrentLocation
            }
            disabled={
              loadingCurrent ||
              saving
            }
          >
            {loadingCurrent
              ? "Getting your location..."
              : "📍 Use Current Location"}
          </button>
        </section>

        <section>
          <h2>
            Search a place
          </h2>

          <form
            onSubmit={
              handleSearch
            }
          >
            <input
              type="search"
              placeholder="Search city, town or place"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={
                loadingSearch ||
                saving
              }
            >
              {loadingSearch
                ? "Searching..."
                : "Search"}
            </button>
          </form>
        </section>

        {results.length > 0 && (
          <section>
            <h2>
              Search Results
            </h2>

            {results.map(
              (
                location,
                index
              ) => (
                <article
                  key={`${location.latitude}-${location.longitude}-${index}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectLocation(
                        location
                      )
                    }
                  >
                    <strong>
                      {
                        location.name
                      }
                    </strong>

                    <br />

                    <small>
                      {[
                        location.state,
                        location.country,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        )}
                    </small>
                  </button>
                </article>
              )
            )}
          </section>
        )}

        {selectedLocation && (
          <section>
            <h2>
              Selected Location
            </h2>

            <article>
              <h3>
                {
                  selectedLocation.name
                }
              </h3>

              <p>
                Latitude:{" "}
                {
                  selectedLocation.latitude
                }
              </p>

              <p>
                Longitude:{" "}
                {
                  selectedLocation.longitude
                }
              </p>

              {selectedLocation.accuracy && (
                <p>
                  GPS accuracy:{" "}
                  {
                    Math.round(
                      selectedLocation.accuracy
                    )
                  }{" "}
                  m
                </p>
              )}
            </article>
          </section>
        )}

        {error && (
          <section>
            <p>
              {error}
            </p>
          </section>
        )}
      </main>

      <footer>
        <button
          type="button"
          onClick={() =>
            navigate(
              "/onboarding"
            )
          }
          disabled={saving}
        >
          Back
        </button>

        <button
          type="button"
          onClick={
            handleContinue
          }
          disabled={
            !selectedLocation ||
            saving
          }
        >
          {saving
            ? "Saving..."
            : "Continue to Mausam"}
        </button>
      </footer>
    </div>
  );
}

export default Location;