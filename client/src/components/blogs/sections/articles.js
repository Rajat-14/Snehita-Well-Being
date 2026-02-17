import BlogCard from "../components/blogCard";
import { useState, useEffect } from "react";

const Articles = () => {
  const [articleTypes, setArticleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArticleType, setCurrentArticleType] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    type: "",   // IMPORTANT: starts empty
    link: "",
    pic: null
  });

  const handleFileChange = (e) => {
    setNewBlog({ ...newBlog, pic: e.target.files[0] });
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();

    if (!newBlog.type) {
      alert("Please select a blog type");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("content", newBlog.content);
    formData.append("type", newBlog.type);
    formData.append("link", newBlog.link);
    if (newBlog.pic) formData.append("pic", newBlog.pic);

    try {
      const response = await fetch("http://localhost:8000/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const getUniqueTypes = (blogList) => {
    const uniqueTypes = new Set();
    blogList.forEach(blog => uniqueTypes.add(blog.Type));
    return Array.from(uniqueTypes);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/api/blogs");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const blogs = Array.isArray(data)
          ? data.map(blog => {
            let pic;

            try {
              if (
                blog.pic &&
                !blog.pic.startsWith("http") &&
                !blog.pic.startsWith("/")
              ) {
                pic = require(`../../assets/BlogsPics/${blog.pic}`);
              } else {
                throw new Error("Not local asset");
              }
            } catch {
              pic = `http://localhost:8000/uploads/blogs/${blog.pic}`;
            }

            return {
              id: blog.id,
              Title: blog.title,
              Link: blog.link,
              Type: blog.type,
              Pic: pic
            };
          })
          : [];

        const types = getUniqueTypes(blogs);
        setArticleTypes(types);

        if (types.length > 0) {
          const firstType = types[0];
          setCurrentArticleType(firstType);

          const filtered = blogs.filter(
            article => article.Type === firstType
          );
          setFilteredArticles(filtered);
        }

        window.allBlogs = blogs;
        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching blogs:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const CurrentArticleTypeHandler = (item) => {
    setCurrentArticleType(item);

    const allBlogs = window.allBlogs || [];
    const filtered = allBlogs.filter(article => article.Type === item);
    setFilteredArticles(filtered);
  };

  return (
    <div data-aos="zoom-in-up">

      {!isLoading && (
        <div className="d-flex justify-content-center my-1 flex-wrap">
          {articleTypes.map((item, index) => (
            <div
              key={index}
              className={`btn btn-outline-dark mx-2 rounded-pill my-2 ${currentArticleType === item ? "active" : ""
                }`}
              onClick={() => CurrentArticleTypeHandler(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {localStorage.getItem("role") === "counselor" && (
        <div className="container mb-4">
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Close Form" : "Add New Blog"}
          </button>

          {showAddForm && (
            <form onSubmit={handleAddBlog} className="card p-3 mb-3">

              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  required
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <textarea
                  className="form-control"
                  placeholder="Short Description/Content"
                  required
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <select
                  className="form-control"
                  value={newBlog.type}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, type: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Type
                  </option>

                  {articleTypes.map((t, index) => (
                    <option key={index} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Link (URL)"
                  value={newBlog.link}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, link: e.target.value })
                  }
                />
              </div>

              <div className="mb-2">
                <label>Image:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className="btn btn-success">
                Submit Blog
              </button>
            </form>
          )}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredArticles.map((item, index) => {
          const role = localStorage.getItem("role");

          const handleDelete = async () => {
            if (window.confirm("Are you sure you want to delete this blog?")) {
              try {
                await fetch(
                  `http://localhost:8000/api/blogs/${item.id}`,
                  { method: "DELETE" }
                );

                const newFiltered = filteredArticles.filter(
                  b => b.id !== item.id
                );
                setFilteredArticles(newFiltered);

                window.allBlogs = window.allBlogs.filter(
                  b => b.id !== item.id
                );

              } catch (e) {
                console.error(e);
              }
            }
          };

          return (
            <div className="col mb-4 mr-1" key={index}>
              <BlogCard
                Link={item.Link}
                Title={item.Title}
                Pic={item.Pic}
                onDelete={role === "counselor" ? handleDelete : null}
              />
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Articles;
