import { useEffect, useState } from "react";

import {
  getSavedLocations,
} from "../../services/user/profileService";

function SavedLocations() {
  const [locations, setLocations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadLocations =
    async () => {
      try {
        const data =
          await getSavedLocations();

        setLocations(data);
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadLocations();
  }, []);

  if (loading) {
    return <p>Loading locations...</p>;
  }

  return (
    <div>
      <h1>
        Saved Locations
      </h1>

      {!locations.length && (
        <p>
          No saved locations yet.
        </p>
      )}

      {locations.map(
        (location) => (
          <div key={location.id}>
            <h3>
              {location.name}
            </h3>

            <p>
              {location.latitude},{" "}
              {location.longitude}
            </p>

            {location.is_primary && (
              <p>
                Primary location
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default SavedLocations;