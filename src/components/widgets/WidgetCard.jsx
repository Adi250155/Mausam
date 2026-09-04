import {
  useState,
} from "react";

function WidgetCard({
  widgetId,
  title,
  pinned,
  onPin,
  onDelete,
  children,
}) {
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  async function handlePin(
    event
  ) {
    event.stopPropagation();

    setMenuOpen(false);

    await onPin(
      widgetId,
      !pinned
    );
  }

  async function handleDelete(
    event
  ) {
    event.stopPropagation();

    setMenuOpen(false);

    await onDelete(
      widgetId
    );
  }

  return (
    <article
      className={`widget-card ${
        pinned
          ? "widget-card-pinned"
          : ""
      }`}
    >
      <div className="widget-card-toolbar">
        {pinned && (
          <span className="widget-pin-label">
            📌 Pinned
          </span>
        )}

        <div className="widget-actions">
          <button
            type="button"
            className="widget-menu-button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            aria-label={`Options for ${title}`}
            aria-expanded={menuOpen}
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="widget-menu">
              <button
                type="button"
                onClick={
                  handlePin
                }
              >
                {pinned
                  ? "Unpin"
                  : "Pin"}
              </button>

              <button
                type="button"
                onClick={
                  handleDelete
                }
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="widget-card-content">
        {children}
      </div>
    </article>
  );
}

export default WidgetCard;