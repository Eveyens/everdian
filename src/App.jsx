import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Hub from './pages/Hub';
import NonTechnical from './pages/NonTechnical';
import Power from './pages/Power';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/non-technical" element={<NonTechnical />} />
        <Route path="/power" element={<Power />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
