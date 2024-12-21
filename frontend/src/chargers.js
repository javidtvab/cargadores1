import React, { useState, useEffect } from "react";
import axios from "axios";

function Chargers() {
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    power: "",
    rate_per_kwh: "",
    rate_per_minute: "",
  });

  const API_BASE_URL = "http://localhost:8000/api/chargers";

  useEffect(() => {
    fetchChargers();
  }, []);

  const fetchChargers = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setChargers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch chargers");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_BASE_URL, form);
      setChargers([...chargers, response.data]);
      setForm({
        name: "",
        location: "",
        power: "",
        rate_per_kwh: "",
        rate_per_minute: "",
      });
    } catch (err) {
      setError("Failed to create charger");
    }
  };

  const handleDelete = async (chargerId) => {
    try {
      await axios.delete(`${API_BASE_URL}/${chargerId}`);
      setChargers(chargers.filter((charger) => charger.id !== chargerId));
    } catch (err) {
      setError("Failed to delete charger");
    }
  };

  if (loading) return <p>Loading chargers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Chargers</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleInputChange}
          placeholder="Location"
          required
        />
        <input
          type="number"
          name="power"
          value={form.power}
          onChange={handleInputChange}
          placeholder="Power (kW)"
          required
        />
        <input
          type="number"
          name="rate_per_kwh"
          value={form.rate_per_kwh}
          onChange={handleInputChange}
          placeholder="Rate per kWh"
          required
        />
        <input
          type="number"
          name="rate_per_minute"
          value={form.rate_per_minute}
          onChange={handleInputChange}
          placeholder="Rate per Minute"
          required
        />
        <button type="submit">Add Charger</button>
      </form>

      <ul>
        {chargers.map((charger) => (
          <li key={charger.id}>
            <h3>{charger.name}</h3>
            <p>Location: {charger.location}</p>
            <p>Power: {charger.power} kW</p>
            <p>Rate per kWh: ${charger.rate_per_kwh}</p>
            <p>Rate per Minute: ${charger.rate_per_minute}</p>
            <button onClick={() => handleDelete(charger.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chargers;
