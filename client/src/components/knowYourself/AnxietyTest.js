import React, { useState } from 'react';

const AnxietyTest = ({ onSubmit, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
    { text: 'How often do you feel a sense of restlessness or nervousness?', options: [1, 2, 3, 4] },
    { text: 'Do you find it challenging to control your worries or intrusive thoughts?', options: [1, 2, 3, 4] },
    { text: 'How often do you experience physical symptoms of anxiety?', options: [1, 2, 3, 4] },
    { text: 'In unfamiliar or social situations, how anxious do you typically feel?', options: [1, 2, 3, 4] },
    { text: 'How often do you avoid situations or activities due to anxiety?', options: [1, 2, 3, 4] },
  ];

  const handleChange = (value) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setAnswers([...answers, selectedOption]);
      setSelectedOption(null); // Clear selected option after proceeding to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateScore();
      }
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const calculateScore = () => {
    const totalScore = answers.reduce((acc, value) => acc + value, 0);
    const averageScore = totalScore / answers.length;
    onSubmit(averageScore);
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Anxiety Test</h5>
          <h6 className="card-subtitle mb-2 text-muted">{questions[currentQuestionIndex].text}</h6>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={index} className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="anxietyQuestion"
                id={`option-${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={() => handleChange(option)}
              />
              <label className="form-check-label" htmlFor={`option-${index}`}>
                {option}
              </label>
            </div>
          ))}
          { currentQuestionIndex < questions.length - 1 ? 
            <button className="btn btn-primary mt-3" onClick={handleNext}>Next</button> : 
            <button className="btn btn-primary mt-3" onClick={calculateScore}>Submit Anxiety Test</button> }
          { currentQuestionIndex === questions.length - 1 && (
            <button className="btn btn-secondary ml-2" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnxietyTest;
