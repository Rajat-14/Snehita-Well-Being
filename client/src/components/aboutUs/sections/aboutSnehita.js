import './aboutSnehita.css';
import { useEffect, useState } from 'react';

const AboutSnehita = () => {
  const [orgInfo, setOrgInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutSnehita = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/organization-info/type/aboutSnehita`);
        if (!response.ok) {
          throw new Error('Failed to fetch about information');
        }
        const data = await response.json();
        if (data.length > 0) {
          setOrgInfo(data[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching about information:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutSnehita();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }

  if (!orgInfo) {
    return <div><p>No information available</p></div>;
  }

  return (
    <div>
      <span className="text-primary aboutSnehitaHighlighting">Snehita - Well Being Cell</span> {orgInfo.description}
    </div>
  );
};
export default AboutSnehita;
