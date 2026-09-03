import CurrentWeather from "./CurrentWeather";
import AqiWidget from "./AqiWidget";
import RainWidget from "./RainWidget";
import WindWidget from "./WindWidget";
import SunWidget from "./SunWidget";
import ForecastWidget from "./ForecastWidget";

import PollenWidget from "./PollenWidget";
import UvWidget from "./UvWidget";
import HumidityWidget from "./HumidityWidget";
import AlertWidget from "./AlertWidget";
import BestRunningWidget from "./BestRunningWidget";
import PackingWidget from "./PackingWidget";

import RainfallWidget from "./RainfallWidget";
import SoilMoistureWidget from "./SoilMoistureWidget";
import CropGuidanceWidget from "./CropGuidanceWidget";
import FrostWidget from "./FrostWidget";

import VisibilityWidget from "./VisibilityWidget";
import FogWidget from "./FogWidget";
import StormWidget from "./StormWidget";
import SchoolCommuteWidget from "./SchoolCommuteWidget";

import TideWidget from "./TideWidget";
import WaveHeightWidget from "./WaveHeightWidget";
import WaterTemperatureWidget from "./WaterTemperatureWidget";
import SeaConditionWidget from "./SeaConditionWidget";

import ComfortIndexWidget from "./ComfortIndexWidget";

import GenericWidget from "./GenericWidget";

function WidgetRenderer({ widget }) {
  switch (widget) {
    case "currentWeather":
      return <CurrentWeather />;

    case "aqi":
      return <AqiWidget />;

    case "rainProbability":
      return <RainWidget />;

    case "wind":
      return <WindWidget />;

    case "sunriseSunset":
      return <SunWidget />;

    case "forecast":
      return <ForecastWidget />;

    case "pollen":
      return <PollenWidget />;

    case "uv":
      return <UvWidget />;

    case "humidity":
      return <HumidityWidget />;

    case "heatAlert":
      return <AlertWidget type="Heat Alert" />;

    case "severeWeather":
      return <AlertWidget type="Severe Weather" />;

    case "rainAlert":
      return <AlertWidget type="Rain Alert" />;

    case "stormAlert":
      return <StormWidget />;

    case "fogAlert":
      return <FogWidget />;

    case "bestRunningTime":
      return <BestRunningWidget />;

    case "packingSuggestion":
      return <PackingWidget />;

    case "rainfall":
      return <RainfallWidget />;

    case "soilMoisture":
      return <SoilMoistureWidget />;

    case "cropGuidance":
      return <CropGuidanceWidget />;

    case "frostAlert":
      return <FrostWidget />;

    case "visibility":
      return <VisibilityWidget />;

    case "schoolCommute":
      return <SchoolCommuteWidget />;

    case "tide":
      return <TideWidget />;

    case "waveHeight":
      return <WaveHeightWidget />;

    case "waterTemperature":
      return <WaterTemperatureWidget />;

    case "seaCondition":
      return <SeaConditionWidget />;

    case "comfortIndex":
      return <ComfortIndexWidget />;

    default:
      return <GenericWidget type={widget} />;
  }
}

export default WidgetRenderer;