import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Ewallet = () => {
    const [rechargeData, setRechargeData] = useState({ mobileNumber: '', amount: '' });
    const [billData, setBillData] = useState({ customerId: '', amount: '' });

    const onRechargeSubmit = async (e) => {
        e.preventDefault();
        const userId = Cookies.get('userId');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/recharge/mobile', { userId, ...rechargeData });
            console.log(res.data);
            alert('Mobile recharge successful!');
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg);
        }
    };

    const onBillSubmit = async (e) => {
        e.preventDefault();
        const userId = Cookies.get('userId');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/bill/electricity', { userId, ...billData });
            console.log(res.data);
            alert('Electricity bill payment successful!');
        } catch (err) {
            console.error(err.response.data);
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="ewallet-container">
            <h2>Our Services</h2>
            <div className="card-grid">
              <div className="card">
                <h3>Mobile Recharge</h3>
                <form onSubmit={onRechargeSubmit}>
                    <div>
                        <label>Mobile Number:</label>
                        <input type="text" value={rechargeData.mobileNumber} onChange={e => setRechargeData({ ...rechargeData, mobileNumber: e.target.value })} required />
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input type="number" value={rechargeData.amount} onChange={e => setRechargeData({ ...rechargeData, amount: e.target.value })} required />
                    </div>
                    <button type="submit">Recharge</button>
                </form>
              </div>
              <div className="card">
                <h3>Electricity Bill</h3>
                <form onSubmit={onBillSubmit}>
                    <div>
                        <label>Customer ID:</label>
                        <input type="text" value={billData.customerId} onChange={e => setBillData({ ...billData, customerId: e.target.value })} required />
                    </div>
                    <div>
                        <label>Amount:</label>
                        <input type="number" value={billData.amount} onChange={e => setBillData({ ...billData, amount: e.target.value })} required />
                    </div>
                    <button type="submit">Pay Bill</button>
                </form>
              </div>
            </div>
        </div>
    );
};

export default Ewallet;