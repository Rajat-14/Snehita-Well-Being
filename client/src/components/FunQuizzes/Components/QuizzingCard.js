import "../../blogs/components/blogCard.css" ;
import blogImage from "../../assets/Gallery/first.jpg";
import { Link } from 'react-router-dom';

const QuizCard = (props) => {
  // console.log(props.Link);
  return (
    <div className="card shadow bg-white rounded mx-3"style={{height:"fit-content", minHeight:"350px"}}>
      <Link to={props.link?props.Link:""}  className="text-decoration-none text-black" >
      <img
        src={props.imageUrl ? props.imageUrl: blogImage}
        className="card-img-top "
        alt=""
      />
      <div
        className="card-body"
        onClick={() => {
          console.log("clicked");
        }}
      >
        <h5 className="card-title">
          {props.heading ? props.heading : "Quiz"}
        </h5>
        <p className="card-text">
          Take the Quiz
        </p>
      </div>
      </Link>
    </div>
  );
};
export default QuizCard;
