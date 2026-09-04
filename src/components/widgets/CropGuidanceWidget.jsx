import {
  getCropGuidance,
} from "../../features/recommendations/recommendationEngine";

function CropGuidanceWidget({
  weather,
}) {
  const result =
    getCropGuidance(
      weather
    );

  return (
    <section>
      <h2>
        Crop Guidance
      </h2>

      <p>
        {result.value}
      </p>

      <small>
        Guidance is generated from
        available weather conditions.
      </small>
    </section>
  );
}

export default CropGuidanceWidget;