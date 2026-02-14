import TeamCard from "./components/teamCard";
import { useState, useEffect } from "react";

const SnehitaBuddies = () => {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/team-members/type/buddy`);
        if (!response.ok) {
          throw new Error('Failed to fetch buddies');
        }
        const data = await response.json();
        setBuddies(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching buddies:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuddies();
  }, []);

  if (loading) {
    return <div><p>Loading Buddies...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div className="row row-col-1 row-col-md-2 row-col-lg-3 g-4">
      {buddies.map((item, index) => {
        return (
          <div className="col mb-4 mr-1" key={index}>
            <TeamCard
              name={item.name}
              designation={item.course}
              phoneNo={item.telephoneNo}
              emailId={item.email}
              pic={`http://localhost:8000${item.image || ''}`}
              instaId={item.instaId}
              linkedinId={item.linkedinId}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SnehitaBuddies;