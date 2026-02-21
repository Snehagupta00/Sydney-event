const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
    }
);

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const User = require('../models/User');
        let user = await User.findOne({ email: email });

        if (!user) {
            user = await new User({
                email,
                name: 'Admin User',
                avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff'
            }).save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, user });
    }

    res.status(401).json({ message: 'Invalid credentials' });
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        const User = require('../models/User');
        const user = await User.findById(decoded.id);
        res.json(user);
    });
});

module.exports = router;
