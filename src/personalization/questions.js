export const questions = {
  health: [
    {
      id: "health_factors",
      question:
        "Which environmental factors matter most to you?",
      type: "multi",
      options: [
        {
          id: "aqi",
          label: "Air Quality (AQI)",
        },
        {
          id: "pollen",
          label: "Pollen",
        },
        {
          id: "uv",
          label: "UV Index",
        },
        {
          id: "humidity",
          label: "Humidity",
        },
        {
          id: "heat",
          label: "Heat",
        },
      ],
    },
  ],

  fitness: [
    {
      id: "fitness_activity",
      question:
        "Which outdoor activities do you do?",
      type: "multi",
      options: [
        {
          id: "running",
          label: "Running",
        },
        {
          id: "cycling",
          label: "Cycling",
        },
        {
          id: "walking",
          label: "Walking",
        },
        {
          id: "workout",
          label: "Outdoor Workout",
        },
      ],
    },
    {
      id: "fitness_time",
      question:
        "When do you usually exercise?",
      type: "single",
      options: [
        {
          id: "morning",
          label: "Morning",
        },
        {
          id: "afternoon",
          label: "Afternoon",
        },
        {
          id: "evening",
          label: "Evening",
        },
        {
          id: "flexible",
          label: "Flexible",
        },
      ],
    },
  ],

  travel: [
    {
      id: "travel_type",
      question:
        "What kind of travel do you usually do?",
      type: "single",
      options: [
        {
          id: "domestic",
          label: "Domestic",
        },
        {
          id: "international",
          label: "International",
        },
        {
          id: "both",
          label: "Both",
        },
      ],
    },
    {
      id: "travel_information",
      question:
        "What information is most important during travel?",
      type: "multi",
      options: [
        {
          id: "rain",
          label: "Rain",
        },
        {
          id: "temperature",
          label: "Temperature",
        },
        {
          id: "severe_weather",
          label: "Severe Weather",
        },
        {
          id: "wind",
          label: "Wind",
        },
        {
          id: "visibility",
          label: "Visibility",
        },
        {
          id: "packing",
          label: "Packing Suggestions",
        },
      ],
    },
  ],

  agriculture: [
    {
      id: "agriculture_type",
      question:
        "What best describes you?",
      type: "single",
      options: [
        {
          id: "farmer",
          label: "Farmer",
        },
        {
          id: "gardener",
          label: "Gardener",
        },
        {
          id: "both",
          label: "Both",
        },
      ],
    },
    {
      id: "agriculture_information",
      question:
        "What information matters most?",
      type: "multi",
      options: [
        {
          id: "rainfall",
          label: "Rainfall",
        },
        {
          id: "soil_moisture",
          label: "Soil Moisture",
        },
        {
          id: "temperature",
          label: "Temperature",
        },
        {
          id: "humidity",
          label: "Humidity",
        },
        {
          id: "wind",
          label: "Wind",
        },
        {
          id: "frost",
          label: "Frost",
        },
        {
          id: "seasonal_guidance",
          label: "Seasonal Guidance",
        },
      ],
    },
    {
      id: "crop",
      question:
        "What do you mainly grow?",
      type: "text",
      placeholder:
        "Enter crop or plant name",
    },
  ],

  family: [
    {
      id: "family_members",
      question:
        "Who do you want weather information for?",
      type: "multi",
      options: [
        {
          id: "children",
          label: "Children",
        },
        {
          id: "elderly",
          label: "Elderly",
        },
        {
          id: "everyone",
          label: "Everyone",
        },
      ],
    },
  ],

  commuter: [
    {
      id: "commute_time",
      question:
        "When do you usually travel?",
      type: "multi",
      options: [
        {
          id: "morning",
          label: "Morning",
        },
        {
          id: "afternoon",
          label: "Afternoon",
        },
        {
          id: "evening",
          label: "Evening",
        },
        {
          id: "multiple",
          label: "Multiple Times",
        },
      ],
    },
  ],

  beach: [
    {
      id: "beach_activity",
      question:
        "What do you usually do at the beach?",
      type: "multi",
      options: [
        {
          id: "swimming",
          label: "Swimming",
        },
        {
          id: "surfing",
          label: "Surfing",
        },
        {
          id: "beach_visit",
          label: "Beach Visit",
        },
        {
          id: "fishing",
          label: "Fishing",
        },
      ],
    },
  ],

  events: [
    {
      id: "event_type",
      question:
        "What kind of events do you organize?",
      type: "multi",
      options: [
        {
          id: "wedding",
          label: "Wedding",
        },
        {
          id: "sports",
          label: "Sports",
        },
        {
          id: "festival",
          label: "Festival",
        },
        {
          id: "gathering",
          label: "Outdoor Gathering",
        },
        {
          id: "other",
          label: "Other",
        },
      ],
    },
  ],
};