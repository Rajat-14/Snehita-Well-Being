import "./blogCard.css";
import blogImage from "../../assets/Gallery/first.jpg";
const BlogCard = (props) => {
  // console.log(props.Link);
  const handleNavLinkClick = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="blog-card-container position-relative mx-3 mb-2" style={{ height: "100%", minHeight: "350px", display: "flex", flexDirection: "column" }} data-aos="fade-up">
      <a target="_blank" rel="noreferrer" href={props.Link ? props.Link : "#"} className="text-decoration-none text-black d-flex flex-column h-100">
        <div className="overflow-hidden" style={{ height: "200px" }}>
           <img
             src={props.Pic ? props.Pic : blogImage}
             className="w-100 h-100"
             style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
             onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
             alt="blog"
             loading="lazy"
           />
        </div>
        <div className="card-body p-4 d-flex flex-column flex-grow-1">
          {props.Type && (
            <span className="badge bg-primary bg-opacity-10 text-primary mb-3 align-self-start py-1 px-2 rounded-2 fw-semibold" style={{ fontSize: '0.8rem' }}>
                {props.Type}
            </span>
          )}
          <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
            {props.Title ? props.Title : "Mental Peace"}
          </h5>
          <p className="card-text text-muted mb-0" style={{ fontSize: '0.95rem' }}>
            {props.cardDescription ? props.cardDescription : "A short, engaging description for this blog post to get readers interested in learning more."}
          </p>
        </div>
      </a>
      {props.onDelete && (
        <button
          className="delete-btn-ghost position-absolute top-0 end-0 m-3 z-3"
          title="Delete Blog"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props.onDelete();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
export default BlogCard;
