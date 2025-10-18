require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketio = require('socket.io');
const Reading = require('./models/Reading');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // for dashboard files

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/feverdb';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connect error:', err);
    console.log('Continuing without MongoDB connection for UI testing');
  });

// API: POST reading
app.post('/api/temps', async (req, res) => {
  try {
    const { deviceId, timestamp, tempC, distanceCm, status } = req.body;
    const r = new Reading({ deviceId, timestamp: timestamp ? new Date(timestamp) : Date.now(), tempC, distanceCm, status });
    await r.save();
    // broadcast to UI
    io.emit('new-reading', r);
    res.status(201).json({ success: true, id: r._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: get last N readings
app.get('/api/temps', async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const readings = await Reading.find().sort({ timestamp: -1 }).limit(limit);
  // Remove the .reverse() to keep newest first
  res.json(readings); // newest -> oldest
});

// API: DELETE a reading by ID
app.delete('/api/temps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reading.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ success: false, error: 'Reading not found' });
    }
    
    res.status(200).json({ success: true, message: 'Reading deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('UI connected', socket.id);
  socket.on('disconnect', () => console.log('UI disconnected', socket.id));
});

server.listen(PORT, '0.0.0.0', () => console.log(`Server listening on ${PORT} (all interfaces)`));
