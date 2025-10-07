import React, { useContext } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, useLocation } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const location = useLocation();
  return (
    <div className="">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            background: 'var(--color-base-100)',
            color: 'var(--color-base-content)',
            border: '1px solid var(--color-base-300)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '0.9rem',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--color-success-content)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'var(--color-error-content)',
            },
          },
        }}
      />
    </div>
  );
};

export default App;
