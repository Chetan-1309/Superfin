import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchUserAndPortfolio = async () => {
      const userId = Cookies.get('userId');
      if (userId) {
        try {
          const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`);
          setUser(userRes.data);

          const portfolioRes = await axios.get(`http://localhost:5000/api/auth/portfolio/${userId}`);
          setPortfolio(portfolioRes.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchUserAndPortfolio();
  }, []);

  if (!user || !portfolio) {
    return (
      <div className="auth-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your Dashboard provides a summary of your financial activities.</p>

      <div className="portfolio-summary">
        <h3>Portfolio Summary</h3>
        <p>Total Value: ${portfolio.totalValue}</p>
        <h4>Holdings:</h4>
        <ul>
          {portfolio.holdings.map((h, i) => (
            <li key={i}>{h.amount} {h.crypto} (${h.value})</li>
          ))}
        </ul>
        <h4>Recent Transactions:</h4>
        <ul>
          {portfolio.transactions.map((t, i) => (
            <li key={i}>{t.type} {t.amount} {t.crypto} on {t.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;