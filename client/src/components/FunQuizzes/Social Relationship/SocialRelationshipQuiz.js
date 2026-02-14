import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import socialRelationshipQuizQuestions from './questions'; // Assuming you have a file with social relationship quiz questions
import calculateSocialRelationshipTrait from './Traits'; // Assuming you have a function to calculate social relationship trait

const SocialRelationshipQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateSocialRelationshipTrait(score, totalQuestions);
  };

  return (
    <QuizTemplate
      title="Social Relationship Quiz"
      questions={socialRelationshipQuizQuestions}
      onClose={onClose}
      finalTrait={finalTrait}
    />
  );
};

export default SocialRelationshipQuiz;
