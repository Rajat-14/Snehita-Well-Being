import React, { useState, useEffect } from 'react';
import QuizCard from './Components/QuizCard'; // Path to your QuizCard component
import { Container, Row } from 'react-bootstrap';
import Animation from '../templates/animation';

const QuizComponents = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  return (
    <><Animation /><Container>
      <Row>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
          {quizzes.map((quiz, index) => (
            <QuizCard
              key={index}
              imageUrl={require(`./assets/${quiz.imageUrl}`)}
              heading={quiz.heading}
              link={quiz.link} />
          ))}
        </div>
      </Row>
    </Container></>
  );
};

export default QuizComponents;
