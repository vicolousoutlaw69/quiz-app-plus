import React, { useState, useEffect } from "react";
import questions from "./data/railway_quiz_all_1000_questions.json";
import "./App.css";

function App() {
  const [currentSet, setCurrentSet] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questionsPerSet = 50;
  const totalSets = Math.ceil(questions.length / questionsPerSet);
  const currentSetQuestions = questions.slice(
    currentSet * questionsPerSet,
    (currentSet + 1) * questionsPerSet
  );

  const currentQuestion = currentSetQuestions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    if (answered) return;

    setSelectedOption(option);
    setAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setAnswered(false);
      if (currentQuestionIndex + 1 < currentSetQuestions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const handleNextSet = () => {
    setCurrentSet((prev) => Math.min(prev + 1, totalSets - 1));
    resetQuiz();
  };

  const handlePrevSet = () => {
    setCurrentSet((prev) => Math.max(prev - 1, 0));
    resetQuiz();
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  return (
    <div className="app container">
      <div className="quiz-header">
        <h1>Indian Railway Quiz Game</h1>
        <h2>Set {currentSet + 1} of {totalSets}</h2>
      </div>

      {showResult ? (
        <div className="result-screen">
          <h3>Your Score: {score} / {currentSetQuestions.length}</h3>
          <div className="set-controls">
            <button className="nav-button" onClick={handlePrevSet} disabled={currentSet === 0}>
              Previous Set
            </button>
            <button className="nav-button" onClick={handleNextSet} disabled={currentSet === totalSets - 1}>
              Next Set
            </button>
          </div>
        </div>
      ) : (
        <div className="question-box">
          <div className="question-text">
            Q{currentQuestionIndex + 1}: {currentQuestion.question}
          </div>
          <div className="options">
            {Object.entries(currentQuestion.options).map(([key, value], index) => (
              <button
                key={index}
                className={`option-button ${selectedOption === key
                  ? key === currentQuestion.answer
                    ? "correct"
                    : "wrong"
                  : ""
                  }`}
                onClick={() => handleOptionClick(key)}
              >
                {key}. {value}
              </button>
            ))}
          </div>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default App;

