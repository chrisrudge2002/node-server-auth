// Entry point of the node application
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const router = require('./router');

// Database Setup
mongoose.connect('mongodb://localhost:auth/auth');

// Application Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT);

console.log(`Express server started on port ${PORT}`);
