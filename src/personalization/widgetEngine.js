const widgetMap = {
  health: [
    "currentWeather",
    "aqi",
    "uv",
    "humidity",
    "pollen",
    "heatAlert",
  ],

  fitness: [
    "currentWeather",
    "bestRunningTime",
    "wind",
    "uv",
    "sunriseSunset",
    "heatAlert",
  ],

  travel: [
    "currentWeather",
    "rainProbability",
    "severeWeather",
    "packingSuggestion",
    "forecast",
  ],

  agriculture: [
    "currentWeather",
    "rainfall",
    "soilMoisture",
    "humidity",
    "wind",
    "frostAlert",
    "cropGuidance",
  ],

  family: [
    "currentWeather",
    "rainAlert",
    "schoolCommute",
    "severeWeather",
    "forecast",
  ],

  commuter: [
    "currentWeather",
    "rainProbability",
    "visibility",
    "fogAlert",
    "stormAlert",
  ],

  beach: [
    "currentWeather",
    "tide",
    "waveHeight",
    "waterTemperature",
    "wind",
    "seaCondition",
  ],

  events: [
    "forecast",
    "rainProbability",
    "comfortIndex",
    "wind",
    "temperature",
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

  widgets = unique(widgets);

  if (weather?.daily) {
    const rain =
      weather.daily
        .precipitation_probability_max?.[0] ?? 0;

    if (rain >= 60) {
      widgets = [
        "rainProbability",
        "severeWeather",
        ...widgets.filter(
          (item) =>
            item !== "rainProbability" &&
            item !== "severeWeather"
        ),
      ];
    }
  }

  return widgets;
}