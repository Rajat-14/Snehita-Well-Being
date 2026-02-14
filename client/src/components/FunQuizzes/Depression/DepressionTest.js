import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import selfCounsellingDepressionQuestions from './questions'; // Assuming you have a file with depression test questions
import calculateDepressionTrait from './Traits'; // Assuming you have a function to calculate depression trait

const DepressionTest = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateDepressionTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Depression Self Analysis"
      questions={selfCounsellingDepressionQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default DepressionTest;
