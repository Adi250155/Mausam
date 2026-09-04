/**
 * IMD location mapping layer.
 *
 * Converts latitude/longitude into an appropriate
 * IMD station and district identifier.
 *
 * We deliberately do NOT guess station IDs.
 */

export async function findIMDLocation(
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

  /*
   * TODO:
   * Connect verified IMD station/district mapping.
   *
   * Until then, return null so that Open-Meteo
   * continues working as the fallback provider.
   */
  return null;
}