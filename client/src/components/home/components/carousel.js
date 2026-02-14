const Carousel = () => {
  const eventItems = [
    { filename: 'event_1.jpg', caption: 'International Yoga Day' },
    { filename: 'event_2.jpg', caption: 'Nasha Mukt Bharat Abhiyaan' },
    { filename: 'event_3.jpg', caption: 'Prevention from Substance Abuse' },
    { filename: 'event_4.jpg', caption: 'Rally on Prevention from Substance Abuse' },
    { filename: 'event_9.jpg', caption: 'Boundaries' },
    { filename: 'event_6.jpg', caption: 'Nuance of Counselling' }
  ];

  return (
    <div id="carouselExampleRide" className="carousel slide" data-bs-ride="carousel" data-bs-interval={2000}>
      <div className="carousel-inner">
        {eventItems.map((item, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img
              src={require(`../../assets/Gallery/${item.filename}`)}
              className="d-block w-100 h-auto"
              alt={item.caption}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>{item.caption}</h5>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
export default Carousel;


