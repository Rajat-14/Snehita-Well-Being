const Carousel = () => {
  const carouselItems = [
    { filename: 'first.jpg', caption: 'Together' },
    { filename: 'second.jpg', caption: 'Peace' },
    { filename: 'third.jpg', caption: 'Happiness' }
  ];

  return (
    <div id="carouselExampleAutoplaying" className="carousel slide carousel-fade " data-bs-ride='carousel' data-bs-interval={1500}>
      
      <div className="carousel-inner container">
        {carouselItems.map((item, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img 
              src={require(`../assets/${item.filename}`)} 
              style={{maxHeight:350, margin:'auto'}} 
              className="d-block" 
              alt={item.caption} 
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>{item.caption}</h5>
            </div>
          </div>
        ))}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
      </div>
    </div>
  );
};
export default Carousel;
