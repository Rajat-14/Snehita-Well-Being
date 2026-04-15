import BlogCard from "../components/blogCard";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../services/helper";

const Articles = () => {
  const [articleTypes, setArticleTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArticleType, setCurrentArticleType] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: "",
    type: "",   // IMPORTANT: starts empty
    link: "",
    pic: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new window.Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;

      // Ensure horizontal orientation and an aspect ratio around 1.6
      if (width <= height) {
        alert("Please upload a horizontal (landscape) image. Vertical or square images will distort the blog layout.");
        e.target.value = "";
        setNewBlog({ ...newBlog, pic: null });
      } else if (ratio < 1.3 || ratio > 1.9) {
        alert(`The selected image has an extreme aspect ratio (${ratio.toFixed(2)}). For best results, please use an image with an aspect ratio of 1.6 (like a 400x250 or 800x500 rectangle).`);
        e.target.value = "";
        setNewBlog({ ...newBlog, pic: null });
      } else {
        setNewBlog({ ...newBlog, pic: file });
      }
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      alert("Invalid image file selected.");
      e.target.value = "";
      setNewBlog({ ...newBlog, pic: null });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();

    if (!newBlog.type) {
      alert("Please select a blog type");
      return;
    }

    const formData = new FormData();
    formData.append("title", newBlog.title);
    formData.append("type", newBlog.type);
    formData.append("link", newBlog.link);
    if (newBlog.pic) formData.append("pic", newBlog.pic);

    try {
      const response = await fetch(`${BASE_URL}/api/blogs`, {
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
        const response = await fetch(`${BASE_URL}/api/blogs`);
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
              pic = `${BASE_URL}/uploads/blogs/${blog.pic}`;
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
        <div className="container mb-5 mt-4">
          {!showAddForm && (
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-primary shadow-sm rounded-pill px-4 py-2 fw-semibold"
                style={{ transition: 'all 0.3s ease' }}
                onClick={() => setShowAddForm(true)}
              >
                <i className="bi bi-plus-lg me-2"></i> Add New Blog
              </button>
            </div>
          )}

          {showAddForm && (
            <div className="card shadow-lg rounded-4 overflow-hidden mb-4" style={{ backgroundColor: '#ffffff', border: 'none' }}>
              <div className="card-header bg-white pt-4 pb-0 px-4" style={{ borderBottom: 'none' }}>
                <h4 className="fw-bold text-dark mb-0">Create New Blog Post</h4>
                <p className="text-muted small">Share your thoughts and resources with the community.</p>
              </div>
              <form onSubmit={handleAddBlog} className="card-body p-4 pt-3">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary mb-1">Blog Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 border-light-subtle shadow-none bg-light"
                      style={{ transition: 'all 0.3s ease', fontSize: '1rem' }}
                      placeholder="Enter an engaging title"
                      required
                      value={newBlog.title}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, title: e.target.value })
                      }
                      onFocus={(e) => { e.target.classList.remove('bg-light'); e.target.classList.add('border-primary'); }}
                      onBlur={(e) => { e.target.classList.add('bg-light'); e.target.classList.remove('border-primary'); }}
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary mb-1">Category / Type</label>
                    <select
                      className="form-select form-select-lg rounded-3 border-light-subtle shadow-none bg-light"
                      style={{ transition: 'all 0.3s ease', fontSize: '1rem' }}
                      value={newBlog.type}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, type: e.target.value })
                      }
                      required
                      onFocus={(e) => { e.target.classList.remove('bg-light'); e.target.classList.add('border-primary'); }}
                      onBlur={(e) => { e.target.classList.add('bg-light'); e.target.classList.remove('border-primary'); }}
                    >
                      <option value="" disabled>Select category</option>
                      {articleTypes.map((t, index) => (
                        <option key={index} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary mb-1">External Link (URL)</label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3 border-light-subtle shadow-none bg-light"
                      style={{ transition: 'all 0.3s ease', fontSize: '1rem' }}
                      placeholder="https://example.com/your-article"
                      value={newBlog.link}
                      onChange={(e) =>
                        setNewBlog({ ...newBlog, link: e.target.value })
                      }
                      onFocus={(e) => { e.target.classList.remove('bg-light'); e.target.classList.add('border-primary'); }}
                      onBlur={(e) => { e.target.classList.add('bg-light'); e.target.classList.remove('border-primary'); }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary mb-1">Cover Image</label>
                    <div className="position-relative">
                      <input
                        type="file"
                        className="form-control position-absolute w-100 h-100 opacity-0"
                        style={{ cursor: 'pointer', zIndex: 2 }}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      <div className="d-flex flex-column align-items-center justify-content-center border-2 rounded-4 p-4 text-center bg-light" 
                           style={{ borderColor: '#dee2e6', borderStyle: 'dashed', transition: 'all 0.3s ease', minHeight: '160px' }}
                           onDragOver={(e) => {e.currentTarget.style.borderColor = '#0d6efd'; e.currentTarget.style.backgroundColor = '#f8f9fa';}}
                           onDragLeave={(e) => {e.currentTarget.style.borderColor = '#dee2e6'; e.currentTarget.style.backgroundColor = '#f8f9fa';}}>
                        {newBlog.pic ? (
                          <>
                            <i className="bi bi-image text-success mb-2" style={{ fontSize: '2rem' }}></i>
                            <h6 className="mb-0 text-success fw-semibold">Image Selected</h6>
                            <small className="text-muted mt-1">{newBlog.pic.name}</small>
                          </>
                        ) : (
                          <>
                            <div className="bg-white rounded-circle shadow-sm d-flex justify-content-center align-items-center mb-3" style={{ width: '56px', height: '56px' }}>
                              <i className="bi bi-cloud-arrow-up text-primary fs-4"></i>
                            </div>
                            <h6 className="fw-semibold text-dark mb-1">Click to upload or drag and drop</h6>
                            <p className="text-muted small mb-0">Landscape image recommended (approx. 16:9 ratio)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4 pt-3" style={{ borderTop: '1px solid #f1f3f5' }}>
                  <button 
                    type="button" 
                    className="btn rounded-pill px-4 fw-semibold text-secondary"
                    style={{ transition: 'all 0.2s', backgroundColor: '#f1f3f5', border: 'none' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                    onClick={() => {
                        setShowAddForm(false);
                        setNewBlog({ title: "", type: "", link: "", pic: null });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm"
                    style={{ transition: 'all 0.2s transform' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    Publish Blog
                  </button>
                </div>
              </form>
            </div>
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
                  `${BASE_URL}/api/blogs/${item.id}`,
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
                Type={item.Type}
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
