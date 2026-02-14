import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import sleepAwarenessQuizQuestions from './questions'; // Assuming you have a file with sleep awareness quiz questions
import calculateSleepTrait from './Traits'; // Assuming you have a function to calculate sleep trait

const SleepQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateSleepTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Sleep Awareness Quiz"
      questions={sleepAwarenessQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default SleepQuiz;
