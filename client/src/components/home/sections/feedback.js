
import { useState } from "react";
import './feedback.css';
const Feedback = () => {
  const [feedback, setFeedback] = useState();
  const feedbackInputHandler = (e) => {
    setFeedback(e.target.value);
  };
  return (
    <div className="feedback text-white ">
      <div className="d-flex justify-content-center fs-1 py-2">Feedback</div>
      <div className="d-flex justify-content-center my-4 ">
        <label htmlFor="feedback"></label>
        <textarea
          type="text"
          id="feedback"
          placeholder="Please give your feedback regarding our website"
          onChange={feedbackInputHandler}
          className="w-75 feedbackInput  "
        />
      </div>
      <div className="d-flex justify-content-center py-4">
        <span className="btn btn-light p-2 px-4">Submit</span>
      </div>
    </div>
  );
};
export default Feedback;
