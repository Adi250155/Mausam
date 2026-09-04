import {
  getComfortIndex,
} from "../../services/weather/weatherUtils";

function getNext24Hours(weather) {
  const hourly = weather?.hourly;

  if (!hourly?.time) return [];

  return hourly.time.slice(0, 24).map(
    (_, index) => ({
      time: hourly.time[index],
      temperature:
        hourly.temperature_2m?.[index] ?? 0,
      apparent:
        hourly.apparent_temperature?.[index] ?? 0,
      humidity:
        hourly.relative_humidity_2m?.[index] ?? 0,
      rainProbability:
        hourly.precipitation_probability?.[index] ?? 0,
      wind:
        hourly.wind_speed_10m?.[index] ?? 0,
      uv:
        hourly.uv_index?.[index] ?? 0,
    })
  );
}

export function getBestRunningTime(weather) {
  const hours = getNext24Hours(weather);

  if (!hours.length) {
    return {
      title: "Best Running Time",
      value: "Data unavailable",
      reason: "",
    };
  }

  let best = hours[0];
  let bestScore = -Infinity;

  hours.forEach((hour) => {
    let score = 100;

    score -= Math.abs(hour.temperature - 22) * 3;

    score -= hour.rainProbability * 1.2;

    score -= Math.max(0, hour.wind - 15) * 1.5;

    score -= hour.uv * 4;

    if (
      hour.time.includes("05:") ||
      hour.time.includes("06:") ||
      hour.time.includes("07:") ||
      hour.time.includes("18:") ||
      hour.time.includes("19:")
    ) {
      score += 12;
    }

    if (score > bestScore) {
      bestScore = score;
      best = hour;
    }
  });

  const date = new Date(best.time);

  return {
    title: "Best Running Time",
    value: date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
    reason:
      "Based on temperature, rain probability, wind and UV.",
  };
}

export function getPackingSuggestion(weather) {
  const daily = weather?.daily;

  if (!daily) {
    return {
      title: "Packing Suggestion",
      value: "No data",
    };
  }

  const rain =
    daily.precipitation_probability_max?.[0] ?? 0;

  const maxTemp =
    daily.temperature_2m_max?.[0] ?? 25;

  const minTemp =
    daily.temperature_2m_min?.[0] ?? 18;

  const items = [];

  if (rain >= 50) {
    items.push("rain jacket");
  }

  if (maxTemp >= 32) {
    items.push("light clothing");
    items.push("sunscreen");
  }

  if (minTemp <= 12) {
    items.push("warm layer");
  }

  if (!items.length) {
    items.push("weather-appropriate clothing");
  }

  return {
    title: "Packing Suggestion",
    value: `Carry ${items.join(", ")}.`,
  };
}

export function getCropGuidance(weather) {
  const hourly = weather?.hourly;

  if (!hourly) {
    return {
      title: "Crop Guidance",
      value: "Data unavailable",
    };
  }

  const soil =
    hourly.soil_moisture_0_to_1cm?.[0];

  const rain =
    hourly.precipitation_probability?.[0] ?? 0;

  if (soil != null && soil < 0.15) {
    return {
      title: "Crop Guidance",
      value:
        "Soil appears relatively dry. Consider irrigation planning.",
    };
  }

  if (rain >= 70) {
    return {
      title: "Crop Guidance",
      value:
        "High rain probability. Review irrigation and field drainage plans.",
    };
  }

  return {
    title: "Crop Guidance",
    value:
      "Current conditions appear suitable for routine crop monitoring.",
  };
}

export function getComfortRecommendation(weather) {
  const current = weather?.current;
  const hourly = weather?.hourly;

  if (!current || !hourly) {
    return null;
  }

  const rain =
    hourly.precipitation_probability?.[0] ?? 0;

  const score = getComfortIndex({
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    wind: current.wind_speed_10m,
    rainProbability: rain,
  });

  return {
    score,
    label:
      score >= 80
        ? "Excellent"
        : score >= 65
        ? "Good"
        : score >= 45
        ? "Fair"
        : "Poor",
  };
}

