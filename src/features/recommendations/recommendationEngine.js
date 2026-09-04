import {
  getComfortIndex,
} from "../../services/weather/weatherUtils";

function toNumber(
  value,
  fallback = 0
) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function getNext24Hours(weather) {
  const hourly = weather?.hourly;

  if (!hourly?.time?.length) {
    return [];
  }

  return hourly.time
    .slice(0, 24)
    .map((time, index) => ({
      time,

      temperature:
        toNumber(
          hourly.temperature_2m?.[
            index
          ],
          25
        ),

      apparent:
        toNumber(
          hourly.apparent_temperature?.[
            index
          ],
          25
        ),

      humidity:
        toNumber(
          hourly.relative_humidity_2m?.[
            index
          ],
          60
        ),

      rainProbability:
        toNumber(
          hourly
            .precipitation_probability?.[
            index
          ],
          0
        ),

      precipitation:
        toNumber(
          hourly.precipitation?.[
            index
          ],
          0
        ),

      wind:
        toNumber(
          hourly.wind_speed_10m?.[
            index
          ],
          0
        ),

      uv:
        toNumber(
          hourly.uv_index?.[
            index
          ],
          0
        ),

      visibility:
        toNumber(
          hourly.visibility?.[
            index
          ],
          10000
        ),

      weatherCode:
        toNumber(
          hourly.weather_code?.[
            index
          ],
          0
        ),
    }));
}

function formatTime(
  time
) {
  const date = new Date(time);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return time;
  }

  return date.toLocaleTimeString(
    [],
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function isEveningOrMorning(
  time
) {
  const date = new Date(time);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  const hour =
    date.getHours();

  return (
    (hour >= 5 && hour <= 8) ||
    (hour >= 17 && hour <= 20)
  );
}

export function getBestRunningTime(
  weather
) {
  const hours =
    getNext24Hours(weather);

  if (!hours.length) {
    return {
      title: "Best Running Time",
      value: "Data unavailable",
      reason:
        "Weather data is unavailable.",
    };
  }

  let best =
    hours[0];

  let bestScore =
    -Infinity;

  hours.forEach((hour) => {
    let score = 100;

    score -=
      Math.abs(
        hour.temperature - 22
      ) * 3;

    score -=
      hour.rainProbability *
      1.3;

    score -=
      Math.max(
        0,
        hour.wind - 15
      ) * 1.5;

    score -=
      Math.max(
        0,
        hour.uv - 3
      ) * 4;

    if (
      hour.humidity > 80
    ) {
      score -=
        (hour.humidity - 80) *
        0.5;
    }

    if (
      hour.visibility < 3000
    ) {
      score -= 10;
    }

    if (
      [95, 96, 99].includes(
        hour.weatherCode
      )
    ) {
      score -= 40;
    }

    if (
      isEveningOrMorning(
        hour.time
      )
    ) {
      score += 10;
    }

    if (score > bestScore) {
      bestScore =
        score;

      best =
        hour;
    }
  });

  return {
    title:
      "Best Running Time",

    value:
      formatTime(
        best.time
      ),

    reason:
      "Based on temperature, rain, humidity, wind, visibility and UV.",
  };
}

export function getBestOutdoorWorkoutTime(
  weather
) {
  return getBestRunningTime(
    weather
  );
}

export function getTravelRisk(
  weather
) {
  const current =
    weather?.current;

  const daily =
    weather?.daily;

  if (!current || !daily) {
    return {
      score: null,
      label: "Unavailable",
      reasons: [],
    };
  }

  const rain =
    toNumber(
      daily
        .precipitation_probability_max?.[
        0
      ]
    );

  const wind =
    toNumber(
      current.wind_speed_10m
    );

  const visibility =
    toNumber(
      current.visibility,
      10000
    );

  const temperature =
    toNumber(
      current.temperature_2m,
      25
    );

  const code =
    toNumber(
      current.weather_code
    );

  let score = 100;

  score -=
    rain * 0.45;

  if (wind > 30) {
    score -=
      (wind - 30) *
      1.2;
  }

  if (visibility < 5000) {
    score -=
      (5000 - visibility) /
      500;
  }

  if (
    temperature > 38 ||
    temperature < 5
  ) {
    score -= 15;
  }

  if (
    [95, 96, 99].includes(
      code
    )
  ) {
    score -= 35;
  }

  score =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );

  const reasons = [];

  if (rain >= 70) {
    reasons.push(
      "High rain risk"
    );
  } else if (
    rain <= 20
  ) {
    reasons.push(
      "Low rain risk"
    );
  }

  if (wind > 30) {
    reasons.push(
      "Strong wind"
    );
  }

  if (
    visibility < 3000
  ) {
    reasons.push(
      "Low visibility"
    );
  }

  if (
    [95, 96, 99].includes(
      code
    )
  ) {
    reasons.push(
      "Thunderstorm risk"
    );
  }

  if (
    temperature >= 15 &&
    temperature <= 32
  ) {
    reasons.push(
      "Temperature is manageable"
    );
  }

  return {
    score,

    label:
      score >= 80
        ? "Low Risk"
        : score >= 60
        ? "Moderate Risk"
        : score >= 40
        ? "High Risk"
        : "Very High Risk",

    reasons:
      reasons.slice(0, 4),
  };
}

export function getPackingSuggestion(
  weather
) {
  const daily =
    weather?.daily;

  if (!daily) {
    return {
      title:
        "Packing Suggestion",

      value:
        "Weather data unavailable.",
    };
  }

  const rain =
    toNumber(
      daily
        .precipitation_probability_max?.[
        0
      ]
    );

  const maxTemp =
    toNumber(
      daily.temperature_2m_max?.[
        0
      ],
      25
    );

  const minTemp =
    toNumber(
      daily.temperature_2m_min?.[
        0
      ],
      18
    );

  const wind =
    toNumber(
      daily.wind_speed_10m_max?.[
        0
      ]
    );

  const uv =
    toNumber(
      daily.uv_index_max?.[
        0
      ]
    );

  const items = [];

  if (rain >= 50) {
    items.push(
      "rain jacket"
    );
  }

  if (rain >= 70) {
    items.push(
      "waterproof footwear"
    );
  }

  if (maxTemp >= 32) {
    items.push(
      "light clothing"
    );

    items.push(
      "sunscreen"
    );

    items.push(
      "water bottle"
    );
  }

  if (uv >= 7) {
    items.push(
      "sun protection"
    );
  }

  if (minTemp <= 12) {
    items.push(
      "warm layer"
    );
  }

  if (wind >= 35) {
    items.push(
      "wind-resistant outer layer"
    );
  }

  if (!items.length) {
    items.push(
      "weather-appropriate clothing"
    );
  }

  return {
    title:
      "Packing Suggestion",

    value:
      `Carry ${items.join(
        ", "
      )}.`,
  };
}

export function getCropGuidance(
  weather
) {
  const hourly =
    weather?.hourly;

  const daily =
    weather?.daily;

  if (!hourly || !daily) {
    return {
      title:
        "Crop Guidance",

      value:
        "Weather data unavailable.",
    };
  }

  const soil =
    hourly.soil_moisture_0_to_1cm?.[
      0
    ];

  const rain =
    toNumber(
      daily
        .precipitation_probability_max?.[
        0
      ]
    );

  const rainfall =
    toNumber(
      daily.precipitation_sum?.[
        0
      ]
    );

  const maxTemp =
    toNumber(
      daily.temperature_2m_max?.[
        0
      ],
      25
    );

  if (
    soil != null &&
    soil < 0.15
  ) {
    return {
      title:
        "Crop Guidance",

      value:
        "Soil appears relatively dry. Consider irrigation planning.",
    };
  }

  if (
    rain >= 70 ||
    rainfall >= 20
  ) {
    return {
      title:
        "Crop Guidance",

      value:
        "High rainfall risk. Review irrigation, drainage and field access plans.",
    };
  }

  if (maxTemp >= 38) {
    return {
      title:
        "Crop Guidance",

      value:
        "High heat risk. Monitor crop moisture and irrigation requirements.",
    };
  }

  return {
    title:
      "Crop Guidance",

    value:
      "Current conditions appear suitable for routine crop monitoring.",
  };
}

export function getComfortRecommendation(
  weather
) {
  const current =
    weather?.current;

  const hourly =
    weather?.hourly;

  if (
    !current ||
    !hourly
  ) {
    return null;
  }

  const rain =
    toNumber(
      hourly
        .precipitation_probability?.[
        0
      ]
    );

  const score =
    getComfortIndex({
      temperature:
        current.temperature_2m,
      humidity:
        current.relative_humidity_2m,
      wind:
        current.wind_speed_10m,
      rainProbability:
        rain,
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