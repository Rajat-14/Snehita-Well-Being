import React, { useState, useEffect } from 'react';
import QuizCard from './Components/QuizCard';
import { BASE_URL } from '../services/helper';
import { Container, Row } from 'react-bootstrap';
import Animation from '../templates/animation';

const QuizComponents = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/quizzes`)
      .then(res => {
        if (!res.ok) throw new Error(`Quiz API error: ${res.status}`);
        return res.json();
      })
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  const getQuizLink = (quiz) => {
    const hardcodedRoutes = [
      '/SleepQuiz', '/AngerQuiz', '/AnxietyQuiz', '/MotivationQuiz', '/HabitQuiz',
      '/QualityOfLifeQuiz', '/StressQuiz', '/EmotionalIntelligenceQuiz',
      '/SocialRelationshipQuiz', '/LifeStyleQuiz', '/InternetUsageQuiz',
      '/DepressionTest', '/BodyImageQuiz', '/TimeManagementQuiz', '/HappinessQuiz'
    ];
    if (hardcodedRoutes.includes(quiz.link)) {
      return quiz.link;
    }
    return `/quiz${quiz.link}`;
  };

  return (
    <><Animation /><Container>
      <Row>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={index}
              imageUrl={`${BASE_URL}/api/quiz-assets/${quiz.imageUrl}`}
              heading={quiz.heading}
              link={getQuizLink(quiz)} />
          ))}
        </div>
      </Row>
    </Container></>
  );
};

export default QuizComponents;
