const CACHE_PREFIX =
  "mausam_weather_cache_";

const DEFAULT_TTL =
  10 * 60 * 1000;

function createCacheKey(
  latitude,
  longitude,
  type
) {
  const lat =
    Number(latitude).toFixed(3);

  const lon =
    Number(longitude).toFixed(3);

  return `${CACHE_PREFIX}${type}_${lat}_${lon}`;
}

export function setWeatherCache(
  latitude,
  longitude,
  data,
  type = "weather",
  ttl = DEFAULT_TTL
) {
  try {
    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return false;
    }

    const key = createCacheKey(
      latitude,
      longitude,
      type
    );

    const now = Date.now();

    const payload = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    };

    localStorage.setItem(
      key,
      JSON.stringify(payload)
    );

    return true;
  } catch (error) {
    console.warn(
      "Weather cache save failed:",
      error
    );

    return false;
  }
}

export function getWeatherCache(
  latitude,
  longitude,
  type = "weather"
) {
  try {
    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return null;
    }

    const key = createCacheKey(
      latitude,
      longitude,
      type
    );

    const raw =
      localStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const payload =
      JSON.parse(raw);

    if (
      !payload ||
      !payload.expiresAt
    ) {
      localStorage.removeItem(key);
      return null;
    }

    if (
      Date.now() >
      payload.expiresAt
    ) {
      localStorage.removeItem(key);
      return null;
    }

    return payload.data || null;
  } catch (error) {
    console.warn(
      "Weather cache read failed:",
      error
    );

    return null;
  }
}

export function clearWeatherCache(
  latitude,
  longitude,
  type = "weather"
) {
  try {
    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return false;
    }

    const key = createCacheKey(
      latitude,
      longitude,
      type
    );

    localStorage.removeItem(key);

    return true;
  } catch (error) {
    console.warn(
      "Weather cache clear failed:",
      error
    );

    return false;
  }
}

export function clearAllWeatherCache() {
  try {
    if (
      typeof window === "undefined" ||
      !window.localStorage
    ) {
      return false;
    }

    const keys = [];

    for (
      let index = 0;
      index < localStorage.length;
      index++
    ) {
      const key =
        localStorage.key(index);

      if (
        key?.startsWith(
          CACHE_PREFIX
        )
      ) {
        keys.push(key);
      }
    }

    keys.forEach((key) =>
      localStorage.removeItem(key)
    );

    return true;
  } catch (error) {
    console.warn(
      "All weather cache clear failed:",
      error
    );

    return false;
  }
}