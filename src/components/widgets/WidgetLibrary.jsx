import {
  useMemo,
  useState,
} from "react";

import {
  widgetCatalog,
} from "../../personalization/widgetCatalog";

function WidgetLibrary({
  existingWidgets = [],
  onAdd,
  onClose,
}) {
  const [
    search,
    setSearch,
  ] = useState("");

  const categories =
    [
      "All",
      "Weather",
      "Health",
      "Fitness",
      "Travel",
      "Agriculture",
      "Family",
      "Commuting",
      "Beach",
      "Events",
    ];

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const availableWidgets =
    useMemo(() => {
      return widgetCatalog.filter(
        (widget) => {
          const matchesSearch =
            widget.title
              .toLowerCase()
              .includes(
                search
                  .toLowerCase()
                  .trim()
              ) ||
            widget.description
              .toLowerCase()
              .includes(
                search
                  .toLowerCase()
                  .trim()
              );

          const matchesCategory =
            selectedCategory ===
              "All" ||
            widget.category ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      search,
      selectedCategory,
    ]);

  function isAdded(widgetId) {
    return existingWidgets.includes(
      widgetId
    );
  }

  return (
    <div className="widget-library-overlay">
      <div className="widget-library">
        <div className="widget-library-header">
          <div>
            <h2>
              Add Widget
            </h2>

            <p>
              Choose widgets for
              your personalized home.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close widget library"
          >
            ✕
          </button>
        </div>

        <input
          type="search"
          placeholder="Search widgets..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <div className="widget-categories">
          {categories.map(
            (category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-active"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}
        </div>

        <div className="widget-library-list">
          {availableWidgets.map(
            (widget) => {
              const added =
                isAdded(
                  widget.id
                );

              return (
                <article
                  key={widget.id}
                  className="widget-library-item"
                >
                  <div>
                    <h3>
                      {
                        widget.title
                      }
                    </h3>

                    <p>
                      {
                        widget.description
                      }
                    </p>

                    <small>
                      {
                        widget.category
                      }
                    </small>
                  </div>

                  <button
                    type="button"
                    disabled={added}
                    onClick={() =>
                      onAdd(
                        widget.id
                      )
                    }
                  >
                    {added
                      ? "Added"
                      : "Add"}
                  </button>
                </article>
              );
            }
          )}

          {availableWidgets.length ===
            0 && (
            <p>
              No matching widgets found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WidgetLibrary;