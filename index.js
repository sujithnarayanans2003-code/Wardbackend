const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cases', require('./routes/cases'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.get('/', (req, res) => res.json({ status: 'Ward App Running' }));
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wardapp';
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
}).catch(err => console.error(err));
