import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import Footer from './components/Footer';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/item/:id" element={<ItemDetail />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            },
            success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          }}
        />
      </div>
    </Router>
  );
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
console.log(apiKey);
}

export default App;

