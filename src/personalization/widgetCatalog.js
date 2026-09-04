export const widgetCatalog = [
  {
    id: "currentWeather",
    title: "Current Weather",
    description:
      "Temperature, humidity, wind and current conditions.",
    category: "Weather",
  },

  {
    id: "forecast",
    title: "7 Day Forecast",
    description:
      "Extended weather forecast for the next 7 days.",
    category: "Weather",
  },

  {
    id: "rainProbability",
    title: "Rain Probability",
    description:
      "Chance and expected amount of rainfall.",
    category: "Weather",
  },

  {
    id: "wind",
    title: "Wind",
    description:
      "Wind speed and direction.",
    category: "Weather",
  },

  {
    id: "sunriseSunset",
    title: "Sunrise & Sunset",
    description:
      "Daily sunrise and sunset timings.",
    category: "Weather",
  },

  {
    id: "aqi",
    title: "Air Quality",
    description:
      "AQI, PM2.5 and PM10 information.",
    category: "Health",
  },

  {
    id: "uv",
    title: "UV Index",
    description:
      "UV exposure conditions.",
    category: "Health",
  },

  {
    id: "humidity",
    title: "Humidity",
    description:
      "Current humidity level.",
    category: "Health",
  },

  {
    id: "pollen",
    title: "Pollen",
    description:
      "Available pollen information.",
    category: "Health",
  },

  {
    id: "heatAlert",
    title: "Heat Alert",
    description:
      "Weather-based heat risk.",
    category: "Health",
  },

  {
    id: "bestRunningTime",
    title: "Best Running Time",
    description:
      "Best time for outdoor running.",
    category: "Fitness",
  },

  {
    id: "travelRisk",
    title: "Travel Conditions",
    description:
      "Weather-based travel risk.",
    category: "Travel",
  },

  {
    id: "packingSuggestion",
    title: "Packing Suggestion",
    description:
      "Weather-based packing recommendations.",
    category: "Travel",
  },

  {
    id: "rainfall",
    title: "Rainfall",
    description:
      "Expected rainfall information.",
    category: "Agriculture",
  },

  {
    id: "soilMoisture",
    title: "Soil Moisture",
    description:
      "Estimated soil moisture conditions.",
    category: "Agriculture",
  },

  {
    id: "cropGuidance",
    title: "Crop Guidance",
    description:
      "Weather-based crop guidance.",
    category: "Agriculture",
  },

  {
    id: "frostAlert",
    title: "Frost Alert",
    description:
      "Frost-related weather conditions.",
    category: "Agriculture",
  },

  {
    id: "familyRecommendation",
    title: "Family Weather",
    description:
      "Family-friendly weather conditions.",
    category: "Family",
  },

  {
    id: "schoolCommute",
    title: "School Commute",
    description:
      "Weather conditions for school travel.",
    category: "Family",
  },

  {
    id: "commuterRecommendation",
    title: "Commute Conditions",
    description:
      "Weather-based commuting conditions.",
    category: "Commuting",
  },

  {
    id: "visibility",
    title: "Visibility",
    description:
      "Current visibility conditions.",
    category: "Commuting",
  },

  {
    id: "fogAlert",
    title: "Fog Alert",
    description:
      "Fog and reduced visibility conditions.",
    category: "Commuting",
  },

  {
    id: "stormAlert",
    title: "Storm Alert",
    description:
      "Storm-related conditions.",
    category: "Commuting",
  },

  {
    id: "beachRecommendation",
    title: "Beach Conditions",
    description:
      "Overall beach suitability.",
    category: "Beach",
  },

  {
    id: "tide",
    title: "Tide",
    description:
      "Marine tide information.",
    category: "Beach",
  },

  {
    id: "waveHeight",
    title: "Wave Height",
    description:
      "Current wave height.",
    category: "Beach",
  },

  {
    id: "waterTemperature",
    title: "Water Temperature",
    description:
      "Sea surface temperature.",
    category: "Beach",
  },

  {
    id: "seaCondition",
    title: "Sea Condition",
    description:
      "Overall sea conditions.",
    category: "Beach",
  },

  {
    id: "eventSuitability",
    title: "Event Suitability",
    description:
      "Outdoor event score and best day.",
    category: "Events",
  },

  {
    id: "comfortIndex",
    title: "Comfort Index",
    description:
      "Overall outdoor comfort score.",
    category: "Events",
  },
];

export function getWidgetById(widgetId) {
  return (
    widgetCatalog.find(
      (widget) =>
        widget.id === widgetId
    ) || null
  );
}