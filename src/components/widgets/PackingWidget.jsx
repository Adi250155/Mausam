import {
  getPackingSuggestion,
} from "../../features/recommendations/recommendationEngine";

function PackingWidget({ weather }) {
  const result =
    getPackingSuggestion(weather);

  return (
    <div>
      <h3>{result.title}</h3>

      <p>{result.value}</p>
    </div>
  );
}

export default PackingWidget;