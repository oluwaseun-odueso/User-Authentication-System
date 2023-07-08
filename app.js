const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 86400000, secure: true }
};

app.use(cookieParser())
app.use(session(sess))
app.use(express.json())
app.use('/user', userRoutes)

// Home page
app.get('/', (req, res) => {
    res.status(200).json({success: true, message: "Welcome User Authentication System"})
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;