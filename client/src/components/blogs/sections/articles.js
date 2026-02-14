import BlogCard from "../components/blogCard";
// import BlogList from "../components/blogLists"; // Removed hardcoded data
import { useState, useEffect } from "react";
const Articles = () => {
  let [articleTypes, setArticleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArticleType, setCurrentArticleType] = useState("Anxiety");
  const [filteredArticles, setFilteredArticles] = useState([]);

  async function getUniqueTypes(blogList) {
    const uniqueTypes = new Set();

    blogList.forEach(blog => {
      uniqueTypes.add(blog.Type);
    });
    const types = Array.from(uniqueTypes)
    console.log(types);
    articleTypes = types;
    console.log(articleTypes);
    return types;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:8000/api/blogs');
        const data = await response.json();
        const blogs = data.map(blog => ({
          Title: blog.title,
          Link: blog.link,
          Type: blog.type,
          Pic: require(`../../assets/BlogsPics/${blog.pic}`) // Dynamically require image
        }));

        await getUniqueTypes(blogs);
        setArticleTypes(articleTypes);
        setCurrentArticleType("Anxiety"); // Default to first type or specific one
        const filtered = blogs.filter(article => article.Type === "Anxiety");
        setFilteredArticles(filtered);
        setIsLoading(false);
        // Store all blogs to filter later
        window.allBlogs = blogs;
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const CurrentArticleTypeHandler = (item) => {
    setCurrentArticleType(item);
    // Use stored blogs if available, otherwise would need state for allBlogs
    const allBlogs = window.allBlogs || [];
    const filtered = allBlogs.filter(article => article.Type === item);
    setFilteredArticles(filtered);
  }

  return (
    <div data-aos="zoom-in-up">
      {(!isLoading) && (<div className="d-flex justify-content-center my-1 flex-wrap ">
        {articleTypes.map((item, index) => {
          return (
            <div key={index} className={`btn btn-outline-dark mx-2 rounded-pill my-2 ${currentArticleType === item ? "active" : ""}`} onClick={() => CurrentArticleTypeHandler(item)}>
              {item}
            </div>
          )
        })}
      </div>)}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredArticles.map((item, index) => {
          return (
            <div className="col mb-4 mr-1 " key={index}>
              <BlogCard Link={item.Link} Title={item.Title} Pic={item.Pic} />
            </div>
          );
        })}
      </div>
    </div>
  )
};
export default Articles;
