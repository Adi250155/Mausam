import {
  getCropGuidance,
} from "../../features/recommendations/recommendationEngine";

function CropGuidanceWidget({ weather }) {
  const result =
    getCropGuidance(weather);

  return (
    <div>
      <h3>{result.title}</h3>

      <p>{result.value}</p>
    </div>
  );
}

export default CropGuidanceWidget;