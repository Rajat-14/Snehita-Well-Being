import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import questions from './questions';
import calculateHappinessTrait from './trait';

const AngerQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateHappinessTrait(score, totalQuestions);
  };

  return (
    <div className="d-flex justify-content-center">
    <QuizTemplate
      title="Anger Quiz"
      questions={questions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
    </div>
  );
};

export default AngerQuiz;
