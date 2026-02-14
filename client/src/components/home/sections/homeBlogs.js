// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import BlogCard from "../../blogs/components/blogCard";
import Button from "../../templates/button";
const HomeBlogs = () => {
  const [homeBlogList, setHomeBlogList] = useState([]);
  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function getRandomElementsFromArray(array) {
    if (array.length < 3) {
      return array;
    }
    const copyArray = array.slice();
    let randomElements = [];
    for (let i = 0; i < 3; i++) {
      if (copyArray.length === 0) break;
      const randomIndex = Math.floor(Math.random() * copyArray.length);
      randomElements.push(copyArray[randomIndex]);
      copyArray.splice(randomIndex, 1);
    }

    return randomElements;
  }

  useEffect(() => {
    fetch('http://localhost:8000/api/blogs')
      .then(res => res.json())
      .then(data => {
        const processedData = data.map(blog => ({
          Title: blog.title,
          Link: blog.link,
          Type: blog.type,
          Pic: require(`../../assets/BlogsPics/${blog.pic}`)
        }));
        const randomElements = getRandomElementsFromArray(processedData);
        setHomeBlogList(randomElements);
      })
      .catch(err => console.error("Error fetching blogs:", err));
  }, []);

  return (
    <div className="mb-5">
      <h1 className="d-flex justify-content-center py-3">BLOGS</h1>
      <div className="container">
        <div className="mx-3 row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 ">
          {homeBlogList.map((item, index) => {
            return (

              <div className="col" key={index} data-aos='fade-up'>
                <BlogCard Title={item.Title} Link={item.Link} Type={item.Type} Pic={item.Pic} />
              </div>
            )
          })}
        </div>
        <NavLink
          className="d-flex justify-content-center mx-auto py-3 text-decoration-none  "
          to="/blogs"
        >
          <Button color={"dark"} onClick={handleNavLinkClick}>
            More Blogs
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
export default HomeBlogs;
