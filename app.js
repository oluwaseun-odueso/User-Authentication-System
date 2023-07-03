const express = require('express');
const userRoutes = require('./routes/user')
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json())
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.status(200).json({success: true, message: "Welcome to User Authentication System Home Page"})
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;