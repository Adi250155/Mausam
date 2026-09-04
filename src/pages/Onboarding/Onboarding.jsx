import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  categories,
} from "../../personalization/categories";

import {
  getUserPreferences,
  saveUserPreferences,
} from "../../services/user/profileService";

function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const totalSteps = 2;

  useEffect(() => {
    async function loadPreferences() {
      try {
        setLoading(true);
        setError("");

        const existing =
          await getUserPreferences();

        if (existing) {
          setSelectedCategories(
            existing.interests || []
          );

          setAnswers(
            existing.answers || {}
          );
        }
      } catch (err) {
        console.error(
          "Onboarding load error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your preferences."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, []);

  const selectedCategoryObjects = useMemo(
    () =>
      categories.filter((category) =>
        selectedCategories.includes(
          category.id
        )
      ),
    [selectedCategories]
  );

  function toggleCategory(categoryId) {
    setSelectedCategories((current) => {
      if (current.includes(categoryId)) {
        return current.filter(
          (id) => id !== categoryId
        );
      }

      return [
        ...current,
        categoryId,
      ];
    });
  }

  function updateAnswer(
    categoryId,
    key,
    value
  ) {
    setAnswers((current) => ({
      ...current,
      [categoryId]: {
        ...(current[categoryId] || {}),
        [key]: value,
      },
    }));
  }

  function goToQuestions() {
    if (selectedCategories.length === 0) {
      setError(
        "Please select at least one interest."
      );
      return;
    }

    setError("");
    setStep(2);
  }

  async function finishOnboarding() {
    try {
      setSaving(true);
      setError("");

      await saveUserPreferences(
        selectedCategories,
        answers
      );

      navigate("/location", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Onboarding save error:",
        err
      );

      setError(
        err.message ||
          "Unable to save your preferences."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (step === 1) {
      navigate(-1);
      return;
    }

    setError("");
    setStep(1);
  }

  function renderQuestionCard(category) {
    const categoryAnswers =
      answers[category.id] || {};

    switch (category.id) {
      case "travel":
        return (
          <section key={category.id}>
            <h2>Travel</h2>

            <p>
              What type of travel do you usually
              plan?
            </p>

            <div>
              {[
                "domestic",
                "international",
                "both",
              ].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() =>
                    updateAnswer(
                      category.id,
                      "travelType",
                      value
                    )
                  }
                >
                  {categoryAnswers.travelType ===
                  value
                    ? "✓ "
                    : ""}
                  {value}
                </button>
              ))}
            </div>

            <p>
              What information matters most?
            </p>

            {[
              "rain",
              "temperature",
              "severeWeather",
              "wind",
              "visibility",
              "packing",
            ].map((value) => {
              const selected =
                categoryAnswers.importantInfo?.includes(
                  value
                );

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const current =
                      categoryAnswers.importantInfo ||
                      [];

                    const next = selected
                      ? current.filter(
                          (item) =>
                            item !== value
                        )
                      : [...current, value];

                    updateAnswer(
                      category.id,
                      "importantInfo",
                      next
                    );
                  }}
                >
                  {selected ? "✓ " : ""}
                  {value}
                </button>
              );
            })}
          </section>
        );

      case "agriculture":
        return (
          <section key={category.id}>
            <h2>
              Farming & Gardening
            </h2>

            <p>
              Which one describes you?
            </p>

            {[
              "farmer",
              "gardener",
              "both",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "userType",
                    value
                  )
                }
              >
                {categoryAnswers.userType ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}

            <label>
              Crop / Plant name

              <input
                type="text"
                placeholder="e.g. Rice, Wheat, Tomato"
                value={
                  categoryAnswers.cropName ||
                  ""
                }
                onChange={(event) =>
                  updateAnswer(
                    category.id,
                    "cropName",
                    event.target.value
                  )
                }
              />
            </label>

            <p>
              What information is important?
            </p>

            {[
              "rainfall",
              "soilMoisture",
              "temperature",
              "humidity",
              "wind",
              "frost",
            ].map((value) => {
              const selected =
                categoryAnswers.importantInfo?.includes(
                  value
                );

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const current =
                      categoryAnswers.importantInfo ||
                      [];

                    const next = selected
                      ? current.filter(
                          (item) =>
                            item !== value
                        )
                      : [...current, value];

                    updateAnswer(
                      category.id,
                      "importantInfo",
                      next
                    );
                  }}
                >
                  {selected ? "✓ " : ""}
                  {value}
                </button>
              );
            })}
          </section>
        );

      case "fitness":
        return (
          <section key={category.id}>
            <h2>
              Outdoor Fitness
            </h2>

            <p>
              Which activities do you do?
            </p>

            {[
              "running",
              "cycling",
              "walking",
              "outdoorWorkout",
            ].map((value) => {
              const selected =
                categoryAnswers.activities?.includes(
                  value
                );

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const current =
                      categoryAnswers.activities ||
                      [];

                    const next = selected
                      ? current.filter(
                          (item) =>
                            item !== value
                        )
                      : [...current, value];

                    updateAnswer(
                      category.id,
                      "activities",
                      next
                    );
                  }}
                >
                  {selected ? "✓ " : ""}
                  {value}
                </button>
              );
            })}

            <p>
              Preferred workout time
            </p>

            {[
              "morning",
              "afternoon",
              "evening",
              "any",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "preferredTime",
                    value
                  )
                }
              >
                {categoryAnswers.preferredTime ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}
          </section>
        );

      case "health":
        return (
          <section key={category.id}>
            <h2>
              Health & Wellness
            </h2>

            <p>
              Which information matters most?
            </p>

            {[
              "aqi",
              "pollen",
              "uv",
              "humidity",
              "heat",
            ].map((value) => {
              const selected =
                categoryAnswers.importantInfo?.includes(
                  value
                );

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const current =
                      categoryAnswers.importantInfo ||
                      [];

                    const next = selected
                      ? current.filter(
                          (item) =>
                            item !== value
                        )
                      : [...current, value];

                    updateAnswer(
                      category.id,
                      "importantInfo",
                      next
                    );
                  }}
                >
                  {selected ? "✓ " : ""}
                  {value}
                </button>
              );
            })}
          </section>
        );

      case "family":
        return (
          <section key={category.id}>
            <h2>
              Family
            </h2>

            <p>
              Who should weather information
              prioritize?
            </p>

            {[
              "children",
              "elderly",
              "everyone",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "familyType",
                    value
                  )
                }
              >
                {categoryAnswers.familyType ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}
          </section>
        );

      case "commuter":
        return (
          <section key={category.id}>
            <h2>
              Commuting
            </h2>

            <p>
              When do you usually commute?
            </p>

            {[
              "morning",
              "afternoon",
              "evening",
              "multiple",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "commuteTime",
                    value
                  )
                }
              >
                {categoryAnswers.commuteTime ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}
          </section>
        );

      case "beach":
        return (
          <section key={category.id}>
            <h2>
              Beach & Surf
            </h2>

            <p>
              What do you usually do?
            </p>

            {[
              "swimming",
              "surfing",
              "beach",
              "fishing",
            ].map((value) => {
              const selected =
                categoryAnswers.activities?.includes(
                  value
                );

              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const current =
                      categoryAnswers.activities ||
                      [];

                    const next = selected
                      ? current.filter(
                          (item) =>
                            item !== value
                        )
                      : [...current, value];

                    updateAnswer(
                      category.id,
                      "activities",
                      next
                    );
                  }}
                >
                  {selected ? "✓ " : ""}
                  {value}
                </button>
              );
            })}
          </section>
        );

      case "events":
        return (
          <section key={category.id}>
            <h2>
              Outdoor Events
            </h2>

            <p>
              What type of event do you organize?
            </p>

            {[
              "wedding",
              "sports",
              "festival",
              "gathering",
              "other",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "eventType",
                    value
                  )
                }
              >
                {categoryAnswers.eventType ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}

            <p>
              Preferred event time
            </p>

            {[
              "morning",
              "afternoon",
              "evening",
              "any",
            ].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() =>
                  updateAnswer(
                    category.id,
                    "preferredTime",
                    value
                  )
                }
              >
                {categoryAnswers.preferredTime ===
                value
                  ? "✓ "
                  : ""}
                {value}
              </button>
            ))}
          </section>
        );

      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div>
        <h1>
          Personalize Mausam
        </h1>

        <p>
          Loading your preferences...
        </p>
      </div>
    );
  }

  return (
    <div>
      <header>
        <p>
          Step {step} of {totalSteps}
        </p>

        <div
          aria-label={`Step ${step} of ${totalSteps}`}
        >
          <progress
            value={step}
            max={totalSteps}
          />
        </div>

        <h1>
          {step === 1
            ? "What matters to you?"
            : "Tell us a little more"}
        </h1>

        <p>
          {step === 1
            ? "Choose the weather information you care about."
            : "These answers help Mausam personalize your dashboard."}
        </p>
      </header>

      {error && (
        <p>
          {error}
        </p>
      )}

      <main>
        {step === 1 ? (
          <section>
            {categories.map(
              (category) => {
                const selected =
                  selectedCategories.includes(
                    category.id
                  );

                return (
                  <article
                    key={category.id}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          category.id
                        )
                      }
                    >
                      {selected
                        ? "✓ "
                        : ""}
                      <strong>
                        {category.title}
                      </strong>

                      <br />

                      <small>
                        {
                          category.description
                        }
                      </small>
                    </button>
                  </article>
                );
              }
            )}
          </section>
        ) : (
          <div>
            {selectedCategoryObjects.map(
              renderQuestionCard
            )}
          </div>
        )}
      </main>

      <footer>
        <button
          type="button"
          onClick={handleBack}
          disabled={saving}
        >
          Back
        </button>

        {step === 1 ? (
          <button
            type="button"
            onClick={
              goToQuestions
            }
            disabled={
              selectedCategories.length ===
                0
            }
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={
              finishOnboarding
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Finish"}
          </button>
        )}
      </footer>
    </div>
  );
}

export default Onboarding;