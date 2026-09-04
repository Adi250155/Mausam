function clamp(
  value,
  min = 0,
  max = 100
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}

function number(
  value,
  fallback = 0
) {
  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function getEventType(
  answers = {}
) {
  return (
    answers.eventType ||
    answers.event ||
    answers.type ||
    "general"
  );
}

function getPreferredTime(
  answers = {}
) {
  return (
    answers.preferredTime ||
    answers.eventTime ||
    answers.time ||
    "any"
  );
}

function getRainScore(
  probability
) {
  const rain =
    number(probability);

  if (rain <= 10) return 25;
  if (rain <= 20) return 22;
  if (rain <= 35) return 18;
  if (rain <= 50) return 12;
  if (rain <= 70) return 6;

  return 0;
}

function getTemperatureScore(
  temperature
) {
  const temp =
    number(
      temperature,
      25
    );

  const distance =
    Math.abs(
      temp - 24
    );

  return clamp(
    15 - distance * 1.5,
    0,
    15
  );
}

function getHumidityScore(
  humidity
) {
  const value =
    number(
      humidity,
      55
    );

  if (
    value >= 40 &&
    value <= 65
  ) {
    return 10;
  }

  if (
    value >= 30 &&
    value <= 75
  ) {
    return 7;
  }

  if (
    value <= 85
  ) {
    return 4;
  }

  return 0;
}

function getWindScore(
  wind
) {
  const value =
    number(wind);

  if (value <= 15) return 10;
  if (value <= 25) return 8;
  if (value <= 35) return 5;
  if (value <= 45) return 2;

  return 0;
}

function getUvScore(
  uv
) {
  const value =
    number(uv);

  if (value <= 2) return 5;
  if (value <= 5) return 4;
  if (value <= 7) return 3;
  if (value <= 9) return 1;

  return 0;
}

function getVisibilityScore(
  visibility
) {
  const value =
    number(
      visibility,
      10000
    );

  if (value >= 10000) return 5;
  if (value >= 5000) return 4;
  if (value >= 3000) return 2;

  return 0;
}

function getStormPenalty(
  weatherCode
) {
  const code =
    number(
      weatherCode,
      -1
    );

  if (
    [95, 96, 99].includes(code)
  ) {
    return 30;
  }

  return 0;
}

function getEventMultiplier(
  eventType
) {
  const type =
    String(eventType)
      .toLowerCase();

  if (
    type.includes("wedding") ||
    type.includes("festival") ||
    type.includes("gathering")
  ) {
    return {
      rain: 1.15,
      storm: 1.2,
      wind: 1.05,
    };
  }

  if (
    type.includes("sports")
  ) {
    return {
      rain: 1.1,
      storm: 1.25,
      wind: 1.15,
    };
  }

  return {
    rain: 1,
    storm: 1,
    wind: 1,
  };
}

function getLabel(score) {
  if (score >= 85) {
    return "Excellent";
  }

  if (score >= 70) {
    return "Good";
  }

  if (score >= 50) {
    return "Moderate";
  }

  if (score >= 30) {
    return "Risky";
  }

  return "Poor";
}

function getReasonList({
  rain,
  temperature,
  humidity,
  wind,
  uv,
  visibility,
  weatherCode,
}) {
  const reasons = [];

  if (rain <= 20) {
    reasons.push(
      "Low rain probability"
    );
  } else if (rain >= 70) {
    reasons.push(
      "Very high rain probability"
    );
  }

  if (
    temperature >= 18 &&
    temperature <= 30
  ) {
    reasons.push(
      "Comfortable temperature"
    );
  } else if (
    temperature > 35
  ) {
    reasons.push(
      "High temperature"
    );
  }

  if (
    humidity >= 40 &&
    humidity <= 70
  ) {
    reasons.push(
      "Comfortable humidity"
    );
  } else if (
    humidity > 85
  ) {
    reasons.push(
      "Very high humidity"
    );
  }

  if (wind <= 20) {
    reasons.push(
      "Low wind"
    );
  } else if (
    wind > 35
  ) {
    reasons.push(
      "Strong wind"
    );
  }

  if (
    uv >= 0 &&
    uv <= 5
  ) {
    reasons.push(
      "Manageable UV"
    );
  } else if (
    uv > 8
  ) {
    reasons.push(
      "High UV"
    );
  }

  if (
    visibility >= 5000
  ) {
    reasons.push(
      "Good visibility"
    );
  } else if (
    visibility < 2000
  ) {
    reasons.push(
      "Poor visibility"
    );
  }

  if (
    [95, 96, 99].includes(
      weatherCode
    )
  ) {
    reasons.push(
      "Thunderstorm risk"
    );
  }

  return reasons.slice(
    0,
    4
  );
}

export function calculateEventSuitability(
  {
    rainProbability = 0,
    temperature = 25,
    humidity = 55,
    wind = 0,
    uv = 0,
    visibility = 10000,
    weatherCode = 0,
    eventType = "general",
  }
) {
  const multiplier =
    getEventMultiplier(
      eventType
    );

  let score = 0;

  score += getRainScore(
    rainProbability
  ) /
    multiplier.rain;

  score += getTemperatureScore(
    temperature
  );

  score += getHumidityScore(
    humidity
  );

  score +=
    getWindScore(
      wind
    ) /
    multiplier.wind;

  score += getUvScore(
    uv
  );

  score += getVisibilityScore(
    visibility
  );

  score -=
    getStormPenalty(
      weatherCode
    ) *
    multiplier.storm;

  score = clamp(
    Math.round(score)
  );

  return {
    score,
    label: getLabel(score),
    reasons:
      getReasonList({
        rain:
          number(
            rainProbability
          ),
        temperature:
          number(
            temperature
          ),
        humidity:
          number(
            humidity
          ),
        wind:
          number(wind),
        uv:
          number(uv),
        visibility:
          number(
            visibility,
            10000
          ),
        weatherCode:
          number(
            weatherCode,
            0
          ),
      }),
  };
}

export function getBestEventDay(
  weather,
  answers = {}
) {
  const daily =
    weather?.daily;

  if (!daily?.time?.length) {
    return null;
  }

  const eventType =
    getEventType(
      answers
    );

  const preferredTime =
    getPreferredTime(
      answers
    );

  const results =
    daily.time.map(
      (date, index) => {
        const rain =
          number(
            daily
              .precipitation_probability_max?.[
              index
            ],
            0
          );

        const maxTemp =
          number(
            daily
              .temperature_2m_max?.[
              index
            ],
            25
          );

        const minTemp =
          number(
            daily
              .temperature_2m_min?.[
              index
            ],
            maxTemp
          );

        const wind =
          number(
            daily
              .wind_speed_10m_max?.[
              index
            ],
            0
          );

        const uv =
          number(
            daily
              .uv_index_max?.[
              index
            ],
            0
          );

        const code =
          number(
            daily
              .weather_code?.[
              index
            ],
            0
          );

        const temperature =
          (
            maxTemp +
            minTemp
          ) / 2;

        const result =
          calculateEventSuitability({
            rainProbability:
              rain,
            temperature,
            humidity: 60,
            wind,
            uv,
            visibility: 10000,
            weatherCode:
              code,
            eventType,
          });

        return {
          date,
          score:
            result.score,
          label:
            result.label,
          reasons:
            result.reasons,
          rainProbability:
            rain,
          temperature,
          minTemperature:
            minTemp,
          maxTemperature:
            maxTemp,
          wind,
          uv,
          weatherCode:
            code,
          preferredTime,
        };
      }
    );

  return [...results].sort(
    (a, b) =>
      b.score - a.score
  );
}