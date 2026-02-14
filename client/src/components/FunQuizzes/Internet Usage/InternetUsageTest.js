import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import internetUsageCounsellingQuizQuestions from './questions'; // Assuming you have a file with internet usage self-counselling quiz questions
import calculateInternetUsageTrait from './Traits'; // Assuming you have a function to calculate internet usage trait

const InternetUsageQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateInternetUsageTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Internet Usage Quiz"
      questions={internetUsageCounsellingQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default InternetUsageQuiz;
