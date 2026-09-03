function ForecastWidget() {
  const forecast = [
    {
      day: "Today",
      temperature: "28°C",
      condition: "Partly Cloudy",
    },
    {
      day: "Tomorrow",
      temperature: "30°C",
      condition: "Sunny",
    },
    {
      day: "Day 3",
      temperature: "27°C",
      condition: "Rain",
    },
  ];

  return (
    <div>
      <h3>Forecast</h3>

      {forecast.map((item) => (
        <div key={item.day}>
          <strong>{item.day}</strong>
          <p>{item.temperature}</p>
          <p>{item.condition}</p>
        </div>
      ))}
    </div>
  );
}

export default ForecastWidget;