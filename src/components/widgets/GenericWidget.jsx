function GenericWidget({ type }) {
  return (
    <div>
      <h3>{type}</h3>
      <p>Information for {type}</p>
    </div>
  );
}

export default GenericWidget;