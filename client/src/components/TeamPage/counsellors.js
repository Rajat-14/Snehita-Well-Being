import FacultyCard from "./components/facultyCard";
import { useEffect, useState } from "react";
import { BASE_URL } from "../services/helper";

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/team-members/type/counsellor`);
        if (!response.ok) {
          throw new Error('Failed to fetch counsellors');
        }
        const data = await response.json();
        setCounsellors(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching counsellors:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  if (loading) {
    return <div><p>Loading Counsellors...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      {counsellors.map((item, index) => {
        const baseUrl = BASE_URL;
        const imageUrl = item.image
          ? (item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`)
          : '';
        return (
          <div className="my-4" key={index}>
            <FacultyCard
              pic={imageUrl}
              name={item.name}
              designation={item.designation}
              emailId={item.email}
              experience={item.experience}
              message={Array.isArray(item.message) ? item.message.join(' ') : (item.message || '')}
              telephoneNo={item.telephoneNo}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Counsellors;