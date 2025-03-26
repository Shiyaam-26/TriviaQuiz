import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Gk.css";

const Java = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve user name from state or localStorage
  const [userName, setUserName] = useState(location.state?.userName || localStorage.getItem("userName") || "Your");
  
  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // ✅ Corrected key
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  const GoToIntro = () => navigate('/');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: "Which of the following is used to create an object in Java?",
      options: ["new", "create", "instance", "generate"],
      correctAnswer: "new",
    },
    {
      question: "Which keyword is used for exception handling in Java?",
      options: ["try", "catch", "throw", "All of the above"],
      correctAnswer: "All of the above",
    },
    {
      question: "What is the size of an int in Java?",
      options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
      correctAnswer: "4 bytes",
    },
    {
      question: "Which of these is not a valid Java identifier?",
      options: ["_myVar", "123var", "$value", "javaVar"],
      correctAnswer: "123var",
    },
    {
      question: "Which Java feature allows a class to inherit from multiple interfaces?",
      options: ["Multithreading", "Encapsulation", "Polymorphism", "Multiple Inheritance"],
      correctAnswer: "Multiple Inheritance",
    },
  ];

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return; // Prevent multiple selections

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;

    setSelectedAnswer(option);
    
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion.question,
        selectedAnswer: option,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
    }, 0);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="quiz-card">
        <div className="progress-container">
          <div className="progress-header">
            <p>Question {currentQuestionIndex + 1}/{questions.length}</p>
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
              className={`option-button 
                ${selectedAnswer === option ? (option === currentQuestion.correctAnswer ? "correct" : "incorrect") : ""}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
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
        <p className="quiz-subtitle">{userName}'s Score: {score}/{questions.length}</p>
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
              <p className={answer.isCorrect ? "answer-correct" : "answer-incorrect"}>
                Your answer: {answer.selectedAnswer}
              </p>
              {!answer.isCorrect && (
                <p className="correct-answer">Correct answer: {answer.correctAnswer}</p>
              )}
            </div>
          ))}
        </div>

        <button className="action-button" onClick={handleRestartQuiz}>Play Again</button>
        <br />
        <button className="action-button" onClick={GoToIntro}>Go to Home</button>
      </div>
    );
  };

  return <div className="quiz-container">{showResults ? renderResults() : renderQuestion()}</div>;
};

export default Java;
