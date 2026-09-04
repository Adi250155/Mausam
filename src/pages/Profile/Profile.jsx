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
  signOut,
} from "../../services/auth/authService";

import {
  categories,
} from "../../personalization/categories";

function Profile() {
  const navigate =
    useNavigate();

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    preferences,
    setPreferences,
  ] = useState(null);

  const [
    name,
    setName,
  ] = useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const [
          currentUser,
          userProfile,
          userPreferences,
        ] = await Promise.all([
          getCurrentUser(),
          getUserProfile(),
          getUserPreferences(),
        ]);

        setUser(
          currentUser
        );

        setProfile(
          userProfile
        );

        setPreferences(
          userPreferences
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
            (item) =>
              item !==
              categoryId
          );
        }

        return [
          ...current,
          categoryId,
        ];
      }
    );
  }

  async function handleSave() {
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
      setLoggingOut(false);
    }
  }

  function handleResetPersonalization() {
    setSelectedCategories(
      []
    );

    setMessage(
      "Select your new interests and save the profile."
    );
  }

  if (loading) {
    return (
      <div>
        <h1>
          Profile
        </h1>

        <p>
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>
          Profile
        </h1>

        <p>
          Manage your account and
          weather personalization.
        </p>
      </header>

      {message && (
        <p>{message}</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      <section>
        <h2>
          Account
        </h2>

        <p>
          Email:
          {" "}
          {user?.email ||
            "Unavailable"}
        </p>

        <label>
          Name

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
        </label>
      </section>

      <section>
        <h2>
          My Interests
        </h2>

        {categories.map(
          (category) => {
            const selected =
              selectedCategories.includes(
                category.id
              );

            return (
              <button
                type="button"
                key={category.id}
                onClick={() =>
                  toggleCategory(
                    category.id
                  )
                }
              >
                {selected
                  ? "✓ "
                  : ""}
                {category.title}
              </button>
            );
          }
        )}
      </section>

      <section>
        <button
          type="button"
          onClick={
            handleResetPersonalization
          }
        >
          Reset Interests
        </button>

        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </section>

      <section>
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
          Weather Alerts
        </button>
      </section>

      <section>
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

      <button
        type="button"
        onClick={() =>
          navigate("/home")
        }
      >
        Back to Home
      </button>
    </div>
  );
}

export default Profile;