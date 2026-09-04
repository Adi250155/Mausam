import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getSavedLocations,
  setPrimaryLocation,
  deleteLocation,
} from "../../services/user/profileService";

import BottomNavigation from "../../components/navigation/BottomNavigation";

function SavedLocations() {
  const navigate =
    useNavigate();

  const [
    locations,
    setLocations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function loadLocations() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getSavedLocations();

      setLocations(
        data
      );
    } catch (err) {
      console.error(
        "Saved locations error:",
        err
      );

      setError(
        err.message ||
          "Unable to load saved locations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLocations();
  }, []);

  async function handleSetPrimary(
    locationId
  ) {
    try {
      setActionLoading(
        true
      );
      setError("");

      await setPrimaryLocation(
        locationId
      );

      await loadLocations();
    } catch (err) {
      console.error(
        "Set primary location error:",
        err
      );

      setError(
        err.message ||
          "Unable to change primary location."
      );
    } finally {
      setActionLoading(
        false
      );
    }
  }

  async function handleDelete(
    locationId
  ) {
    const confirmed =
      window.confirm(
        "Delete this saved location?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        true
      );
      setError("");

      await deleteLocation(
        locationId
      );

      await loadLocations();
    } catch (err) {
      console.error(
        "Delete location error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete location."
      );
    } finally {
      setActionLoading(
        false
      );
    }
  }

  if (loading) {
    return (
      <div>
        <h1>
          Saved Locations
        </h1>

        <p>
          Loading locations...
        </p>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>
          Saved Locations
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/location"
            )
          }
        >
          Add Location
        </button>
      </header>

      {error && (
        <p>{error}</p>
      )}

      {locations.length ===
      0 ? (
        <div>
          <p>
            No saved locations yet.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/location"
              )
            }
          >
            Add Your First
            Location
          </button>
        </div>
      ) : (
        <main>
          {locations.map(
            (location) => (
              <article
                key={
                  location.id
                }
              >
                <h2>
                  {location.name ||
                    "Saved Location"}
                </h2>

                <p>
                  {location.latitude},{" "}
                  {
                    location.longitude
                  }
                </p>

                {location.is_primary && (
                  <strong>
                    Primary Location
                  </strong>
                )}

                <div>
                  {!location.is_primary && (
                    <button
                      type="button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        handleSetPrimary(
                          location.id
                        )
                      }
                    >
                      Set Primary
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={
                      actionLoading ||
                      locations.length ===
                        1
                    }
                    onClick={() =>
                      handleDelete(
                        location.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          )}
        </main>
      )}

      <BottomNavigation />
    </div>
  );
}

export default SavedLocations;