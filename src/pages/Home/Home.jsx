import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getUserPreferences,
  getSavedLocations,
} from "../../services/user/profileService";

import {
  getWeather,
  getAirQuality,
  getMarineWeather,
} from "../../services/weather/weatherService";

import {
  getPersonalizedWidgets,
} from "../../personalization/widgetEngine";

import {
  getUserWidgets,
  toggleWidgetPin,
  hideWidget,
  addWidget,
} from "../../services/user/widgetService";

import {
  getWidgetById,
} from "../../personalization/widgetCatalog";

import WidgetRenderer from "../../components/widgets/WidgetRenderer";
import WidgetCard from "../../components/widgets/WidgetCard";
import WidgetLibrary from "../../components/widgets/WidgetLibrary";
import WeatherHero from "../../components/home/WeatherHero";

import LogoutButton from "../../components/auth/LogoutButton";
import BottomNavigation from "../../components/navigation/BottomNavigation";

function Home() {
  const [
    preferences,
    setPreferences,
  ] = useState(null);

  const [
    location,
    setLocation,
  ] = useState(null);

  const [
    weather,
    setWeather,
  ] = useState(null);

  const [
    airQuality,
    setAirQuality,
  ] = useState(null);

  const [
    marine,
    setMarine,
  ] = useState(null);

  const [
    userWidgets,
    setUserWidgets,
  ] = useState([]);

  const [
    showWidgetLibrary,
    setShowWidgetLibrary,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    widgetError,
    setWidgetError,
  ] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          preferencesData,
          locationsData,
          userWidgetsData,
        ] = await Promise.all([
          getUserPreferences(),
          getSavedLocations(),
          getUserWidgets(),
        ]);

        if (!preferencesData) {
          throw new Error(
            "Complete personalization first."
          );
        }

        if (
          !locationsData?.length
        ) {
          throw new Error(
            "No saved location found."
          );
        }

        const primary =
          locationsData.find(
            (item) =>
              item.is_primary
          ) ||
          locationsData[0];

        setPreferences(
          preferencesData
        );

        setLocation(
          primary
        );

        setUserWidgets(
          userWidgetsData || []
        );

        const categories =
          preferencesData.interests ||
          [];

        const [
          weatherData,
          airData,
        ] = await Promise.all([
          getWeather(
            primary.latitude,
            primary.longitude
          ),

          getAirQuality(
            primary.latitude,
            primary.longitude
          ),
        ]);

        setWeather(
          weatherData
        );

        setAirQuality(
          airData
        );

        if (
          categories.includes(
            "beach"
          )
        ) {
          try {
            const marineData =
              await getMarineWeather(
                primary.latitude,
                primary.longitude
              );

            setMarine(
              marineData
            );
          } catch (marineError) {
            console.warn(
              "Marine data unavailable:",
              marineError
            );

            setMarine(null);
          }
        } else {
          setMarine(null);
        }
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const categories =
    preferences?.interests ||
    [];

  const answers =
    preferences?.answers ||
    {};

  const defaultWidgets =
    useMemo(
      () =>
        getPersonalizedWidgets(
          categories,
          weather
        ),
      [
        categories,
        weather,
      ]
    );

  const userWidgetMap =
    useMemo(() => {
      const map =
        new Map();

      userWidgets.forEach(
        (item) => {
          map.set(
            item.widget_id,
            item
          );
        }
      );

      return map;
    }, [userWidgets]);

  const finalWidgets =
    useMemo(() => {
      const combined = [
        ...defaultWidgets,
      ];

      userWidgets.forEach(
        (item) => {
          if (
            !combined.includes(
              item.widget_id
            ) &&
            !item.is_hidden
          ) {
            combined.push(
              item.widget_id
            );
          }
        }
      );

      return combined
        .filter(
          (widgetId) => {
            const preference =
              userWidgetMap.get(
                widgetId
              );

            return !preference
              ?.is_hidden;
          }
        )
        .sort(
          (a, b) => {
            const aPreference =
              userWidgetMap.get(
                a
              );

            const bPreference =
              userWidgetMap.get(
                b
              );

            const aPinned =
              aPreference?.is_pinned
                ? 1
                : 0;

            const bPinned =
              bPreference?.is_pinned
                ? 1
                : 0;

            if (
              aPinned !==
              bPinned
            ) {
              return (
                bPinned -
                aPinned
              );
            }

            const aPosition =
              aPreference?.position;

            const bPosition =
              bPreference?.position;

            if (
              aPosition != null &&
              bPosition != null
            ) {
              return (
                aPosition -
                bPosition
              );
            }

            return 0;
          }
        );
    }, [
      defaultWidgets,
      userWidgets,
      userWidgetMap,
    ]);

  async function handlePin(
    widgetId,
    pinned
  ) {
    try {
      setWidgetError("");

      const updated =
        await toggleWidgetPin(
          widgetId,
          pinned
        );

      setUserWidgets(
        (current) => {
          const exists =
            current.some(
              (item) =>
                item.widget_id ===
                widgetId
            );

          if (!exists) {
            return [
              ...current,
              updated,
            ];
          }

          return current.map(
            (item) =>
              item.widget_id ===
              widgetId
                ? updated
                : item
          );
        }
      );
    } catch (err) {
      console.error(
        "Pin widget error:",
        err
      );

      setWidgetError(
        err.message ||
          "Unable to update widget."
      );
    }
  }

  async function handleDelete(
    widgetId
  ) {
    try {
      setWidgetError("");

      const existing =
        userWidgetMap.get(
          widgetId
        );

      if (existing) {
        await hideWidget(
          widgetId
        );

        setUserWidgets(
          (current) =>
            current.map(
              (item) =>
                item.widget_id ===
                widgetId
                  ? {
                      ...item,
                      is_hidden:
                        true,
                    }
                  : item
            )
        );

        return;
      }

      /*
       * Default widgets which have never been
       * stored become hidden when deleted.
       */
      setUserWidgets(
        (current) => [
          ...current,
          {
            widget_id:
              widgetId,
            is_hidden: true,
            is_pinned: false,
            position:
              current.length,
          },
        ]
      );

      const updated =
        await toggleWidgetPin(
          widgetId,
          false
        );

      await hideWidget(
        widgetId
      );

      setUserWidgets(
        (current) =>
          current.map(
            (item) =>
              item.widget_id ===
              widgetId
                ? {
                    ...updated,
                    is_hidden:
                      true,
                  }
                : item
          )
      );
    } catch (err) {
      console.error(
        "Delete widget error:",
        err
      );

      setWidgetError(
        err.message ||
          "Unable to remove widget."
      );
    }
  }

  async function handleAddWidget(
    widgetId
  ) {
    try {
      setWidgetError("");

      const updated =
        await addWidget(
          widgetId
        );

      setUserWidgets(
        (current) => {
          const exists =
            current.some(
              (item) =>
                item.widget_id ===
                widgetId
            );

          if (!exists) {
            return [
              ...current,
              updated,
            ];
          }

          return current.map(
            (item) =>
              item.widget_id ===
              widgetId
                ? updated
                : item
          );
        }
      );
    } catch (err) {
      console.error(
        "Add widget error:",
        err
      );

      setWidgetError(
        err.message ||
          "Unable to add widget."
      );
    }
  }

  const existingWidgetIds =
    finalWidgets;

  if (loading) {
    return (
      <div className="app-state">
        <div className="state-loader">
          <span>
            ☁️
          </span>

          <h1>
            Loading Mausam
          </h1>

          <p>
            Preparing your weather dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-state">
        <div className="state-card">
          <div className="state-icon">
            ⚠️
          </div>

          <h1>
            Something went wrong
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

          <LogoutButton />
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="mausam-page">
      <header className="home-header">
        <div className="home-brand">
          <span>
            MAUSAM
          </span>

          <small>
            Personalized weather
          </small>
        </div>

        <button
          type="button"
          className="add-widget-button"
          onClick={() =>
            setShowWidgetLibrary(
              true
            )
          }
        >
          <span>
            +
          </span>
          Add Widget
        </button>
      </header>

      <main className="home-content">
        <WeatherHero
          location={location}
          weather={weather}
          airQuality={airQuality}
        />

        {widgetError && (
          <div className="widget-error">
            {widgetError}
          </div>
        )}

        <div className="widget-section-header">
          <div>
            <span>
              YOUR DASHBOARD
            </span>

            <h2>
              Weather insights
            </h2>
          </div>

          <span className="widget-count">
            {finalWidgets.length}
          </span>
        </div>

        {finalWidgets.length === 0 ? (
          <section className="empty-widget-state">
            <div className="empty-widget-icon">
              ＋
            </div>

            <h2>
              Build your dashboard
            </h2>

            <p>
              Add the weather information
              that matters most to you.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowWidgetLibrary(
                  true
                )
              }
            >
              Add Widget
            </button>
          </section>
        ) : (
          <div className="widget-list">
            {finalWidgets.map(
              (widgetId) => {
                const widget =
                  getWidgetById(
                    widgetId
                  );

                const preference =
                  userWidgetMap.get(
                    widgetId
                  );

                return (
                  <WidgetCard
                    key={
                      widgetId
                    }
                    widgetId={
                      widgetId
                    }
                    title={
                      widget?.title ||
                      widgetId
                    }
                    pinned={
                      Boolean(
                        preference?.is_pinned
                      )
                    }
                    onPin={
                      handlePin
                    }
                    onDelete={
                      handleDelete
                    }
                  >
                    <WidgetRenderer
                      widget={
                        widgetId
                      }
                      weather={
                        weather
                      }
                      airQuality={
                        airQuality
                      }
                      marine={
                        marine
                      }
                      answers={
                        answers
                      }
                    />
                  </WidgetCard>
                );
              }
            )}
          </div>
        )}
      </main>

      <footer className="home-footer">
        <LogoutButton />
      </footer>

      <BottomNavigation />

      {showWidgetLibrary && (
        <WidgetLibrary
          existingWidgets={
            existingWidgetIds
          }
          onAdd={
            handleAddWidget
          }
          onClose={() =>
            setShowWidgetLibrary(
              false
            )
          }
        />
      )}
    </div>
  );
}

export default Home;