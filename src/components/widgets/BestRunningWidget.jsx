import {
  getBestRunningTime,
} from "../../features/recommendations/recommendationEngine";

function BestRunningWidget({
  weather,
}) {
  const result =
    getBestRunningTime(
      weather
    );

  return (
    <section>
      <h2>
        {result.title}
      </h2>

      <h1>
        {result.value}
      </h1>

      <p>
        {result.reason}
      </p>
    </section>
  );
}

export default BestRunningWidget;