const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ code: 'OK', message: 'server is running' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
