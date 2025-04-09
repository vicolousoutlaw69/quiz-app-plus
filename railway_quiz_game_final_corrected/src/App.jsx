import React, { useState } from 'react';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import questions from './data/final_corrected_and_verified_questions.json';
import correctSound from './data/correct.mp3';
import wrongSound from './data/wrong.mp3';
import './App.css';

function App() {
  const questionsPerSet = 50;
  const totalSets = 20;

  const [currentSet, setCurrentSet] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [rightScore, setRightScore] = useState(0);
  const [wrongScore, setWrongScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const [playCorrect] = useSound(correctSound);
  const [playWrong] = useSound(wrongSound);

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
      setRightScore(rightScore + 1);
      playCorrect();
      setIsCorrect(true);
    } else {
      setWrongScore(wrongScore + 1);
      playWrong();
      setIsCorrect(false);
      document.body.style.backgroundColor = '#ffcccc';
    }
  };

  const goToNextQuestion = () => {
    document.body.style.backgroundColor = '';
    setSelectedOption(null);
    setAnswered(false);
    setIsCorrect(null);
    if (currentQuestionIndex < questionsPerSet - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswered(false);
    setRightScore(0);
    setWrongScore(0);
  };

  return (
    <div className="app container">
      <div className="quiz-header">
        <button className="nav-button" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>← Back</button>
        <h1>Indian Railway Quiz Game</h1>
        <h2>Set {currentSet + 1} of {totalSets}</h2>
        <select onChange={(e) => {setCurrentSet(Number(e.target.value)); resetQuiz();}} value={currentSet}>
          {[...Array(totalSets)].map((_, idx) => (
            <option key={idx} value={idx}>Set {idx + 1}</option>
          ))}
        </select>
      </div>

      {isCorrect && <Confetti />}

      {showResult ? (
        <div className="result-screen">
          <h3>Right: {rightScore} | Wrong: {wrongScore}</h3>
          <button className="nav-button" onClick={() => { setCurrentSet((prev) => (prev + 1) % totalSets); resetQuiz(); }}>Next Set</button>
        </div>
      ) : (
        <div className="question-box">
          <div className="question-text">
            Q{currentQuestionIndex + 1}: {currentQuestion.question}
          </div>
          <div className="options">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                className={`option-button ${selectedOption === key ? (key === currentQuestion.answer ? 'correct' : 'wrong') : ''} ${answered && key === currentQuestion.answer ? 'correct' : ''}`}
                onClick={() => handleOptionClick(key)}
                disabled={answered}
              >
                {key}. {value}
              </button>
            ))}
          </div>
          {answered && <button className="nav-button" onClick={goToNextQuestion}>Next Question →</button>}
          <p>Score: Right {rightScore} | Wrong {wrongScore}</p>
        </div>
      )}
    </div>
  );
}

export default App;

