// Imports
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {connectToMongoDB} = require('./config/database')

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());

// PORT
const PORT = process.env.PORT || 4000;

// Routes
app.use(require('./routes'));

// Listener
connectToMongoDB(() => {
    app.listen(PORT, () => {
        console.log('The server is up 🚀 and running on port', PORT);
    })
});