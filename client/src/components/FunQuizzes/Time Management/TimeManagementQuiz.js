import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import timeManagementQuizQuestions from './questions';
import calculateTimeManagementTrait from './Traits';

const TimeManagementQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateTimeManagementTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Time Management Quiz"
      questions={timeManagementQuizQuestions}
      finalTrait={finalTrait}
      onClose={onClose}
    />
  );
};

export default TimeManagementQuiz;
