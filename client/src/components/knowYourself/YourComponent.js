import React, { useEffect, useState } from 'react';

const YourComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
      //image: ""
    },
    {
      quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "Winston Churchill",
      //image: ""
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      //image: "https://via.placeholder.com/300"
    },
    {
      quote: "In the middle of difficulty lies opportunity.",
      author: "Albert Einstein",
     // image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Ffa%2F38%2Ffe%2Ffa38fec0dbedc3f29499795ccd7d15ee.jpg&tbnid=6_zmn5TRNgOusM&vet=12ahUKEwj6q8XFnt2EAxVwQGwGHfKvDlwQMygBegQIARBA..i&imgrefurl=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F840202874224140665%2F&docid=RC1hUZus4K9ffM&w=1080&h=1080&q=in%20the%20middle%20of%20difficulty%20lies%20opportunity&ved=2ahUKEwj6q8XFnt2EAxVwQGwGHfKvDlwQMygBegQIARBA"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000); // Change interval time as per requirement

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card text-center">
            {/*
            <img src={slides[currentSlide].image} className="card-img-top" alt="Motivational Quote" style={{ maxWidth: "50%", height: "50%" }} />
  */}
            <div className="card-body">
              <blockquote className="blockquote">
                <p className="mb-0">{slides[currentSlide].quote}</p><br></br>
                <footer className="blockquote-footer">{slides[currentSlide].author}</footer>
              </blockquote>

            </div>
            <div className="card-footer">
              <button className="btn btn-light-green mr-2" onClick={prevSlide}>&lt;-</button>&nbsp;
              <button className="btn btn-light-green" onClick={nextSlide}>-&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
