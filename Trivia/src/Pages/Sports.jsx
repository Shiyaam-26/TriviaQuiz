import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Gk.css";

const Sports = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState("Guest");

  // ✅ Retrieve username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUserName(storedUser);
    } else {
      setUserName("Guest");
    }
  }, []);

  const questions = [
    {
      question: "Who is known as the 'God of Cricket'?",
      options: ["Virat Kohli", "Ricky Ponting", "Sachin Tendulkar", "M.S. Dhoni"],
      correctAnswer: "Sachin Tendulkar",
    },
    {
      question: "Which country won the first-ever ICC Cricket World Cup in 1975?",
      options: ["India", "Australia", "West Indies", "England"],
      correctAnswer: "West Indies",
    },
    {
      question: "How many players are there in a cricket team?",
      options: ["9", "10", "11", "12"],
      correctAnswer: "11",
    },
    {
      question: "Which bowler has taken the most wickets in Test cricket?",
      options: ["Shane Warne", "Anil Kumble", "James Anderson", "Muttiah Muralitharan"],
      correctAnswer: "Muttiah Muralitharan",
    },
    {
      question: "What is the highest individual score in One Day Internationals (ODIs)?",
      options: ["264", "200", "237", "275"],
      correctAnswer: "264",
    },
  ];

  // ✅ Handle user selecting an answer
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

  // ✅ Submit score to backend
  const submitScore = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/submit-score", {
        userName,
        category: "Sports",
        score,
      });
      console.log("Score submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting score:", error.response ? error.response.data : error.message);
    }
  };

  // ✅ Restart quiz function
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

export default Sports;
