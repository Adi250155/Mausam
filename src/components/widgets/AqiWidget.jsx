import {
  getAqiStatus,
} from "../../services/weather/weatherUtils";

function AqiWidget({ airQuality }) {
  const current =
    airQuality?.current;

  const aqi =
    current?.european_aqi;

  return (
    <div>
      <h3>Air Quality</h3>

      <h2>
        {aqi != null
          ? Math.round(aqi)
          : "—"}
      </h2>

      <p>
        {getAqiStatus(aqi)}
      </p>

      {current?.pm2_5 != null && (
        <p>
          PM2.5:{" "}
          {current.pm2_5.toFixed(1)}
          µg/m³
        </p>
      )}

      {current?.pm10 != null && (
        <p>
          PM10:{" "}
          {current.pm10.toFixed(1)}
          µg/m³
        </p>
      )}
    </div>
  );
}

export default AqiWidget;