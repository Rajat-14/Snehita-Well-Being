import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import lifestyleSelfCounselingQuizQuestions from './questions'; // Assuming you have a file with lifestyle self-counseling quiz questions
import calculateLifestyleTrait from './Traits'; // Assuming you have a function to calculate lifestyle trait

const LifestyleQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateLifestyleTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Lifestyle Quiz"
      questions={lifestyleSelfCounselingQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default LifestyleQuiz;
