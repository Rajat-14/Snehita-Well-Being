import './aboutSnehita.css';
import { useEffect, useState } from 'react';

const AboutSnehita = () => {
  const [orgInfo, setOrgInfo] = useState([]);
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
        setOrgInfo(Array.isArray(data) ? data : []);
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

  if (!orgInfo || orgInfo.length === 0) {
    return <div><p>No information available</p></div>;
  }

  return (
    <div>
      {orgInfo.map((info, idx) => (
        <div key={info.id || idx} style={{ marginBottom: '20px' }}>
          <span className="text-primary aboutSnehitaHighlighting" style={{ display: 'block', marginBottom: '8px', fontSize: '1.2rem' }}>
            {info.title}
          </span>
          <p style={{ whiteSpace: 'pre-wrap' }}>{info.description}</p>
        </div>
      ))}
    </div>
  );
};
export default AboutSnehita;
