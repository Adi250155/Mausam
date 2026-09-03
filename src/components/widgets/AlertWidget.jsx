function AlertWidget({ type = "Weather Alert" }) {
  return (
    <div>
      <h3>{type}</h3>
      <p>No active severe weather warning.</p>
    </div>
  );
}

export default AlertWidget;
