import Articles from "./sections/articles";
import Quotes from "./sections/quotes";
import "./blogs.css";
import Animation from "../templates/animation";
const Blogs = () => {
  return (
    <div>
      <Animation bottom='-90vh'/>  
      {/* <hr className="mx-4"/> */}
      <div className="pb-3 quotes-custom" data-aos="fade-up">
        <h1 className="d-flex justify-content-center py-3 ">QUOTES</h1>
        <div className="container pt-2">
          <Quotes />
        </div>
      </div>
      <div className="articles pb-3 " data-aos="fade-up">
        <h1 className="d-flex justify-content-center py-3 border-bottom ">BLOGS</h1>
        <div className="container ">
          <Articles />
        </div>
      </div>
    </div>
  );
};
export default Blogs;
