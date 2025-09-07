const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const axios = require('axios');

// Database connection pool setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'superfin_db',
    password: 'chetansql',
    port: 5001,
});

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({ msg: 'User registered successfully!', user: result.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const user = userCheck.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        res.json({ msg: 'Logged in successfully!', user: { id: user.id, username: user.username, email: user.email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get a user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get user portfolio and transaction history
router.get('/portfolio/:userId', async (req, res) => {
    const { userId } = req.params;
    // In a real app, you would query your database here
    const portfolio = {
        totalValue: 5500.50,
        holdings: [
            { crypto: 'bitcoin', amount: 0.1, value: 5000.00 },
            { crypto: 'ethereum', amount: 2, value: 500.50 }
        ],
        transactions: [
            { type: 'buy', crypto: 'bitcoin', amount: 0.1, date: '2025-09-01' },
            { type: 'sell', crypto: 'ethereum', amount: 1, date: '2025-08-28' }
        ]
    };
    res.json(portfolio);
});


// Cryptocurrency market data route
router.get('/marketdata', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd');
        res.json(response.data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Cryptocurrency buy route
router.post('/buy', async (req, res) => {
    const { userId, cryptoType, amount } = req.body;

    try {
        // You would add real trading logic here
        const transactionResult = {
            userId,
            cryptoType,
            amount,
            service: 'crypto-buy',
            status: 'completed',
            timestamp: new Date()
        };

        res.status(200).json({ msg: 'Cryptocurrency purchase successful!', transaction: transactionResult });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Cryptocurrency sell route
router.post('/sell', async (req, res) => {
    const { userId, cryptoType, amount } = req.body;

    try {
        // You would add real trading logic here
        const transactionResult = {
            userId,
            cryptoType,
            amount,
            service: 'crypto-sell',
            status: 'completed',
            timestamp: new Date()
        };

        res.status(200).json({ msg: 'Cryptocurrency sell successful!', transaction: transactionResult });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Mobile recharge route
router.post('/recharge/mobile', async (req, res) => {
    const { userId, mobileNumber, amount } = req.body;
    
    try {
        // You would connect to a third-party API here
        const transactionResult = {
            userId,
            service: 'mobile-recharge',
            mobileNumber,
            amount,
            status: 'completed',
            timestamp: new Date()
        };

        res.status(200).json({ msg: 'Mobile recharge successful!', transaction: transactionResult });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Electricity bill payment route
router.post('/bill/electricity', async (req, res) => {
    const { userId, customerId, amount } = req.body;
    
    try {
        // You would connect to a third-party API here
        const transactionResult = {
            userId,
            service: 'electricity-bill',
            customerId,
            amount,
            status: 'completed',
            timestamp: new Date()
        };

        res.status(200).json({ msg: 'Electricity bill payment successful!', transaction: transactionResult });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;