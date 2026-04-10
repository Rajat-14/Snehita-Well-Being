import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import QuizComponents from './QuizComponents';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import ParticlesBackground from "./Components/ParticlesBackground";
import Animation from '../templates/animation';
import ManageQuizzes from './ManageQuizzes';
import './Components/Quiz.css' 

const FunQuizzes = () => {
  const [showManage, setShowManage] = useState(false);
  const [isCounselor, setIsCounselor] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user.role === 'counselor' || user.role === 'admin')) {
      setIsCounselor(true);
    }
  }, []);

  return (
    <><div className="body-content">
      <ParticlesBackground />
      <Container className="pt-3">
        <nav aria-label="breadcrumb" className="breadcrumbs-panel wow fadeInDown">
          <ol className="breadcrumb border-0 align-items-center">
            {/* <li className="breadcrumb-item"><a href="/default"><i className="fa fa-home"></i></a></li> */}
            {/* <li className="breadcrumb-item active  wow fadeInUp">Fun Quiz</li> */}
            <li className="mx-auto section-head mr-md-0 ml-md-auto mt-md-0 mt-2 d-flex align-items-center w-100 justify-content-between">
              <h1 className="mb-0 h3 font-weight-bold text-dark">Self Analysis Quizzes</h1>
              {isCounselor && (
                <Button 
                  variant={showManage ? "danger" : "primary"} 
                  onClick={() => setShowManage(!showManage)}
                >
                  {showManage ? "Exit Management" : "Manage Quizzes"}
                </Button>
              )}
            </li>
          </ol>
        </nav>

        {showManage ? (
          <div className="bg-white p-4 rounded shadow-lg mt-4 mb-5">
            <ManageQuizzes />
          </div>
        ) : (
          <>
            <Row className="mt-2 mt-lg-2pb-4 align-items-center">
              <Col lg={5} className="mb-3 order-lg-2">
                <img src="https://artwithmsknight.wordpress.com/wp-content/uploads/2013/09/self-assessment.jpg" className="img-fluid wow fadeInUp" alt="Fun Quiz" />
              </Col>
              <Col lg={7} className="order-lg-1 wow fadeInUp">
                <p className="m-0 font-weight-bold">Often you may find yourself wondering,</p>
                <p className="mb-1 font-italic">“Is there a way to check out my everyday beliefs and habits and a tool for self-analysis and counselling so I  can know a little more about what I am  going through and what I need to do for my overall well-being" </p>
                <p className="mb-1">Well, these self-analysis quizzes might just be what you need!</p>
                <p>
                  We chose these topics to reflect the most pressing issues you that you might be facing in your lives.
                </p>
                <p>There is an <b>average of 8-10 questions per quiz</b> (a few are longer). While there is <b>no time limit</b>, do not spend too long mulling over each question, but <b>go by your instincts</b>  But a minute of introspection at the end of the test is fine. Therefore the entire test would
                take around 5 minutes on an average.We are not storing your practice test data. <b>We Respect your privacy. Give the quizzes freely.</b></p>
                <p className="" style={{fontSize:"12px"}}><b>Dislaimer: </b>These quizzes are generated using AI tools and are intended solely for educational purposes. They are not designed for clinical or commercial use. </p>
              </Col>
            </Row>
            <hr className="mb-5" />
            <QuizComponents />
          </>
        )}
      </Container>
    </div></>
  );
};

export default FunQuizzes;
