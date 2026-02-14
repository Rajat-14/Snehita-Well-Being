import { useEffect, useState } from 'react';
import HomeBlogCard from "../components/homeBlogCard";

const OurWork = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/achievements`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const data = await response.json();
        setAchievements(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="mb-5 text-center"><p>Loading achievements...</p></div>;
  }

  if (error) {
    return <div className="mb-5 text-center text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div className="mb-5">
      <h1 className="d-flex justify-content-center py-3">ACHIEVEMENTS</h1>
      <div className="container">
        <div className="mx-3 row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
          {achievements.map((achievement, index) => {
            const animationClass = index % 3 === 0 ? "fade-right" : index % 3 === 1 ? "fade-up" : "fade-left";
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            return (
              <div className="col" data-aos={animationClass} key={achievement.id}>
                <HomeBlogCard
                  Pic={achievement.image ? `${apiUrl}/uploads/achievements/${achievement.image}` : null}
                  Title={achievement.title}
                  cardDescription={achievement.description}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OurWork;