import {
  getCommuterRecommendation,
} from "../../features/recommendations/categoryRecommendationEngine";

function CommuterRecommendationWidget({
  weather,
}) {
  const result =
    getCommuterRecommendation(
      weather
    );

  return (
    <section>
      <h2>
        Commute Conditions
      </h2>

      <h1>
        {result.score}/100
      </h1>

      <h3>
        {result.label}
      </h3>

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

export default CommuterRecommendationWidget;