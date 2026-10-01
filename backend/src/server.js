const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const env = require('./config/env.config');
const connectDB = require('./config/db.config');
const { errorHandler } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', data: { message: 'server is running' } });
});

app.use('/api/v1/auth', authRoutes);

// Error Handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

const wss = new WebSocketServer({ server })
wss.on("listening", (ws) => {
  console.log(`Websocket server is set on ${env.PORT}`);
})

wss.on('connection', (ws) => {                                                                                                                                                                                                                                
  console.log('A new client connected');                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  ws.send(JSON.stringify({message: 'Hello World' }));                                                                                                                                                                           
                                                                                                                                                                                                                                                              
  ws.on('message', (message) => {                                                                                                                                                                                                                             
    console.log('Received:', message.toString());                                                                                                                                                                                                             
  });                                                                                                                                                                                                                                                         
});  