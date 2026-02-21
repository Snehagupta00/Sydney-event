const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
    }
);

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        

        if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
            return res.status(403).json({ message: 'Restricted Identity. Manual registration blocked.' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        user = new User({
            name,
            email,
            password: hashedPassword,

            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
        });

        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        if (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() && password === process.env.ADMIN_PASSWORD) {
            let user = await User.findOne({ email: email });
            if (!user) {
                user = await new User({
                    email,
                    name: 'Admin User',
                    role: 'admin',
                    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff'
                }).save();
            } else if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ token, user });
        }


        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.password) {
             return res.status(401).json({ message: 'Account linked with Google. Please login with Google.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, role: user.role } });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        const user = await User.findById(decoded.id);
        res.json(user);
    });
});

module.exports = router;
