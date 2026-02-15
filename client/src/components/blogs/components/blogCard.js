import "./blogCard.css";
import blogImage from "../../assets/Gallery/first.jpg";
const BlogCard = (props) => {
  // console.log(props.Link);
  const handleNavLinkClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="card shadow bg-white rounded mx-3" style={{ height: "fit-content", minHeight: "350px" }} data-aos="fade-up">
      <a target="_blank" href={props.Link ? props.Link : ""} className="text-decoration-none text-black">
        <img
          src={props.Pic ? props.Pic : blogImage}
          className="card-img-top "
          alt="blog"
          loading="lazy"
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
        {props.onDelete && (
          <button
            className="btn btn-danger position-absolute top-0 end-0 m-2"
            onClick={(e) => {
              e.preventDefault();
              props.onDelete();
            }}
          >
            <i className="bi bi-trash"></i> Delete
          </button>
        )}
      </a>
    </div>
  );
};
export default BlogCard;
