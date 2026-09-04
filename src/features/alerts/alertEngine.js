function toNumber(
  value,
  fallback = 0
) {
  const parsed =
    Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

function addAlert(
  alerts,
  alert
) {
  alerts.push(alert);
}

export function generateAlerts(
  weather,
  airQuality = null,
  preferences = {}
) {
  const alerts = [];

  const current =
    weather?.current;

  const daily =
    weather?.daily;

  if (!current || !daily) {
    return alerts;
  }

  const rainEnabled =
    preferences.rain !== false;

  const stormEnabled =
    preferences.storm !== false;

  const heatEnabled =
    preferences.heat !== false;

  const aqiEnabled =
    preferences.aqi !== false;

  const visibilityEnabled =
    preferences.visibility !== false;

  const uvEnabled =
    preferences.uv !== false;

  const rainProbability =
    toNumber(
      daily
        .precipitation_probability_max?.[
        0
      ]
    );

  const rainfall =
    toNumber(
      daily
        .precipitation_sum?.[0]
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

  const uv =
    toNumber(
      daily.uv_index_max?.[0]
    );

  const aqi =
    toNumber(
      airQuality?.current
        ?.us_aqi ??
        airQuality?.current
          ?.european_aqi ??
        airQuality?.aqi
    );

  if (
    rainEnabled &&
    (
      rainProbability >= 70 ||
      rainfall >= 20
    )
  ) {
    addAlert(
      alerts,
      {
        type: "rain",
        severity: "high",
        title:
          "Heavy Rain Expected",
        message:
          `There is a ${Math.round(
            rainProbability
          )}% chance of rain today. Carry rain protection and plan outdoor activities carefully.`,
      }
    );
  } else if (
    rainEnabled &&
    rainProbability >= 40
  ) {
    addAlert(
      alerts,
      {
        type: "rain",
        severity: "medium",
        title:
          "Rain Possible",
        message:
          `Rain probability is around ${Math.round(
            rainProbability
          )}%. Keep an umbrella or rain protection ready.`,
      }
    );
  }

  if (
    stormEnabled &&
    [95, 96, 99].includes(code)
  ) {
    addAlert(
      alerts,
      {
        type: "storm",
        severity: "high",
        title:
          "Thunderstorm Risk",
        message:
          "Thunderstorm conditions are possible. Avoid exposed outdoor areas and monitor weather updates.",
      }
    );
  }

  if (wind >= 45) {
    addAlert(
      alerts,
      {
        type: "wind",
        severity:
          wind >= 60
            ? "high"
            : "medium",
        title:
          "Strong Winds",
        message:
          `Wind speeds are around ${Math.round(
            wind
          )} km/h. Take extra care while travelling or doing outdoor activities.`,
      }
    );
  }

  if (
    visibilityEnabled &&
    visibility < 2000
  ) {
    addAlert(
      alerts,
      {
        type: "visibility",
        severity: "high",
        title:
          "Low Visibility",
        message:
          `Visibility is around ${(
            visibility / 1000
          ).toFixed(
            1
          )} km. Driving and commuting may require extra caution.`,
      }
    );
  }

  if (
    heatEnabled &&
    temperature >= 40
  ) {
    addAlert(
      alerts,
      {
        type: "heat",
        severity: "high",
        title:
          "Extreme Heat",
        message:
          `Temperature is around ${Math.round(
            temperature
          )}°C. Stay hydrated and reduce prolonged outdoor exposure.`,
      }
    );
  } else if (
    heatEnabled &&
    temperature >= 37
  ) {
    addAlert(
      alerts,
      {
        type: "heat",
        severity: "medium",
        title:
          "High Temperature",
        message:
          `Temperature may reach around ${Math.round(
            temperature
          )}°C. Stay hydrated and take breaks from direct heat.`,
      }
    );
  }

  if (
    aqiEnabled &&
    aqi > 150
  ) {
    addAlert(
      alerts,
      {
        type: "aqi",
        severity:
          aqi > 200
            ? "high"
            : "medium",
        title:
          "Poor Air Quality",
        message:
          `Current AQI is around ${Math.round(
            aqi
          )}. Consider reducing prolonged outdoor exposure, especially during strenuous activity.`,
      }
    );
  }

  if (
    uvEnabled &&
    uv >= 8
  ) {
    addAlert(
      alerts,
      {
        type: "uv",
        severity:
          uv >= 11
            ? "high"
            : "medium",
        title:
          "High UV Index",
        message:
          `UV index may reach ${Math.round(
            uv
          )}. Use sun protection and limit unnecessary midday exposure.`,
      }
    );
  }

  return alerts;
}