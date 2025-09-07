import React from 'react';

const Wallet = () => {
    // This data mimics the screenshot from the report (Figure 6.8)
    const transactions = [
        { type: 'UPI Deposit', status: 'Complete', date: '24 Jun 24, 08:31 PM', amount: '₹10,000' },
        { type: 'Withdrawal', status: 'Completed', date: '24 Jun 24, 08:15 PM', amount: '₹5,000' },
        { type: 'UPI Deposit', status: 'Complete', date: '24 Jun 24, 07:55 PM', amount: '₹5,000' },
        { type: 'Withdrawal', status: 'Completed', date: '29 May 24, 11:52 AM', amount: '₹2,055' },
    ];

    return (
        <div className="wallet-container">
            <h2>Wallet</h2>
            <div className="wallet-balance-card">
                <h3>Current Balance</h3>
                <h2>₹1000.00</h2>
                <p>Locked Balance ₹0</p>
            </div>
            <div className="transaction-history">
                <h3>Transaction History</h3>
                {transactions.map((t, index) => (
                    <div className="transaction-item" key={index}>
                        <div>
                            <h4>{t.type}</h4>
                            <p style={{ color: t.status === 'Complete' ? '#6AEB9A' : '#ff3344' }}>{t.status}</p>
                            <p style={{ fontSize: '0.8em', color: '#999' }}>{t.date}</p>
                        </div>
                        <h2>{t.amount}</h2>
                    </div>
                ))}
            </div>
            <div className="transaction-buttons">
                <button>Add Money</button>
                <button>Withdraw</button>
            </div>
        </div>
    );
};

export default Wallet;