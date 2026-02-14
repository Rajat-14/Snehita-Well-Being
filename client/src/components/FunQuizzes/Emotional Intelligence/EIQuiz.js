import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import emotionalIntelligenceQuizQuestions from './questions'; // Assuming you have a file with emotional intelligence quiz questions
import calculateEmotionalIntelligenceTrait from './Traits'; // Assuming you have a function to calculate emotional intelligence trait

const EmotionalIntelligenceQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateEmotionalIntelligenceTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Emotional Intelligence Quiz"
      questions={emotionalIntelligenceQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default EmotionalIntelligenceQuiz;
