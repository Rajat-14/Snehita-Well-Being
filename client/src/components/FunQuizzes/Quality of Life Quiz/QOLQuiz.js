import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import qualityOfLifeQuizQuestions from './questions'; // Assuming you have a file with quality of life quiz questions
import calculateQualityOfLifeTrait from './Trait'; // Assuming you have a function to calculate quality of life trait

const QualityOfLifeQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateQualityOfLifeTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Quality of Life Quiz"
      questions={qualityOfLifeQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default QualityOfLifeQuiz;
