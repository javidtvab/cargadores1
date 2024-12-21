import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Chargers from "./pages/Chargers";
import Sessions from "./pages/Sessions";
import Users from "./pages/Users";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chargers" element={<Chargers />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/users" element={<Users />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
