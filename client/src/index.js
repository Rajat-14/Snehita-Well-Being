import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './redux/store/index'; 
import LoadingPage from './components/templates/loadingPage';
import AboutWebsite from './components/aboutWebsite/aboutWebsite';

// Lazy load your components
const Home = React.lazy(() => import('./components/home/home'));
const AppLayout = React.lazy(() => import('./components/layout/appLayout'));
const Login = React.lazy(() => import('./components/login_signup/login/Login'));
const Register = React.lazy(() => import('./components/login_signup/signup/Register'));
const Blogs = React.lazy(() => import('./components/blogs/blogs'));
const ContactUs = React.lazy(() => import('./components/contactUs/contactUs'));
const Appointment = React.lazy(() => import('./components/appointment/appointment'));
const KnowYourself = React.lazy(() => import('./components/knowYourself/knowYourself'));
const GenInfo = React.lazy(() => import('./components/otherInfo/genInfo'));
const AboutUs2Page = React.lazy(() => import('./components/aboutUs/aboutUs2'));
const Error = React.lazy(() => import('./components/layout/Error'));
const TeamPage = React.lazy(() => import('./components/TeamPage/TeamPage'));
const FunQuizzes = React.lazy(() => import('./components/FunQuizzes/FunQuizzes'));
const SleepQuiz = React.lazy(() => import('./components/FunQuizzes/Sleep/SleepQuiz'));
const AngerQuiz = React.lazy(() => import('./components/FunQuizzes/AngerQuiz/AngerQuiz'));
const AnxietyQuiz = React.lazy(() => import('./components/FunQuizzes/AnxietyQuiz/AnxietyQuiz'));
const MotivationQuiz = React.lazy(() => import('./components/FunQuizzes/MotivationQuiz/MotivationQuiz'));
const HabitQuiz = React.lazy(() => import('./components/FunQuizzes/HabitsQuiz/HabitsQuiz'));
const StressQuiz = React.lazy(() => import('./components/FunQuizzes/StressQuiz/StressQuiz'));
const QualityOfLifeQuiz = React.lazy(() => import('./components/FunQuizzes/Quality of Life Quiz/QOLQuiz'));
const EmotionalIntelligenceQuiz = React.lazy(() => import('./components/FunQuizzes/Emotional Intelligence/EIQuiz'));
const HappinessQuiz = React.lazy(() => import('./components/FunQuizzes/HappinessQuiz/HappinessQuiz'));
const SocialRelationshipQuiz = React.lazy(() => import('./components/FunQuizzes/Social Relationship/SocialRelationshipQuiz'));
const LifestyleQuiz = React.lazy(() => import('./components/FunQuizzes/Life Style/LifeStyleQuiz'));
const InternetUsageQuiz = React.lazy(() => import('./components/FunQuizzes/Internet Usage/InternetUsageTest'));
const DepressionTest = React.lazy(() => import('./components/FunQuizzes/Depression/DepressionTest'));
const BodyImageQuiz = React.lazy(() => import('./components/FunQuizzes/Body Image/BodyImageTest'));
const TimeManagementQuiz = React.lazy(() => import('./components/FunQuizzes/Time Management/TimeManagementQuiz'));
const UsefullLink = React.lazy(() => import('./components/usefullLink/usefullLink'));
const AppointmentSubmitted = React.lazy(() => import('./components/AppointmentSubmitted/AppointmentSubmitted'));
const NewPassword  = React.lazy(() => import ( './components/login_signup/forgotPassword/newpassword')); 
const OtpForget = React.lazy(() => import ('./components/login_signup/forgotPassword/otpforget'));
const Email = React.lazy(() => import ( './components/login_signup/forgotPassword/email')); 
const Otp = React.lazy(() => import ('./components/login_signup/otp/otp'));
const appRouter = createBrowserRouter([
  {  
    path: '/',
    element: (
        <React.Suspense fallback={<div><LoadingPage/></div>}>
          <AppLayout />
        </React.Suspense>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/blogs',
        element: <Blogs />,
      },
      {
        path: '/contactus',
        element: <ContactUs />,
      },
      {
        path: '/aboutus',
        element: <AboutUs2Page />,
      },
      {
        path:'/aboutWebsite',
        element:<AboutWebsite/>
      },
      {
        path: '/appointment',
        element: <Appointment />,
      },
      {
        path: '/knowyourself',
        element: <KnowYourself />,
      },
      {
        path : '/TeamPage',
        element : <TeamPage/>
      },
      {
        path: '/otherinfo',
        element: <GenInfo/>,
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '/signup',
        element: <Register/>,
      },
      {
        path: '/otp',
        element: <Otp/>,
      },
      {
        path: '/email',
        element: <Email/>,
      },
      {
        path: '/otpforget',
        element: <OtpForget/>,
      },
      {
        path: '/resetpassword',
        element: <NewPassword/>,
      },
      {
        path:'/usefullLink',
        element: <UsefullLink/>
      },
      {
        path: '/HappinessQuiz',
        element: <HappinessQuiz/>,
      },
      {
        path: '*',
        element: <Error/>,
      },
      {
        path: '/FunQuizzes',
        element : <FunQuizzes/>
      },
      {
        path : '/SleepQuiz',
        element : <SleepQuiz/>
      },
      {
        path : '/AngerQuiz',
        element : <AngerQuiz/>
      },
      {
        path : '/AnxietyQuiz',
        element : <AnxietyQuiz/>
      },
      {
        path: '/MotivationQuiz',
        element : <MotivationQuiz/>
      },
      {
        path: '/HabitQuiz',
        element : <HabitQuiz/>
      },
      {
        path: '/QualityOfLifeQuiz',
        element : <QualityOfLifeQuiz/>
      },
      {
        path: '/StressQuiz',
        element : <StressQuiz/>
      },
      {
        path: '/EmotionalIntelligenceQuiz',
        element : <EmotionalIntelligenceQuiz/>
      },
      {
        path: '/SocialRelationshipQuiz',
        element : <SocialRelationshipQuiz/>
      },
      {
        path: '/LifeStyleQuiz',
        element : <LifestyleQuiz/>
      },
      {
        path: '/InternetUsageQuiz',
        element : <InternetUsageQuiz/>
      },
      {
        path: '/DepressionTest',
        element : <DepressionTest/>
      },
      {
        path: '/BodyImageQuiz',
        element : <BodyImageQuiz/>
      },
      {
        path: '/TimeManagementQuiz',
        element : <TimeManagementQuiz/>
      },
      {
        path: '/otherinfo',
        element: <GenInfo/>,
      },
      {
        path: '/AppointmentSubmitted',
        element : <AppointmentSubmitted/>
      },
      {
        path: '/loading',
        element : <LoadingPage/>
      },
      
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);
