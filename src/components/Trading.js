import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Trading = () => {
    const [chartData, setChartData] = useState(null);
    const [realTimeData, setRealTimeData] = useState(null);
    const [tradeData, setTradeData] = useState({ cryptoType: 'bitcoin', amount: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [cryptoList, setCryptoList] = useState([]);

    useEffect(() => {
        const fetchHistoricalData = async (crypto) => {
            try {
                const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=1`);
                const prices = res.data.prices;

                const data = {
                    labels: prices.map(price => new Date(price[0]).toLocaleTimeString()),
                    datasets: [
                        {
                            label: `Price in USD`,
                            data: prices.map(price => price[1]),
                            borderColor: '#FF8700',
                            tension: 0.1,
                        },
                    ],
                };
                setChartData(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRealTimeData = async () => {
            try {
                const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
                setRealTimeData(res.data.bitcoin);
            } catch (err) {
                console.error("Error fetching real-time data:", err);
            }
        };
        
        const fetchCryptoList = async () => {
            try {
                const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true');
                setCryptoList(res.data);
            } catch (err) {
                console.error("Error fetching crypto list:", err);
            }
        };

        fetchHistoricalData(tradeData.cryptoType);
        fetchRealTimeData();
        fetchCryptoList();

        const interval = setInterval(() => {
            fetchRealTimeData();
            fetchHistoricalData(tradeData.cryptoType);
            fetchCryptoList();
        }, 10000);

        return () => clearInterval(interval);
    }, [tradeData.cryptoType]);

    const onTradeSubmit = async (e, tradeType) => {
        e.preventDefault();
        setIsLoading(true);
        const userId = Cookies.get('userId');

        try {
            const res = await axios.post(
                `http://localhost:5000/api/auth/${tradeType}`,
                { userId, ...tradeData }
            );
            console.log(res.data);
            alert(`Cryptocurrency ${tradeType} successful!`);
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg);
        } finally {
            setIsLoading(false);
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
    };

    return (
        <div className="trading-container">
          <div className="trade-page">
            <div className="trade-chart">
              <h2>Cryptocurrency Trading</h2>
              {realTimeData && (
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <h3>Bitcoin Price: ${realTimeData.usd}</h3>
                      <p>24h Change: {realTimeData.usd_24h_change.toFixed(2)}%</p>
                  </div>
              )}
              {chartData ? (
                  <div style={{ maxWidth: '90%' }}>
                      <Line data={chartData} options={options} />
                  </div>
              ) : (
                  <p>Loading market data...</p>
              )}
            </div>

            <div className="trade-forms">
              <h3>Trade</h3>
              <form>
                  <div>
                      <label>Crypto:</label>
                      <select name="cryptoType" value={tradeData.cryptoType} onChange={e => setTradeData({ ...tradeData, cryptoType: e.target.value })}>
                          <option value="bitcoin">Bitcoin</option>
                          <option value="ethereum">Ethereum</option>
                          <option value="cardano">Cardano</option>
                      </select>
                  </div>
                  <div>
                      <label>Amount:</label>
                      <input
                          type="number"
                          name="amount"
                          value={tradeData.amount}
                          onChange={e => setTradeData({ ...tradeData, amount: e.target.value })}
                          placeholder="e.g., 0.05"
                          required
                      />
                  </div>
                  <button type="button" onClick={(e) => onTradeSubmit(e, 'buy')} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Buy'}
                  </button>
                  <button type="button" onClick={(e) => onTradeSubmit(e, 'sell')} disabled={isLoading}>
                      {isLoading ? 'Processing...' : 'Sell'}
                  </button>
              </form>
            </div>
          </div>
            <div style={{ marginTop: '50px' }}>
                <h3>Top Cryptocurrencies</h3>
                <table className="watchlist-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>24h %</th>
                            <th>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cryptoList.map((crypto, index) => (
                            <tr key={crypto.id}>
                                <td>{index + 1}</td>
                                <td>{crypto.name} ({crypto.symbol.toUpperCase()})</td>
                                <td>${crypto.current_price.toFixed(2)}</td>
                                <td>{crypto.price_change_percentage_24h.toFixed(2)}%</td>
                                <td>${(crypto.market_cap / 1000000000).toFixed(2)}B</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Trading;