import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Charging Station Manager</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chargers">Chargers</Link></li>
        <li><Link to="/sessions">Sessions</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/invoices">Invoices</Link></li>
        <li><Link to="/payments">Payments</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
