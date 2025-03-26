import React, { useState, useContext } from "react";
import AuthContext from "./context/AuthContext";


const TriviaQuiz = () => {
  const { user } = useContext(AuthContext); // Moved inside the component
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean",
    },
  ];

  const handleAnswerSelect = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = async () => {
    try {
      if (user) {
        const response = await fetch("http://localhost:8000/api/submit-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId, score }),
        });

        if (!response.ok) {
          throw new Error("Failed to save score");
        }
      }
    } catch (error) {
      console.error("Error submitting quiz score:", error);
    }

    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
  };

  return (
    <div className="quiz-container">
      {showResults ? (
        <div className="quiz-card">
          <h1 className="quiz-title">Quiz Results</h1>
          <p className="quiz-subtitle">Score: {score}/{questions.length}</p>
          <button className="action-button" onClick={handleRestartQuiz}>
            Play Again
          </button>
        </div>
      ) : (
        <div className="quiz-card">
          <h2 className="question-text">{questions[currentQuestionIndex].question}</h2>
          <div className="options-container">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} className="option-button" onClick={() => handleAnswerSelect(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaQuiz;
