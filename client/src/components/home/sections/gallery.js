import Carousel from "../components/carousel";
import "./gallery.css";
const Gallery = () => {
  return (
    <div className=" gallery">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 py-3">
            <Carousel />
          </div>
          <div className="container d-flex col-lg-4 align-items-center  gallery-caption py-3 text-center ">
            <div>
            <span> Explore </span>
              Snehita  Well Being Events: a hub at IIT Ropar for
              insightful discussions and empowering workshops.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Gallery;
