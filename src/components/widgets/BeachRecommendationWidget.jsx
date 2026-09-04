import {
  getBeachRecommendation,
} from "../../features/recommendations/categoryRecommendationEngine";

function BeachRecommendationWidget({
  weather,
  marine,
}) {
  const result =
    getBeachRecommendation(
      weather,
      marine
    );

  return (
    <section>
      <h2>
        Beach Conditions
      </h2>

      <h1>
        {result.score}/100
      </h1>

      <h3>
        {result.label}
      </h3>

      {result.details.waveHeight > 0 && (
        <p>
          Wave height:{" "}
          {result.details.waveHeight} m
        </p>
      )}

      {result.details.wavePeriod > 0 && (
        <p>
          Wave period:{" "}
          {result.details.wavePeriod} s
        </p>
      )}

      {result.details.seaTemperature > 0 && (
        <p>
          Sea temperature:{" "}
          {result.details.seaTemperature}°C
        </p>
      )}

      {result.reasons.length > 0 && (
        <ul>
          {result.reasons.map(
            (reason, index) => (
              <li
                key={`${reason}-${index}`}
              >
                {reason}
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
}

export default BeachRecommendationWidget;