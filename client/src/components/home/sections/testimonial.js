import "./testimonial.css";
import { useState, useEffect } from "react";
// import testimonies from "../components/testimonies"; // DATA MOVED TO DB
import anonymous from "../components/anonymous.jpg";

const Testimonial = () => {
  const [testimoniesData, setTestimoniesData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/testimonials')
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

                    {/* {item.pic ? (
                    <img
                      src={item.pic}
                      className="img-circle img-responsive"
                    />
                  ) : (
                    <Anonymous />
                  )} */}
                    <img
                      src={item.pic ? require(`../../assets/Testimonies/${item.pic}`) : anonymous}
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
