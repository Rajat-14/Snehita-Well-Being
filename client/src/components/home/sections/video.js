import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../services/helper"
import "./video.css";
const Video = (videoid) => {
  const videoRef = useRef(null);
  const [videoKey, setVideoKey] = useState(Date.now());

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  });

  // Reload video every time this component mounts (picks up new uploads)
  useEffect(() => {
    setVideoKey(Date.now());
  }, []);

  return (
    <div className="video">
      <div className="video-background">
        <video key={videoKey} ref={videoRef} autoPlay loop muted>
          <source src={`${BASE_URL}/home/video?t=${videoKey}`} type='video/mp4' />
          Your browser does not support the video tag.
        </video>
        <div className=" video-overlay">
          <div className="row">
            <div className="col col-md-8 text-white video-info ">
              <h1>
                <span>SNEHITA</span>
                <br />
                WELLBEING
              </h1>
              {/* <p> Transforming Lives, Resolving Cases,Nurturing Minds, 
              <br/>and Cultivating Resilience at 
                <br/>IIT Ropar, a beacon of support.</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Video;
