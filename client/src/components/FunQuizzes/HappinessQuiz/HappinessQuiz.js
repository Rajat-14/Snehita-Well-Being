import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import happinessQuizQuestions from './questions'; // Assuming you have a file with happiness quiz questions
import calculateHappinessTrait from './Traits'; // Assuming you have a function to calculate happiness trait

const HappinessQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateHappinessTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Happiness Quiz"
      questions={happinessQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default HappinessQuiz;
