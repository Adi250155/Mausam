export function getWeatherDescription(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Light showers",
    81: "Moderate showers",
    82: "Heavy showers",
    95: "Thunderstorm",
    96: "Thunderstorm + hail",
    99: "Severe thunderstorm",
  };

  return map[code] || "Unknown";
}

export function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return "🌧️";
  }
  if ([71, 73, 75].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}

export function getAqiStatus(aqi) {
  if (aqi == null) return "Unavailable";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Poor";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export function getComfortIndex({
  temperature,
  humidity,
  wind,
  rainProbability,
}) {
  let score = 100;

  const tempPenalty = Math.abs(24 - temperature) * 3;
  score -= tempPenalty;

  if (humidity > 70) {
    score -= (humidity - 70) * 0.6;
  }

  if (wind > 25) {
    score -= (wind - 25) * 0.8;
  }

  if (rainProbability > 40) {
    score -= (rainProbability - 40) * 0.7;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(score))
  );
}

export function getRainAlert(weather) {
  const daily = weather?.daily;

  if (!daily) return null;

  const probability =
    daily.precipitation_probability_max?.[0] ?? 0;

  const amount =
    daily.precipitation_sum?.[0] ?? 0;

  if (probability >= 70 || amount >= 20) {
    return {
      severity: "high",
      title: "Heavy Rain Possible",
      message: `${probability}% rain probability today.`,
    };
  }

  if (probability >= 40) {
    return {
      severity: "medium",
      title: "Rain Possible",
      message: `${probability}% rain probability today.`,
    };
  }

  return null;
}