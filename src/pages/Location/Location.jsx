import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCurrentLocation,
  searchLocations,
} from "../../services/location/locationService";

import { saveLocation } from "../../services/user/profileService";

function Location() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [loadingCurrent, setLoadingCurrent] =
    useState(false);

  const [loadingSearch, setLoadingSearch] =
    useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCurrentLocation = async () => {
    try {
      setLoadingCurrent(true);
      setError("");

      const location = await getCurrentLocation();

      setSelectedLocation({
        name: "Current Location",
        latitude: location.latitude,
        longitude: location.longitude,
      });
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
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!search.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoadingSearch(true);
      setError("");

      const locations =
        await searchLocations(search);

      setResults(locations);
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
      setLoadingSearch(false);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setResults([]);
    setSearch(location.name);
  };

  const handleContinue = async () => {
    if (!selectedLocation) {
      setError(
        "Please select a location first."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await saveLocation(selectedLocation);

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
  };

  return (
    <div>
      <h1>Choose Your Location</h1>

      <p>
        Select your current location or search
        for a city.
      </p>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={loadingCurrent}
      >
        {loadingCurrent
          ? "Getting location..."
          : "Use Current Location"}
      </button>

      <hr />

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search city"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button
          type="submit"
          disabled={loadingSearch}
        >
          {loadingSearch
            ? "Searching..."
            : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div>
          <h3>Search Results</h3>

          {results.map(
            (location, index) => (
              <button
                type="button"
                key={`${location.latitude}-${location.longitude}-${index}`}
                onClick={() =>
                  handleSelectLocation(
                    location
                  )
                }
              >
                {location.name}
              </button>
            )
          )}
        </div>
      )}

      {selectedLocation && (
        <div>
          <h3>Selected Location</h3>

          <p>
            {selectedLocation.name}
          </p>

          <p>
            Latitude:{" "}
            {selectedLocation.latitude}
          </p>

          <p>
            Longitude:{" "}
            {selectedLocation.longitude}
          </p>
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/onboarding")
          }
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={
            !selectedLocation || saving
          }
        >
          {saving
            ? "Saving..."
            : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default Location;