const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({success: true, message: "Welcome to User Authentication System Home Page"})
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;