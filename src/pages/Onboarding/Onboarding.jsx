import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../../personalization/categories";
import { questions } from "../../personalization/questions";

function Onboarding() {
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(1);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const setSingleAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const toggleMultiAnswer = (questionId, optionId) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];

      return {
        ...prev,
        [questionId]: currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId],
      };
    });
  };

  const setTextAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCategoryContinue = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    setStep(2);
    setCategoryIndex(0);
  };

  const handleQuestionContinue = () => {
    const currentCategory = selectedCategories[categoryIndex];
    const currentQuestions = questions[currentCategory] || [];

    const unansweredQuestion = currentQuestions.find((question) => {
      const answer = answers[question.id];

      if (question.type === "multi") {
        return !answer || answer.length === 0;
      }

      return !answer;
    });

    if (unansweredQuestion) {
      alert("Please answer all questions before continuing.");
      return;
    }

    if (categoryIndex < selectedCategories.length - 1) {
      setCategoryIndex((prev) => prev + 1);
    } else {
      const userProfile = {
        categories: selectedCategories,
        answers,
      };

      localStorage.setItem(
        "mausam_user_profile",
        JSON.stringify(userProfile)
      );

      console.log("Saved user profile:", userProfile);

      navigate("/home");
    }
  };

  const currentCategoryId = selectedCategories[categoryIndex];

  const currentCategory = categories.find(
    (category) => category.id === currentCategoryId
  );

  const currentQuestions =
    questions[currentCategoryId] || [];

  return (
    <div>
      {step === 1 && (
        <>
          <h1>Personalize Your Mausam</h1>

          <p>
            What do you use weather information for?
          </p>

          {categories.map((category) => {
            const selected = selectedCategories.includes(category.id);

            return (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                >
                  {selected ? "✓ " : ""}
                  {category.title}
                </button>

                <p>{category.description}</p>
              </div>
            );
          })}

          <button onClick={handleCategoryContinue}>
            Continue
          </button>
        </>
      )}

      {step === 2 && currentCategory && (
        <>
          <p>
            Category {categoryIndex + 1} of{" "}
            {selectedCategories.length}
          </p>

          <h1>{currentCategory.title}</h1>

          {currentQuestions.map((question) => (
            <div key={question.id}>
              <h2>{question.question}</h2>

              {question.type === "single" &&
                question.options.map((option) => {
                  const selected =
                    answers[question.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        setSingleAnswer(
                          question.id,
                          option.id
                        )
                      }
                    >
                      {selected ? "✓ " : ""}
                      {option.label}
                    </button>
                  );
                })}

              {question.type === "multi" &&
                question.options.map((option) => {
                  const selected =
                    answers[question.id]?.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        toggleMultiAnswer(
                          question.id,
                          option.id
                        )
                      }
                    >
                      {selected ? "✓ " : ""}
                      {option.label}
                    </button>
                  );
                })}

              {question.type === "text" && (
                <input
                  type="text"
                  placeholder={question.placeholder}
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    setTextAnswer(
                      question.id,
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}

          <button onClick={handleQuestionContinue}>
            {categoryIndex === selectedCategories.length - 1
              ? "Finish Setup"
              : "Next"}
          </button>
        </>
      )}
    </div>
  );
}

export default Onboarding;