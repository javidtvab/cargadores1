// Import required modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChargerSelection() {
  const [chargers, setChargers] = useState([]);
  const [selectedCharger, setSelectedCharger] = useState(null);
  const [kw, setKw] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChargers() {
      try {
        const response = await axios.get('/api/chargers');
        setChargers(response.data.data);
      } catch (err) {
        setError('Failed to load chargers.');
      }
    }

    fetchChargers();
  }, []);

  const handleSelect = (chargerId) => {
    setSelectedCharger(chargerId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCharger || !kw) {
      setError('Please select a charger and enter the kW amount.');
      return;
    }

    try {
      await axios.post(`/api/chargers/${selectedCharger}/start`, { kw });
      navigate('/payment-summary');
    } catch (err) {
      setError('Failed to start charging session.');
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Select Charger</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="charger">Select Charger:</label>
          <select
            id="charger"
            value={selectedCharger || ''}
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option value="" disabled>
              -- Select a Charger --
            </option>
            {chargers.map((charger) => (
              <option key={charger.id} value={charger.id}>
                {charger.name} - {charger.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="kw">kW Amount:</label>
          <input
            type="number"
            id="kw"
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            required
          />
        </div>

        <button type="submit">Start Charging</button>
      </form>
    </div>
  );
}

export default ChargerSelection;
