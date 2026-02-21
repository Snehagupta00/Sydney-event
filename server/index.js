require('dotenv').config();
const dns = require('dns');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = await new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0].value
                }).save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));



app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
