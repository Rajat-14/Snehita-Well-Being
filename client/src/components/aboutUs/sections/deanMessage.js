import MessageCard from "../component/messageCard";
import { useEffect, useState } from "react";

const DeanMessage = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeanMessage = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/messages/type/dean`);
        if (!response.ok) {
          throw new Error('Failed to fetch dean message');
        }
        const data = await response.json();
        if (data.length > 0) {
          setMessage(data[0]);
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching dean message:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeanMessage();
  }, []);

  if (loading) {
    return <div className="mt-2"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="mt-2 text-danger"><p>Error: {error}</p></div>;
  }

  if (!message) {
    return <div className="mt-2"><p>No message available</p></div>;
  }

  const messageArray = message.messageContent.split('\n').filter(line => line.trim());
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  return (
    <div className="mt-2">
      <MessageCard
        pic={message.image ? `${apiUrl}/uploads/messages/${message.image}` : null}
        name={message.name}
        designation={message.designation}
        emailId={message.emailId}
        telephoneNo={message.telephoneNo}
        message={messageArray}
      />
      <hr></hr>
    </div>
  );
};
export default DeanMessage;
