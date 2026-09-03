const widgetMap = {
  health: [
    "currentWeather",
    "aqi",
    "pollen",
    "uv",
    "humidity",
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

export function getPersonalizedWidgets(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }

  const widgets = [];

  categories.forEach((category) => {
    const categoryWidgets = widgetMap[category] || [];

    categoryWidgets.forEach((widget) => {
      if (!widgets.includes(widget)) {
        widgets.push(widget);
      }
    });
  });

  return widgets;
}