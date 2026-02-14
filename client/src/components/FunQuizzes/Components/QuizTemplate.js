import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './Quiz.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import picTwo from '../assets/suggestion.jpeg'
import Animation from '../../templates/animation';

const QuizTemplate = ({ title , questions, onClose, finalTrait }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [trait, setTrait] = useState('');
  const [selectedOptionsPerQuestion, setSelectedOptionsPerQuestion] = useState(Array(questions.length).fill([]));
  
  const handleOptionSelect = (option) => {
    /*const newSelectedOptions = [...selectedOptions];
    const index = newSelectedOptions.findIndex((opt) => opt.text === option.text);
    if (index === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(index, 1);
    }*/
    let newSelectedOptions;
  
  // Check if the selected option is already in the selectedOptions array
  const isSelected = selectedOptions.some((opt) => opt.text === option.text);
  
  // If the selected option is not already selected
  if (!isSelected) {
    newSelectedOptions = [option]; // Select the new option
  } else {
    newSelectedOptions = []; // Deselect the option
  }

    setSelectedOptions(newSelectedOptions);
    setSelectedOptionsPerQuestion((prev) => {
      const updatedSelectedOptions = [...prev];
      updatedSelectedOptions[currentQuestion] = newSelectedOptions;
      return updatedSelectedOptions;
    });
    setShowSuggestion(true);
    
  };

  const handleNextQuestion = () => {
    const correctOptions = questions[currentQuestion].options.filter(option => option.isCorrect).map(option => option.text);
    const selectedTexts = selectedOptions.map(option => option.text);
    if (JSON.stringify(correctOptions.sort()) === JSON.stringify(selectedTexts.sort())) {
      setScore(score + 1);
    }

    setSelectedOptions([]);
    setShowSuggestion(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      calculateTrait();
    }
    
  };

  const calculateTrait = () => {
    let traitText = finalTrait(score, questions.length);
    setTrait(traitText);
  };

  const handleClose = () => {
    setShowResult(false);
    onClose();
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowSuggestion(true);
      setSelectedOptions(selectedOptionsPerQuestion[currentQuestion - 1]);
    }
  };

  console.log('Questions array:', questions);

  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <><div className="quiz-page my-3 ">

      <div className="">
        <Row className="justify-content-center">
          <Col md={15}>
            
            {showResult ? (
              <>
                <Card className="result-card">
                  <Card.Body>
                  <div className="text-center mb-3">
                    <img src={picTwo} className="img-fluid " style={{ maxWidth: '250px',alignItems:'center' }} alt="Suggestion Image" />
                    </div>
                    <Card.Title className="text-center" style={{ fontFamily: 'Arial, sans-serif', fontSize: 'calc(12px + 2vw)', fontWeight: 'bold', color: '#333' , margin:'15px'}}>Result</Card.Title>
                    <Card.Text className="text-left" style={{ fontFamily: 'Arial, sans-serif', fontSize: 'calc(10px + 0.5vw)', color: '#666', letterSpacing: '1px', lineHeight: '1.5' }}>{trait}</Card.Text>
                    <NavLink to="/FunQuizzes" className="nav-link" onClick={handleNavLinkClick} >
                    <button  className="translucent-button" style={{backgroundColor:'rgba(221, 240, 241, 0.87)'}}>Back to Quiz Page</button>
                    </NavLink>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>

                <div className="custom-question-card">
                 <progress value={currentQuestion} max={questions.length} className='w-100'>{currentQuestion+1} out of {questions.length}</progress>
 
                  <h2  style={{ margin: '20px 0', fontSize: '35px', fontWeight: 700, textAlign: 'center' }}>{title}</h2>
                  <hr style={{ margin: '20px 10px', border: '1px solid #000' }}></hr>
                  <p style={{ margin: '20px 0', fontSize: '25px', fontWeight: 600, textAlign: 'center' }}> {currentQuestion + 1}.&nbsp;&nbsp;&nbsp;{questions[currentQuestion].question}</p>
                  <div className="options" style={{ flexDirection: 'column', alignItems: 'left', fontFamily: 'Arial, sans-serif', fontSize: '18px' }}>
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={selectedOptions.includes(option) ? 'selected' : ''}
                        style={{
                          backgroundColor: selectedOptions.includes(option) ? 'white' : 'white',
                          border: '1px solid black',
                          color: 'black',
                          padding: '5px 10px',
                          margin: '10px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'normal'
                        }}
                      >
                        {option.text}
                      </Button>
                    ))}
                  </div>   
                  
                  <div className="d-flex justify-content-between">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid black',
                        color: 'black',
                        padding: '5px 10px',
                        margin: '20px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      Previous
                    </Button>
                    
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedOptions.length === 0 }
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid black',
                        color: 'black',
                        padding: '5px 10px',
                        margin: '20px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      Next
                    </Button>
                  </div>
                  {showSuggestion && (
                    <Card className="suggestion-card" style={{backgroundColor:'rgba(221, 240, 241, 0.87)'}}>
                    <Card.Body>
                      <Card.Text style={{ fontSize: '18px', fontWeight: 'normal', fontStyle: 'italic', color: 'navy' }}>
                        {questions[currentQuestion].suggestion}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  
                  )}
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
      <Animation bottom="-50vh"/>
    </div></>
  );
};

export default QuizTemplate;
