import React from 'react';
import QuizTemplate from '../Components/QuizTemplate';
import habitQuizQuestions from './questions';
import calculateHabitProgress from './traits';
import ParticlesBackground from "../Components/ParticlesBackground";
import ComplexAnimationComponent from '../Components/Animation';

const HabitQuiz = ({ onClose }) => {
  const finalTrait = (score, totalQuestions) => {
    return calculateHabitProgress(score, totalQuestions);
  };

  return (
    <><QuizTemplate
      title="Habit Quiz"
      questions={habitQuizQuestions}
      finalTrait={finalTrait}
      onClose={onClose} /></>
  );
};

export default HabitQuiz;
