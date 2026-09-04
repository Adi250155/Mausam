import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  getUserProfile,
  getUserPreferences,
  updateUserProfile,
  saveUserPreferences,
} from "../../services/user/profileService";

import {
  getAlertPreferences,
  saveAlertPreferences,
} from "../../services/user/alertPreferenceService";

import {
  signOut,
} from "../../services/auth/authService";

import {
  categories,
} from "../../personalization/categories";

import BottomNavigation from "../../components/navigation/BottomNavigation";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] =
    useState(null);

  const [
    alertPreferences,
    setAlertPreferences,
  ] = useState({
    rain: true,
    storm: true,
    heat: true,
    aqi: true,
    uv: true,
    visibility: true,
  });

  const [name, setName] =
    useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    savingAlerts,
    setSavingAlerts,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const [
          currentUser,
          userProfile,
          userPreferences,
          userAlertPreferences,
        ] = await Promise.all([
          getCurrentUser(),
          getUserProfile(),
          getUserPreferences(),
          getAlertPreferences(),
        ]);

        setUser(currentUser);
        setProfile(userProfile);
        setPreferences(
          userPreferences
        );

        setAlertPreferences(
          userAlertPreferences
        );

        setName(
          userProfile?.full_name ||
            ""
        );

        setSelectedCategories(
          userPreferences
            ?.interests || []
        );
      } catch (err) {
        console.error(
          "Profile loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function toggleCategory(
    categoryId
  ) {
    setSelectedCategories(
      (current) => {
        if (
          current.includes(
            categoryId
          )
        ) {
          return current.filter(
            (id) =>
              id !== categoryId
          );
        }

        return [
          ...current,
          categoryId,
        ];
      }
    );
  }

  function toggleAlert(
    alertType
  ) {
    setAlertPreferences(
      (current) => ({
        ...current,
        [alertType]:
          !current[alertType],
      })
    );
  }

  async function handleSaveProfile() {
    if (
      selectedCategories.length ===
      0
    ) {
      setError(
        "Select at least one interest."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedProfile =
        await updateUserProfile({
          full_name: name,
        });

      const updatedPreferences =
        await saveUserPreferences(
          selectedCategories,
          preferences?.answers ||
            {}
        );

      setProfile(
        updatedProfile
      );

      setPreferences(
        updatedPreferences
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAlerts() {
    try {
      setSavingAlerts(true);
      setError("");
      setMessage("");

      const updated =
        await saveAlertPreferences(
          alertPreferences
        );

      setAlertPreferences(
        updated
      );

      setMessage(
        "Alert preferences saved."
      );
    } catch (err) {
      console.error(
        "Alert preference error:",
        err
      );

      setError(
        err.message ||
          "Unable to save alert preferences."
      );
    } finally {
      setSavingAlerts(
        false
      );
    }
  }

  function resetInterests() {
    setSelectedCategories(
      []
    );

    setMessage(
      "Select your new interests and save the profile."
    );
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      setError("");

      await signOut();

      navigate("/", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Logout error:",
        err
      );

      setError(
        err.message ||
          "Unable to logout."
      );
    } finally {
      setLoggingOut(
        false
      );
    }
  }

  if (loading) {
    return (
      <div className="app-state">
        <div className="state-loader">
          <span>◉</span>

          <h1>
            Loading profile
          </h1>

          <p>
            Preparing your settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mausam-page">
      <header className="page-header">
        <span className="page-kicker">
          ACCOUNT
        </span>

        <h1>Profile</h1>

        <p>
          Manage personalization and
          alert preferences.
        </p>
      </header>

      <main className="page-content">
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="widget-error">
            {error}
          </div>
        )}

        <section className="settings-card">
          <div className="settings-heading">
            <span className="settings-icon">
              👤
            </span>

            <div>
              <h2>
                Account
              </h2>

              <p>
                Your account information
              </p>
            </div>
          </div>

          <div className="setting-field">
            <label>
              Email
            </label>

            <input
              type="email"
              value={
                user?.email || ""
              }
              disabled
            />
          </div>

          <div className="setting-field">
            <label>
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Your name"
            />
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-heading">
            <span className="settings-icon">
              ✨
            </span>

            <div>
              <h2>
                Interests
              </h2>

              <p>
                Control what appears on
                your home screen.
              </p>
            </div>
          </div>

          <div className="profile-category-grid">
            {categories.map(
              (category) => {
                const selected =
                  selectedCategories.includes(
                    category.id
                  );

                return (
                  <button
                    type="button"
                    key={
                      category.id
                    }
                    className={
                      selected
                        ? "profile-category selected"
                        : "profile-category"
                    }
                    onClick={() =>
                      toggleCategory(
                        category.id
                      )
                    }
                  >
                    <strong>
                      {selected
                        ? "✓ "
                        : ""}
                      {
                        category.title
                      }
                    </strong>

                    <small>
                      {
                        category.description
                      }
                    </small>
                  </button>
                );
              }
            )}
          </div>

          <div className="settings-actions">
            <button
              type="button"
              onClick={
                resetInterests
              }
            >
              Reset
            </button>

            <button
              type="button"
              onClick={
                handleSaveProfile
              }
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-heading">
            <span className="settings-icon">
              🔔
            </span>

            <div>
              <h2>
                Alert Preferences
              </h2>

              <p>
                Choose which weather alerts
                you care about.
              </p>
            </div>
          </div>

          {[
            ["rain", "Rain Alerts"],
            ["storm", "Storm Alerts"],
            ["heat", "Heat Alerts"],
            ["aqi", "Air Quality Alerts"],
            ["uv", "UV Alerts"],
            [
              "visibility",
              "Visibility Alerts",
            ],
          ].map(
            ([key, title]) => (
              <button
                type="button"
                key={key}
                className="alert-setting"
                onClick={() =>
                  toggleAlert(
                    key
                  )
                }
              >
                <span>
                  {title}
                </span>

                <span
                  className={
                    alertPreferences[
                      key
                    ]
                      ? "toggle toggle-on"
                      : "toggle"
                  }
                >
                  <span />
                </span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={
              handleSaveAlerts
            }
            disabled={
              savingAlerts
            }
          >
            {savingAlerts
              ? "Saving..."
              : "Save Alert Preferences"}
          </button>
        </section>

        <section className="settings-card">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/saved-locations"
              )
            }
          >
            Manage Saved Locations
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/alerts"
              )
            }
          >
            View Alerts
          </button>
        </section>

        <section className="settings-card danger-card">
          <button
            type="button"
            onClick={
              handleLogout
            }
            disabled={
              loggingOut
            }
          >
            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default Profile;