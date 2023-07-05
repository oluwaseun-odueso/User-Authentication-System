const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const userRoutes = require('./routes/user');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Authentication System',
            version: '1.0.0',
            description: 'A simple express User Authentication System API'
        },
        server: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options);

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(express.json())
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.status(200).json({success: true, message: "Welcome to User Authentication System Home Page"})
});

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));

module.exports = app;