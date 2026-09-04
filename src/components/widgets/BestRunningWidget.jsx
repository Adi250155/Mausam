import {
  getBestRunningTime,
} from "../../features/recommendations/recommendationEngine";

function BestRunningWidget({ weather }) {
  const result =
    getBestRunningTime(weather);

  return (
    <div>
      <h3>{result.title}</h3>

      <h2>{result.value}</h2>

      <p>{result.reason}</p>
    </div>
  );
}

export default BestRunningWidget;