const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./utils/db');

// Route files
const messageRoutes = require('./routes/messages');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to database
connectDB();

// Register models with Mongoose to prevent schema errors
require('./models/User');
require('./models/Message');
require('./models/Conversation');

const app = express();

// Body parser
app.use(express.json());

// Enable cors
app.use(cors());

// Mount routers
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

const PORT = process.env.PORT || 5001;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
