import {
  getPackingSuggestion,
} from "../../features/recommendations/recommendationEngine";

function PackingWidget({
  weather,
}) {
  const result =
    getPackingSuggestion(
      weather
    );

  return (
    <section>
      <h2>
        {result.title}
      </h2>

      <p>
        {result.value}
      </p>
    </section>
  );
}

export default PackingWidget;