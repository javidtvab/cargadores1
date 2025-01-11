// Import required modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TariffConfig() {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTariff, setNewTariff] = useState({ name: '', rate: '', timeSlotStart: '', timeSlotEnd: '' });

  useEffect(() => {
    async function fetchTariffs() {
      try {
        const response = await axios.get('/api/tariffs');
        setTariffs(response.data.data);
      } catch (err) {
        setError('Failed to fetch tariffs.');
      } finally {
        setLoading(false);
      }
    }

    fetchTariffs();
  }, []);

  async function handleAddTariff(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tariffs', newTariff);
      setTariffs([...tariffs, response.data.data]);
      setNewTariff({ name: '', rate: '', timeSlotStart: '', timeSlotEnd: '' });
    } catch (err) {
      setError('Failed to add tariff.');
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Tariff Configuration</h2>

      <form onSubmit={handleAddTariff}>
        <input
          type="text"
          placeholder="Tariff Name"
          value={newTariff.name}
          onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Rate"
          value={newTariff.rate}
          onChange={(e) => setNewTariff({ ...newTariff, rate: e.target.value })}
          required
        />
        <input
          type="time"
          placeholder="Time Slot Start"
          value={newTariff.timeSlotStart}
          onChange={(e) => setNewTariff({ ...newTariff, timeSlotStart: e.target.value })}
        />
        <input
          type="time"
          placeholder="Time Slot End"
          value={newTariff.timeSlotEnd}
          onChange={(e) => setNewTariff({ ...newTariff, timeSlotEnd: e.target.value })}
        />
        <button type="submit">Add Tariff</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rate</th>
            <th>Time Slot Start</th>
            <th>Time Slot End</th>
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff) => (
            <tr key={tariff.id}>
              <td>{tariff.name}</td>
              <td>{tariff.rate}</td>
              <td>{tariff.timeSlotStart || 'N/A'}</td>
              <td>{tariff.timeSlotEnd || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TariffConfig;
