import "./testimonial.css";
import { useState, useEffect } from "react";
import anonymous from "../components/anonymous.jpg";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const getTestimonialImageSrc = (pic) => {
  if (!pic) return anonymous;
  // New images uploaded via admin go to /uploads/testimonials/
  if (pic.startsWith("/uploads/")) return `${BASE_URL}${pic}`;
  // Legacy: filename stored as local asset (attempt require, fallback to anonymous)
  try {
    return require(`../../assets/Testimonies/${pic}`);
  } catch {
    return anonymous;
  }
};

const Testimonial = () => {
  const [testimoniesData, setTestimoniesData] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimoniesData(data))
      .catch(err => console.error("Error fetching testimonials:", err));
  }, []);

  if (testimoniesData.length === 0) {
    return <div>Loading Testimonials...</div>;
  }
  return (
    <div className="testimonial">
      <div className="heading white-heading">Testimonial</div>
      <div
        id="carouselExampleAutoplaying"
        className="carousel slide carousel-fade "
        data-bs-ride="true"
        data-bs-interval={3000}
      >
        <div className="carousel-inner">
          {testimoniesData.map((item, index) => {
            return (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <div className="testimonial4_slide">
                  <div>
                    <img
                      src={getTestimonialImageSrc(item.pic)}
                      className="img-circle img-responsive"
                      alt={item.name ? item.name : "Anonymous Testimonial"}
                    />
                  </div>
                  <p>{item.testimony}</p>
                  <h4 className="fw-bolder ">{item.name ? item.name : "Anonymous"}</h4>
                </div>
              </div>
            );
          })}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Testimonial;

