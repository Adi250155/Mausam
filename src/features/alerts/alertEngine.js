export function generateAlerts(weather) {
  const alerts = [];

  const current = weather?.current;
  const daily = weather?.daily;

  if (!current || !daily) {
    return alerts;
  }

  const rainProbability =
    daily.precipitation_probability_max?.[0] ?? 0;

  const rainAmount =
    daily.precipitation_sum?.[0] ?? 0;

  const windSpeed =
    current.wind_speed_10m ?? 0;

  const visibility =
    current.visibility ?? 10000;

  const temperature =
    current.temperature_2m ?? 25;

  const weatherCode =
    current.weather_code;

  if (
    rainProbability >= 70 ||
    rainAmount >= 20
  ) {
    alerts.push({
      type: "rain",
      severity: "high",
      title: "Heavy Rain Possible",
      message:
        "High probability of rain. Plan outdoor activities carefully.",
    });
  } else if (rainProbability >= 40) {
    alerts.push({
      type: "rain",
      severity: "medium",
      title: "Rain Possible",
      message:
        "Rain is possible today. Carry suitable protection.",
    });
  }

  if (windSpeed >= 45) {
    alerts.push({
      type: "wind",
      severity: "high",
      title: "Strong Wind",
      message:
        "Strong winds are expected. Exercise caution outdoors.",
    });
  }

  if (visibility < 2000) {
    alerts.push({
      type: "visibility",
      severity: "high",
      title: "Low Visibility",
      message:
        "Visibility is reduced. Travel carefully.",
    });
  }

  if (temperature >= 40) {
    alerts.push({
      type: "heat",
      severity: "high",
      title: "Extreme Heat",
      message:
        "Very high temperatures are expected. Stay hydrated and avoid prolonged exposure.",
    });
  }

  if ([95, 96, 99].includes(weatherCode)) {
    alerts.push({
      type: "storm",
      severity: "high",
      title: "Thunderstorm",
      message:
        "Thunderstorm conditions are present or expected.",
    });
  }

  return alerts;
}
