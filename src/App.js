import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Trading from './components/Trading';
import Ewallet from './components/Ewallet';
import Wallet from './components/Wallet';
import News from './components/News';
import './App.css';

const Home = () => (
  <div className="home-container">
    <h1>HELLO, WELCOME TO SUPERFIN</h1>
    <p>"Don't be late, Investing is great."</p>
    <p>We are here to help you with <Link to="/news">Latest crypto news!</Link></p>
    <Link to="/register" className="join-us-button">Join Us</Link>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('userId');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };

  const AuthNav = () => (
    <>
      <li><Link to="/trade">TRADE</Link></li>
      <li><Link to="/ewallet">E-WALLET SERVICES</Link></li>
      <li><Link to="/wallet">WALLET</Link></li>
      <li><Link to="/dashboard">DASHBOARD</Link></li>
      <li><Link to="/news">CRYPTO NEWS</Link></li>
      <li><Link to="/" onClick={handleLogout}>LOGOUT</Link></li>
    </>
  );

  const PublicNav = () => (
    <>
      <li><Link to="/login">LOGIN</Link></li>
      <li><Link to="/register">REGISTER</Link></li>
    </>
  );

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="logo">SUPERFIN</div>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              {isLoggedIn ? <AuthNav /> : <PublicNav />}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trade" element={<Trading />} />
            <Route path="/ewallet" element={<Ewallet />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;