import {
  getTravelRisk,
} from "../../features/recommendations/recommendationEngine";

function TravelRiskWidget({
  weather,
}) {
  const result =
    getTravelRisk(
      weather
    );

  return (
    <section>
      <h2>
        Travel Conditions
      </h2>

      {result.score === null ? (
        <p>
          Travel data unavailable.
        </p>
      ) : (
        <>
          <h1>
            {result.score}/100
          </h1>

          <h3>
            {result.label}
          </h3>

          {result.reasons.length >
            0 && (
            <ul>
              {result.reasons.map(
                (
                  reason,
                  index
                ) => (
                  <li
                    key={`${reason}-${index}`}
                  >
                    {reason}
                  </li>
                )
              )}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export default TravelRiskWidget;