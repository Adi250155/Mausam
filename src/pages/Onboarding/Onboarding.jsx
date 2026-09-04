import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { categories } from "../../personalization/categories";
import { questions } from "../../personalization/questions";
import {
  saveUserPreferences,
} from "../../services/user/profileService";

function Onboarding() {
  const navigate = useNavigate();

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState([]);

  const [answers, setAnswers] =
    useState({});

  const [step, setStep] =
    useState(1);

  const [categoryIndex, setCategoryIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const toggleCategory = (
    categoryId
  ) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter(
            (id) => id !== categoryId
          )
        : [...prev, categoryId]
    );
  };

  const setSingleAnswer = (
    questionId,
    optionId
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleMultiAnswer = (
    questionId,
    optionId
  ) => {
    setAnswers((prev) => {
      const current =
        prev[questionId] || [];

      return {
        ...prev,
        [questionId]:
          current.includes(optionId)
            ? current.filter(
                (id) => id !== optionId
              )
            : [
                ...current,
                optionId,
              ],
      };
    });
  };

  const setTextAnswer = (
    questionId,
    value
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCategoryContinue =
    () => {
      if (
        selectedCategories.length ===
        0
      ) {
        setError(
          "Please select at least one category."
        );
        return;
      }

      setError("");
      setStep(2);
      setCategoryIndex(0);
    };

  const handleBack = () => {
    if (step === 1) {
      navigate("/signup");
      return;
    }

    if (categoryIndex > 0) {
      setCategoryIndex(
        (prev) => prev - 1
      );
      setError("");
      return;
    }

    setStep(1);
    setError("");
  };

  const handleQuestionContinue =
    async () => {
      const currentCategory =
        selectedCategories[
          categoryIndex
        ];

      const currentQuestions =
        questions[
          currentCategory
        ] || [];

      const unansweredQuestion =
        currentQuestions.find(
          (question) => {
            const answer =
              answers[question.id];

            if (
              question.type ===
              "multi"
            ) {
              return (
                !answer ||
                answer.length === 0
              );
            }

            return !answer;
          }
        );

      if (unansweredQuestion) {
        setError(
          "Please answer all questions before continuing."
        );
        return;
      }

      setError("");

      if (
        categoryIndex <
        selectedCategories.length - 1
      ) {
        setCategoryIndex(
          (prev) => prev + 1
        );
        return;
      }

      try {
        setLoading(true);

        await saveUserPreferences(
          selectedCategories,
          answers
        );

        localStorage.setItem(
          "mausam_user_profile",
          JSON.stringify({
            categories:
              selectedCategories,
            answers,
          })
        );

        navigate("/location");
      } catch (error) {
        console.error(
          "Failed to save preferences:",
          error
        );

        setError(
          error.message ||
            "Unable to save your preferences."
        );
      } finally {
        setLoading(false);
      }
    };

  const currentCategoryId =
    selectedCategories[
      categoryIndex
    ];

  const currentCategory =
    categories.find(
      (category) =>
        category.id ===
        currentCategoryId
    );

  const currentQuestions =
    questions[
      currentCategoryId
    ] || [];

  return (
    <div>
      {step === 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              navigate("/signup")
            }
          >
            ← Back
          </button>

          <h1>
            Personalize Your Mausam
          </h1>

          <p>
            What do you use weather
            information for?
          </p>

          {categories.map(
            (category) => {
              const selected =
                selectedCategories.includes(
                  category.id
                );

              return (
                <div
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
                    {
                      category.title
                    }
                  </button>

                  <p>
                    {
                      category.description
                    }
                  </p>
                </div>
              );
            }
          )}

          {error && (
            <p>{error}</p>
          )}

          <button
            type="button"
            onClick={
              handleCategoryContinue
            }
          >
            Continue
          </button>
        </>
      )}

      {step === 2 &&
        currentCategory && (
          <>
            <button
              type="button"
              onClick={handleBack}
            >
              ← Back
            </button>

            <p>
              Category{" "}
              {categoryIndex + 1} of{" "}
              {
                selectedCategories.length
              }
            </p>

            <h1>
              {
                currentCategory.title
              }
            </h1>

            {currentQuestions.map(
              (question) => (
                <div
                  key={question.id}
                >
                  <h2>
                    {
                      question.question
                    }
                  </h2>

                  {question.type ===
                    "single" &&
                    question.options.map(
                      (option) => {
                        const selected =
                          answers[
                            question.id
                          ] ===
                          option.id;

                        return (
                          <button
                            type="button"
                            key={
                              option.id
                            }
                            onClick={() =>
                              setSingleAnswer(
                                question.id,
                                option.id
                              )
                            }
                          >
                            {selected
                              ? "✓ "
                              : ""}

                            {
                              option.label
                            }
                          </button>
                        );
                      }
                    )}

                  {question.type ===
                    "multi" &&
                    question.options.map(
                      (option) => {
                        const selected =
                          answers[
                            question.id
                          ]?.includes(
                            option.id
                          );

                        return (
                          <button
                            type="button"
                            key={
                              option.id
                            }
                            onClick={() =>
                              toggleMultiAnswer(
                                question.id,
                                option.id
                              )
                            }
                          >
                            {selected
                              ? "✓ "
                              : ""}

                            {
                              option.label
                            }
                          </button>
                        );
                      }
                    )}

                  {question.type ===
                    "text" && (
                    <input
                      type="text"
                      placeholder={
                        question.placeholder
                      }
                      value={
                        answers[
                          question.id
                        ] || ""
                      }
                      onChange={(e) =>
                        setTextAnswer(
                          question.id,
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
              )
            )}

            {error && (
              <p>{error}</p>
            )}

            <button
              type="button"
              onClick={
                handleQuestionContinue
              }
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : categoryIndex ===
                  selectedCategories.length -
                    1
                ? "Finish Setup"
                : "Next"}
            </button>
          </>
        )}
    </div>
  );
}

export default Onboarding;