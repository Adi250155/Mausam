import {
  getPersonalizedWidgets,
} from "../../personalization/widgetEngine";

import WidgetRenderer from "../../components/widgets/WidgetRenderer";

function Home() {
  const storedProfile = localStorage.getItem(
    "mausam_user_profile"
  );

  const userProfile = storedProfile
    ? JSON.parse(storedProfile)
    : null;

  const selectedCategories =
    userProfile?.categories || [];

  const widgets =
    getPersonalizedWidgets(selectedCategories);

  return (
    <div>
      <h1>Mausam</h1>

      <h2>Personalized Home</h2>

      {selectedCategories.length > 0 ? (
        <>
          <p>
            Your interests:{" "}
            {selectedCategories.join(", ")}
          </p>

          <div>
            {widgets.map((widget) => (
              <WidgetRenderer
                key={widget}
                widget={widget}
              />
            ))}
          </div>
        </>
      ) : (
        <div>
          <p>
            Complete personalization setup first.
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;