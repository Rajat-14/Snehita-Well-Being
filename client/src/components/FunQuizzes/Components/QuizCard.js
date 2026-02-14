import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ imageUrl, heading, link }) => {
  return (
    <div className="col mb-4 mr-1">
      <div className="card shadow bg-white rounded mx-3" style={{ height: "100%" }}>
        <Link to={link} className="text-decoration-none">
          <div style={{ height: "200px", overflow: "hidden" }}> {/* Set a fixed height for the image container */}
            <img
              src={imageUrl}
              className="card-img-top"
              alt="quiz"
              style={{ objectFit: "cover", height: "100%", width: "100%" }}
              loading='lazy'
            />
          </div>
          <div className="card-body d-flex flex-column justify-content-between"> {/* Make the card body a flex container */}
            <h5 className="card-title">{heading}</h5>
            <p className="card-text">Take the Quiz</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
