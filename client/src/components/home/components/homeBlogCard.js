import "./homeBlogCard.css";
import blogImage from "../../assets/Gallery/first.jpg";
const HomeBlogCard = (props) => {
  // console.log(props.Link);
  return (
    <div className="card shadow bg-white rounded mx-3"style={{height:"fit-content", minHeight:"350px"}}>
      <img
        src={props.Pic ? props.Pic : blogImage}
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
          {props.Title ? props.Title : "Mental Peace"}
        </h5>
        <p className="card-text">
          {props.cardDescription
            ? props.cardDescription
            : ""}
        </p>
      </div>
    </div>
  );
};
export default HomeBlogCard;
