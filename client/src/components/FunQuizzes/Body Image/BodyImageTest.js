import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import bodyImageQuizQuestions from './questions'; // Assuming you have a file with body image quiz questions
import calculateBodyImageTrait from './Traits'; // Assuming you have a file with functions to calculate body image traits

const BodyImageQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateBodyImageTrait(score, totalQuestions); // Using the function to calculate body image traits
  };

  return (
    <>
      <QuizTemplate
        title="Body Image Quiz"
        questions={bodyImageQuizQuestions} // Passing body image quiz questions to the QuizTemplate component
        finalTrait={finalTrait}
        onClose={onClose} />
    </>
  );
};

export default BodyImageQuiz;
