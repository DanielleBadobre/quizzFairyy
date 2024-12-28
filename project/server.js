// server.js

const express = require('express');
const { createServer } = require('@vercel/node');
const { deckRoutes } = require('./routes/deckRoutes');  // Your existing routes

const app = express();

app.use(express.json());
app.use('/api/decks', deckRoutes);

module.exports = createServer(app);
