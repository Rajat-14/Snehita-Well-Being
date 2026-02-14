import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import motivationQuizQuestions from './questions';
import calculateFinalMotivation from './Trait';

const MotivationQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateFinalMotivation(score, totalQuestions);
  };

  return (
    <QuizTemplate
  title="Motivation Quiz"
  questions={motivationQuizQuestions}
  onClose={onClose}
  finalTrait={finalTrait}
/>

  );
};

export default MotivationQuiz;
