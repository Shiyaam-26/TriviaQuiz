import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gk.css";

const Gk = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState("Guest");

  // Retrieve username from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // ✅ Corrected key
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

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
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correctAnswer: "Pacific Ocean",
    },
    {
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Michelangelo",
      ],
      correctAnswer: "Leonardo da Vinci",
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au",
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
      submitScore();
    }
  };

  // Submit the user's quiz score to the backend
  const submitScore = async () => {
    try {
      await axios.post("http://localhost:5000/api/submit-score", {
        userName,
        category: "General Knowledge",
        score,
      });
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="quiz-card">
        <div className="progress-container">
          <div className="progress-header">
            <p>
              Question {currentQuestionIndex + 1}/{questions.length}
            </p>
          </div>
          <div className="progress-bg">
            <div
              className="progress-fill"
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleAnswerSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="quiz-card">
        <h1 className="quiz-title">Quiz Results</h1>
        <p className="quiz-subtitle">
          {userName}'s Score: {score}/{questions.length}
        </p>
        <p className="quiz-subtitle">
          {score === questions.length
            ? "Perfect score! Congratulations!"
            : score >= questions.length / 2
            ? "Good job!"
            : "Better luck next time!"}
        </p>

        <div className="results-container">
          <h2 className="results-heading">Your Answers:</h2>
          {answers.map((answer, index) => (
            <div key={index} className="answer-item">
              <p className="answer-question">
                Question {index + 1}: {answer.question}
              </p>
              <p
                className={
                  answer.isCorrect ? "answer-correct" : "answer-incorrect"
                }
              >
                Your answer: {answer.selectedAnswer}
              </p>
              {!answer.isCorrect && (
                <p className="correct-answer">
                  Correct answer: {answer.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>

        <button className="action-button" onClick={handleRestartQuiz}>
          Play Again
        </button>
        <br />
        <button className="action-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {showResults ? renderResults() : renderQuestion()}
    </div>
  );
};

export default Gk;
