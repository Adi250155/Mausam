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

function WidgetRenderer({
  widget,
  weather,
  airQuality,
  marine,
}) {
  switch (widget) {
    case "currentWeather":
      return (
        <CurrentWeather
          weather={weather}
        />
      );

    case "aqi":
      return (
        <AqiWidget
          airQuality={airQuality}
        />
      );

    case "rainProbability":
      return (
        <RainWidget
          weather={weather}
        />
      );

    case "wind":
      return (
        <WindWidget
          weather={weather}
        />
      );

    case "sunriseSunset":
      return (
        <SunWidget
          weather={weather}
        />
      );

    case "forecast":
      return (
        <ForecastWidget
          weather={weather}
        />
      );

    case "pollen":
      return (
        <PollenWidget
          airQuality={airQuality}
        />
      );

    case "uv":
      return (
        <UvWidget
          weather={weather}
          airQuality={airQuality}
        />
      );

    case "humidity":
      return (
        <HumidityWidget
          weather={weather}
        />
      );

    case "heatAlert":
      return (
        <AlertWidget
          type="Heat Alert"
          weather={weather}
        />
      );

    case "severeWeather":
      return (
        <AlertWidget
          type="Severe Weather"
          weather={weather}
        />
      );

    case "rainAlert":
      return (
        <AlertWidget
          type="Rain Alert"
          weather={weather}
        />
      );

    case "stormAlert":
      return (
        <StormWidget
          weather={weather}
        />
      );

    case "fogAlert":
      return (
        <FogWidget
          weather={weather}
        />
      );

    case "bestRunningTime":
      return (
        <BestRunningWidget
          weather={weather}
        />
      );

    case "packingSuggestion":
      return (
        <PackingWidget
          weather={weather}
        />
      );

    case "rainfall":
      return (
        <RainfallWidget
          weather={weather}
        />
      );

    case "soilMoisture":
      return (
        <SoilMoistureWidget
          weather={weather}
        />
      );

    case "cropGuidance":
      return (
        <CropGuidanceWidget
          weather={weather}
        />
      );

    case "frostAlert":
      return (
        <FrostWidget
          weather={weather}
        />
      );

    case "visibility":
      return (
        <VisibilityWidget
          weather={weather}
        />
      );

    case "schoolCommute":
      return (
        <SchoolCommuteWidget
          weather={weather}
        />
      );

    case "tide":
      return (
        <TideWidget
          marine={marine}
        />
      );

    case "waveHeight":
      return (
        <WaveHeightWidget
          marine={marine}
        />
      );

    case "waterTemperature":
      return (
        <WaterTemperatureWidget
          marine={marine}
        />
      );

    case "seaCondition":
      return (
        <SeaConditionWidget
          marine={marine}
        />
      );

    case "comfortIndex":
      return (
        <ComfortIndexWidget
          weather={weather}
        />
      );

    default:
      return (
        <GenericWidget
          type={widget}
        />
      );
  }
}

export default WidgetRenderer;