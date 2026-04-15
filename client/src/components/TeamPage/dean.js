import { useState, useEffect } from "react";
import FacultyCard from "./components/facultyCard";
import { BASE_URL } from "../services/helper";

const Dean = () => {
  const [dean, setDean] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDean = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/team-members/type/dean`);
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

  const baseUrl = BASE_URL;
  const imageUrl = dean.image
    ? (dean.image.startsWith('http') ? dean.image : `${baseUrl}${dean.image}`)
    : '';

  return (
    <div className="my-2">
      <FacultyCard
        pic={imageUrl}
        name={dean.name}
        designation={dean.designation}
        emailId={dean.email}
        experience={dean.experience}
        message={Array.isArray(dean.message) ? dean.message.join(' ') : (dean.message || '')}
        telephoneNo={dean.telephoneNo}
      />
    </div>
  );
};

export default Dean;
