import React, { Suspense } from "react";
import Animation from "../templates/animation";
import LoadingPage from "../templates/loadingPage";
import Feedback from "./sections/feedback";


const Gallery = React.lazy(() => import("./sections/gallery"));
const HomeBlogs = React.lazy(() => import("./sections/homeBlogs"));
const Message = React.lazy(() => import("./sections/message"));
const OurWork = React.lazy(() => import("./sections/ourWork"));
const Testimonial = React.lazy(() => import("./sections/testimonial"));
const Video = React.lazy(() => import("./sections/video"));
const FeedbackForm = React.lazy(() => import("./sections/feedback"));

const Home = () => {
  return (
    <Suspense fallback={<LoadingPage/>}>
      <div>
        <Video />
        <Animation />
        <Message />
        <OurWork />
        <HomeBlogs />
        <Gallery />
        <Testimonial />
        {/* <Feedback/> */}
      </div>
    </Suspense>
  );
};

export default Home;
