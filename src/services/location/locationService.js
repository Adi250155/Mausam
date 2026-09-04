const GEOCODING_API =
  "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Get the user's current geographic coordinates.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser."
        )
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        resolve({
          latitude,
          longitude,
          accuracy,
        });
      },
      (error) => {
        let message =
          "Unable to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission was denied.";
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            message =
              "Location request timed out.";
            break;

          default:
            message =
              "Unable to determine your location.";
        }

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

/**
 * Convert coordinates into a readable location.
 */
export async function reverseGeocode(
  latitude,
  longitude
) {
  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "Latitude and longitude are required."
    );
  }

  return {
    name: "Current Location",
    state: "",
    country: "",
    latitude,
    longitude,
  };
}

/**
 * Search cities / places using Open-Meteo
 * Geocoding API.
 */
export async function searchLocations(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    name: query.trim(),
    count: "8",
    language: "en",
    format: "json",
  });

  try {
    const response = await fetch(
      `${GEOCODING_API}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Location search failed with status ${response.status}.`
      );
    }

    const data = await response.json();

    return (data.results || []).map(
      (place) => ({
        name: [
          place.name,
          place.admin2,
          place.admin1,
          place.country,
        ]
          .filter(Boolean)
          .join(", "),

        latitude: Number(place.latitude),
        longitude: Number(place.longitude),

        country: place.country || "",
        state: place.admin1 || "",
        timezone: place.timezone || "",
        countryCode: place.country_code || "",
        population: place.population || null,
      })
    );
  } catch (error) {
    console.error(
      "Location search error:",
      error
    );

    throw new Error(
      "Unable to search locations."
    );
  }
}