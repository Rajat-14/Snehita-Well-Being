import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/helper';
import QuizTemplate from './Components/QuizTemplate';
import LoadingPage from '../templates/loadingPage';

const DynamicQuiz = () => {
  const { quizName } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/manage-quizzes/questions/${quizName}`)
      .then(res => {
        if (!res.ok) throw new Error(`Quiz not found (${res.status})`);
        return res.json();
      })
      .then(data => {
        setQuizData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading quiz:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [quizName]);

  if (loading) return <LoadingPage />;
  if (error) return (
    <div className="text-center mt-5">
      <h3 className="text-danger">Quiz not available</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={() => navigate('/FunQuizzes')}>
        Back to Quizzes
      </button>
    </div>
  );

  const finalTrait = (score, total) => {
    const suggestions = quizData.suggestions || [];
    const pct = (score / total) * 100;
    let msg = '';
    if (pct >= 80) msg = suggestions[0] || 'Excellent performance!';
    else if (pct >= 60) msg = suggestions[1] || 'Good performance!';
    else if (pct >= 40) msg = suggestions[2] || 'Needs improvement.';
    else msg = suggestions[3] || 'Keep practicing!';
    return <div><p>{msg}</p></div>;
  };

  return (
    <QuizTemplate
      title={quizData.heading}
      questions={quizData.questions}
      onClose={() => navigate('/FunQuizzes')}
      finalTrait={finalTrait}
    />
  );
};

export default DynamicQuiz;
