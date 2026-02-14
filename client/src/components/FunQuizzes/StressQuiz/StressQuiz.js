import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import stressQuizQuestions from './questions';
import calculateStressLevel from './traits';

const StressQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateStressLevel(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Stress Quiz"
      questions={stressQuizQuestions}
      finalTrait={finalTrait}
      onClose={onClose}
    />
  );
};

export default StressQuiz;
