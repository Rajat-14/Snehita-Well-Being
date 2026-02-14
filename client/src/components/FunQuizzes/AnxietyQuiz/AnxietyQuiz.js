import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import anxietyQuizQuestions from './questions';
import calculateAnxietyTrait from './trait';

const AnxietyQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateAnxietyTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Anxiety Quiz"
      questions={anxietyQuizQuestions}
      finalTrait={finalTrait}
      onClose={onClose}
    />
  );
};

export default AnxietyQuiz;
