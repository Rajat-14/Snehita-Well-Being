import React from "react";
import errorImage from "./400.jpg";

const Error = () => {
  return (
    <div>
      <img
        src={errorImage}
        alt=""
        style={{
          position: "fixed",
          
          height: "100vh",
          width: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
};

export default Error;
