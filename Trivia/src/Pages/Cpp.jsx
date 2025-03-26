import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gk.css";

const Cpp = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  const questions = [
    {
      question: "Which of the following is the correct extension for a C++ file?",
      options: [".c", ".cpp", ".java", ".py"],
      correctAnswer: ".cpp",
    },
    {
      question: "What is the output of 'cout << 5 / 2;' in C++?",
      options: ["2.5", "2", "2.0", "Error"],
      correctAnswer: "2",
    },
    {
      question: "Which feature in C++ allows multiple functions to have the same name but different parameters?",
      options: ["Function Overloading", "Encapsulation", "Polymorphism", "Inheritance"],
      correctAnswer: "Function Overloading",
    },
    {
      question: "Which operator is used to access the address of a variable in C++?",
      options: ["*", "&", "->", "%"],
      correctAnswer: "&",
    },
    {
      question: "Which of the following is a correct way to declare a pointer in C++?",
      options: ["int ptr;", "int *ptr;", "pointer<int> ptr;", "int ptr*;"],
      correctAnswer: "int *ptr;",
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

  const submitScore = async () => {
    try {
      await axios.post("http://localhost:5000/api/submit-score", {
        userName,
        category: "C++",
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

  return (
    <div className="quiz-container">
      {showResults ? (
        <div className="quiz-card">
          <h1>Quiz Results</h1>
          <p>
            <strong>{userName}'s Score:</strong> {score}/{questions.length}
          </p>
          <p>{score === questions.length ? "🎉 Congratulations! Perfect score!" : "Better luck next time!"}</p>

          {/* ✅ Display detailed answers */}
          <h3>Your Answers:</h3>
          <div className="answers-list">
            {answers.map((ans, index) => (
              <div key={index} className="answer-card">
                <p>
                  <strong>Question {index + 1}: {ans.question}</strong>
                </p>
                <p style={{ color: ans.isCorrect ? "green" : "red" }}>
                  Your answer: {ans.selectedAnswer}
                </p>
                <p style={{ color: "green" }}>Correct answer: {ans.correctAnswer}</p>
              </div>
            ))}
          </div>

          {/* ✅ Restart & Home buttons */}
          <button className="action-button" onClick={handleRestartQuiz}>Play Again</button>
          <button className="action-button" onClick={() => navigate("/")}>Go to Home</button>
        </div>
      ) : (
        <div className="quiz-card">
          <h2>{questions[currentQuestionIndex].question}</h2>
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

export default Cpp;
