// Import required modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axios.get('/api/notifications');
        setNotifications(response.data.data);
      } catch (err) {
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <p><strong>{notification.title}</strong></p>
              <p>{notification.message}</p>
              <p><small>{new Date(notification.timestamp).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
