import { useState, useEffect } from "react";
import FacultyCard from "./components/facultyCard";

const Dean = () => {
  const [dean, setDean] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDean = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members/type/dean`);
        if (!response.ok) {
          throw new Error('Failed to fetch dean');
        }
        const data = await response.json();
        if (data.length > 0) {
          setDean(data[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching dean:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDean();
  }, []);

  if (loading) {
    return <div><p>Loading Dean...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  if (!dean) {
    return <div><p>No dean information available</p></div>;
  }

  return (
    <div className="my-2">
      <FacultyCard
        pic={`http://localhost:8000${dean.image || ''}`}
        name={dean.name}
        designation={dean.designation}
        emailId={dean.email}
        experience={dean.experience}
        telephoneNo={dean.telephoneNo}
      />
    </div>
  );
};

export default Dean;
