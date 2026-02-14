import React, { useState, useEffect } from "react";
import "./LoadingPage.css"; // Custom CSS file for additional styling

const LoadingPage = () => {
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setloading(true);
    }, 1000);
  }, []);
  return (
    <>
      {loading?(<div className="loading-page text-center">
        <div className="fs-1 text-primary">
          <div className="loading-welcome-first">
            <span>
            Take A Deep Breath
            </span>
        </div>
          <div className="d-flex justify-content-center ">
            <span className="mx-2">
              Please Wait... 
            </span>
            <div className="half-spinner"></div>
          </div>
        </div>
      </div>): (
        <div className="fs-1 text-primary loading-page loading-welcome-first">
          Welcome 
          <div className="loading-welcome-second">
            <span>  {"   "}
          To Snehita Well Being
            </span>
            </div>
        </div>
      )}
    </>
  );
};

export default LoadingPage;

{
  /* <p>Please wait... </p>
<div className='text-wrap '>
You will be directed to Senhita Well-being website shortly.
  </div> */
}
