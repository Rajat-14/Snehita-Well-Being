import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import WellBeingTest from './WellBeingTest';
import AnxietyTest from './AnxietyTest';
//import backgroundImage from "./th.jpg"; // Import the image

const KnowYourself=()=>{
    const [wellBeingScore, setWellBeingScore] = useState(null);
    const [anxietyScore, setAnxietyScore] = useState(null);
  
    const handleWellBeingTestSubmit = (score) => {
      setWellBeingScore(score);
    };
  
    const handleAnxietyTestSubmit = (score) => {
      setAnxietyScore(score);
    };
    return ( 
      <section className="py-5">
      {/* Blurred background div */}
      <div
        className="blurry-background"
        alt="Counsellor 1"
        style={{
         // backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
          position: "fixed",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          objectFit:'contain',
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          
        }}
      ></div>

        <div className="container mt-5" style={{height:2800}}>
            <center><u style={{ color: 'black', fontWeight: 'bold' }}><h1 className="mb-4" style={{ color: 'black', fontWeight: 'bold' }}>Know Yourself</h1></u></center>
            {/* Snehita Tips for Promoting Well-being Section */}
      <section className="mb-4 ">
        <h3 style={{ color: 'black', fontWeight: 'bold' }}>Snehita Tips for Promoting Your Well-being</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <strong>Your Emotions are Valid</strong>
          </li>
          <li className="list-group-item">
            <strong>Your Relational Well-being Influences Your Overall Well-being</strong>
          </li>
          <li className="list-group-item">
            <strong>Asking for Help is a Sign of Strength and Resilience</strong>
          </li>
          
          <li className="list-group-item">
            <strong>Mental Health Problems Can Affect Anyone</strong>
          </li>
          <li className="list-group-item">
            <strong>Express your emotions in a healthy and effective way starting today</strong>
          </li>
          <li className="list-group-item">
            <strong>Stay curious and engage in activities that bring you joy and fulfillment</strong>
          </li>
          <li className="list-group-item">
            <strong>Make Time for Rest, Relaxation, Hobbies, and Fun, Starting Today</strong>
          </li>
          <li className="list-group-item">
            <strong>Practice mindfulness to stay present in the moment.</strong>
          </li>
          <li className="list-group-item">
            <strong>Take breaks and prioritize self-care in your daily routine</strong>
          </li>
        </ul>
      </section>

            <section className = "mb-4 card">
        <h3>Self Counselling Material</h3>
        <p>
          "The only journey is the journey within."
          <br /> - Rainer Maria Rilke
        </p>
        <p>
          Take a moment for self-reflection. Here are some resources to help you on your journey:
        </p>
        <ul>
          <li>
            <a href="https://www.verywellmind.com/self-reflection-importance-benefits-and-strategies-7500858" target="_blank" rel="noopener noreferrer">
            The Importance of Self-Reflection: How Looking Inward Can Improve Your Mental Health
            </a>
          </li>
          <li>
            <a href="https://www.mentalhealth.gov/get-help/immediate-help" target="_blank" rel="noopener noreferrer">
              Immediate Help in a Crisis
            </a>
          </li>
          <li>
            <a href="https://positivepsychology.com/building-self-awareness-activities/" target="_blank" rel="noopener noreferrer">
              How to Increase Self Awareness
            </a>
          </li>
        </ul>
      </section>
      
      <section className="mb-5 card">
        <h3>When and Why Seek Counselling</h3>
        <p>
          If you find yourself facing challenges such as stress, anxiety, or emotional difficulties,
          seeking counseling can provide valuable support and guidance on your journey to well-being.
        </p>
        <p>
          It's okay to ask for help. Our professional counselors are here to assist you.{' '}
          <Link to="/appointment">Visit our appointment page</Link> to schedule a session and take
          the first step towards a healthier and happier you.
        </p>
        <p>
          For any inquiries or more information, feel free to{' '}
          <Link to="/contactUs">contact us</Link>.
        </p>
      </section>
      {/* Well-Being Test Section */}
      <WellBeingTest onSubmit={handleWellBeingTestSubmit} />

      {/* Display Well-Being Test Results */}
      {wellBeingScore !== null && (
        <div>
          <h3>Well-Being Test Results</h3>
          <p>Your Well-Being Score: {wellBeingScore.toFixed(2)}</p>
        </div>
      )}

      {/* Anxiety Test Section */}
      <AnxietyTest onSubmit={handleAnxietyTestSubmit} />

      {/* Display Anxiety Test Results */}
      {anxietyScore !== null && (
        <div>
          <h3>Anxiety Test Results</h3>
          <p>Your Anxiety Score: {anxietyScore.toFixed(2)}</p>
        </div>
      )}


        </div>
        </section>
    );
}
export default KnowYourself;