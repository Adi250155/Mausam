const widgetMap = {
  health: [
    "currentWeather",
    "officialWarning",
    "aqi",
    "uv",
    "humidity",
    "pollen",
    "heatAlert",
  ],

  fitness: [
    "currentWeather",
    "officialWarning",
    "bestRunningTime",
    "wind",
    "uv",
    "sunriseSunset",
    "heatAlert",
  ],

  travel: [
    "currentWeather",
    "officialWarning",
    "travelRisk",
    "rainProbability",
    "packingSuggestion",
    "forecast",
  ],

  agriculture: [
    "currentWeather",
    "officialWarning",
    "rainfall",
    "soilMoisture",
    "humidity",
    "wind",
    "frostAlert",
    "cropGuidance",
  ],

  family: [
    "familyRecommendation",
    "currentWeather",
    "officialWarning",
    "rainAlert",
    "schoolCommute",
    "forecast",
  ],

  commuter: [
    "commuterRecommendation",
    "currentWeather",
    "officialWarning",
    "rainProbability",
    "visibility",
    "fogAlert",
    "stormAlert",
  ],

  beach: [
    "beachRecommendation",
    "currentWeather",
    "officialWarning",
    "tide",
    "waveHeight",
    "waterTemperature",
    "wind",
    "seaCondition",
  ],

  events: [
    "eventSuitability",
    "forecast",
    "officialWarning",
    "rainProbability",
    "comfortIndex",
    "wind",
  ],
};

function unique(items) {
  return [...new Set(items)];
}

export function getPersonalizedWidgets(
  categories,
  weather = null
) {
  if (!Array.isArray(categories)) {
    return [];
  }

  let widgets = [];

  categories.forEach((category) => {
    widgets = [
      ...widgets,
      ...(widgetMap[category] || []),
    ];
  });

  const rain =
    weather?.daily
      ?.precipitation_probability_max?.[0] ??
    0;

  const code =
    weather?.current?.weather_code;

  if (rain >= 60) {
    widgets = [
      "rainProbability",
      "officialWarning",
      ...widgets.filter(
        (item) =>
          item !== "rainProbability" &&
          item !== "officialWarning"
      ),
    ];
  }

  if ([95, 96, 99].includes(code)) {
    widgets = [
      "officialWarning",
      "severeWeather",
      ...widgets.filter(
        (item) =>
          item !== "officialWarning" &&
          item !== "severeWeather"
      ),
    ];
  }

  return unique(widgets);
}