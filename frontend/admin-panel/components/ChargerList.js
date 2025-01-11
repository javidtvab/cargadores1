// Import required modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChargerList() {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChargers() {
      try {
        const response = await axios.get('/api/chargers');
        setChargers(response.data.data);
      } catch (err) {
        setError('Failed to fetch chargers.');
      } finally {
        setLoading(false);
      }
    }

    fetchChargers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Charger List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          {chargers.map((charger) => (
            <tr key={charger.id}>
              <td>{charger.name}</td>
              <td>{charger.location}</td>
              <td>{charger.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChargerList;
