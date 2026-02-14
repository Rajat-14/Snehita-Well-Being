import MessageCard from "../component/messageCard";
import { useEffect, useState } from "react";

const CounsellorMessage = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounsellorMessages = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/messages/type/counsellor`);
        if (!response.ok) {
          throw new Error('Failed to fetch counsellor messages');
        }
        const data = await response.json();
        setCounsellors(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching counsellor messages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellorMessages();
  }, []);

  if (loading) {
    return <div><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div>
      {counsellors.map((item) => {
        const messageArray = item.messageContent.split('\n').filter(line => line.trim());
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        return (
          <div className="mt-2" key={item.id}>
            <MessageCard
              pic={item.image ? `${apiUrl}/uploads/messages/${item.image}` : null}
              name={item.name}
              designation={item.designation}
              emailId={item.emailId}
              telephoneNo={item.telephoneNo}
              message={messageArray}
            />
            <hr></hr>
          </div>
        );
      })}
    </div>
  );
};
export default CounsellorMessage;
