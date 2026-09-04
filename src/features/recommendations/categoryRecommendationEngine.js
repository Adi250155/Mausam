function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getCurrent(weather) {
  return weather?.current || {};
}

function getToday(weather) {
  return weather?.daily || {};
}

export function getFamilyRecommendation(weather) {
  const current = getCurrent(weather);
  const daily = getToday(weather);

  const rain = num(
    daily.precipitation_probability_max?.[0]
  );

  const wind = num(
    current.wind_speed_10m
  );

  const visibility = num(
    current.visibility,
    10000
  );

  const temperature = num(
    current.temperature_2m,
    25
  );

  const code = num(
    current.weather_code,
    0
  );

  let score = 100;
  const reasons = [];

  score -= rain * 0.4;

  if (wind > 30) {
    score -= (wind - 30) * 1.5;
    reasons.push("Strong wind");
  }

  if (visibility < 5000) {
    score -= 10;
    reasons.push("Reduced visibility");
  }

  if (
    temperature >= 18 &&
    temperature <= 32
  ) {
    reasons.push("Comfortable temperature");
  }

  if (temperature > 38) {
    score -= 20;
    reasons.push("High heat");
  }

  if (rain >= 70) {
    reasons.push("High rain probability");
  } else if (rain <= 20) {
    reasons.push("Low rain probability");
  }

  if (
    [95, 96, 99].includes(code)
  ) {
    score -= 40;
    reasons.push("Thunderstorm risk");
  }

  score = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  return {
    score,
    label:
      score >= 80
        ? "Good for family activities"
        : score >= 60
        ? "Use some caution"
        : "Poor conditions",
    reasons: reasons.slice(0, 4),
  };
}

export function getCommuterRecommendation(
  weather
) {
  const current = getCurrent(weather);
  const daily = getToday(weather);

  const rain = num(
    daily.precipitation_probability_max?.[0]
  );

  const wind = num(
    current.wind_speed_10m
  );

  const visibility = num(
    current.visibility,
    10000
  );

  const temperature = num(
    current.temperature_2m,
    25
  );

  const code = num(
    current.weather_code
  );

  let score = 100;
  const reasons = [];

  score -= rain * 0.35;

  if (visibility < 5000) {
    score -= 15;
    reasons.push("Reduced visibility");
  }

  if (visibility < 2000) {
    score -= 20;
    reasons.push("Very low visibility");
  }

  if (wind > 35) {
    score -= 15;
    reasons.push("Strong wind");
  }

  if (rain >= 70) {
    score -= 15;
    reasons.push("Heavy rain risk");
  }

  if (
    [95, 96, 99].includes(code)
  ) {
    score -= 40;
    reasons.push("Thunderstorm risk");
  }

  if (
    temperature > 38
  ) {
    score -= 10;
    reasons.push("High temperature");
  }

  if (
    rain <= 20 &&
    visibility >= 5000 &&
    wind <= 25
  ) {
    reasons.push("Favorable travel conditions");
  }

  score = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  return {
    score,
    label:
      score >= 80
        ? "Easy commute"
        : score >= 60
        ? "Moderate commute"
        : score >= 40
        ? "Difficult commute"
        : "High travel risk",
    reasons: reasons.slice(0, 4),
  };
}

export function getBeachRecommendation(
  weather,
  marine
) {
  const current = getCurrent(weather);
  const daily = getToday(weather);

  const rain = num(
    daily.precipitation_probability_max?.[0]
  );

  const wind = num(
    current.wind_speed_10m
  );

  const temperature = num(
    current.temperature_2m,
    25
  );

  const waveHeight = num(
    marine?.waveHeight ??
      marine?.current?.wave_height,
    0
  );

  const wavePeriod = num(
    marine?.wavePeriod ??
      marine?.current?.wave_period,
    0
  );

  const seaTemperature = num(
    marine?.seaTemperature ??
      marine?.current
        ?.sea_surface_temperature,
    0
  );

  const code = num(
    current.weather_code
  );

  let score = 100;
  const reasons = [];

  score -= rain * 0.35;

  if (wind > 30) {
    score -= 15;
    reasons.push("Strong wind");
  }

  if (wind > 45) {
    score -= 20;
    reasons.push("Very strong wind");
  }

  if (waveHeight > 2) {
    score -= 20;
    reasons.push("High waves");
  }

  if (waveHeight > 3) {
    score -= 25;
    reasons.push("Very high waves");
  }

  if (
    [95, 96, 99].includes(code)
  ) {
    score -= 40;
    reasons.push("Thunderstorm risk");
  }

  if (
    temperature >= 22 &&
    temperature <= 34
  ) {
    reasons.push("Suitable air temperature");
  }

  if (rain <= 20) {
    reasons.push("Low rain probability");
  }

  if (
    wavePeriod >= 5 &&
    wavePeriod <= 10
  ) {
    reasons.push("Moderate wave period");
  }

  score = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  return {
    score,

    label:
      score >= 85
        ? "Excellent beach conditions"
        : score >= 70
        ? "Good beach conditions"
        : score >= 50
        ? "Moderate conditions"
        : "Poor beach conditions",

    reasons:
      reasons.slice(0, 4),

    details: {
      waveHeight,
      wavePeriod,
      seaTemperature,
    },
  };
}