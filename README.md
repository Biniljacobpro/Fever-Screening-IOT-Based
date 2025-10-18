# Contactless Fever Screening System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-red)](https://www.mongodb.com/cloud/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-orange)](https://socket.io/)

A comprehensive IoT-based contactless fever screening solution that combines ESP32 sensor technology with a real-time web dashboard for monitoring body temperature readings.

## 🌡️ Overview

This system provides an end-to-end contactless fever screening solution composed of:
- **ESP32 Sensor Node**: Measures body temperature via infrared sensor and detects presence
- **Node.js Backend**: REST API with real-time WebSocket communication
- **Web Dashboard**: Interactive interface for monitoring temperature readings and trends

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP POST    ┌──────────────────┐    WebSocket    ┌──────────────────┐
│   ESP32 Node    │ ──────────────▶ │  Node.js Server  │ ◀──────────────▶ │   Web Dashboard  │
│                 │                 │                  │                 │                  │
│ • MLX90614 IR   │                 │ • Express API    │                 │ • Real-time UI   │
│   Temperature   │                 │ • MongoDB Storage│                 │ • Chart.js       │
│ • Ultrasonic    │                 │ • Socket.IO      │                 │ • Live Updates   │
│   Distance      │                 │   Broadcasting   │                 │ • Data Filtering │
│ • LED/Buzzer    │                 │ • REST Endpoints │                 │ • Statistics     │
└─────────────────┘                 └──────────────────┘                 └──────────────────┘
```

## 🚀 Features

- **Real-time Monitoring**: Live temperature readings with WebSocket updates
- **Interactive Dashboard**: Modern UI with temperature trends and statistics
- **Data Visualization**: Chart.js graphs showing temperature patterns
- **Status Indication**: Visual alerts for normal vs. elevated temperatures
- **Data Filtering**: Filter readings by status (All, Normal, Fever)
- **Record Management**: Delete individual temperature records
- **Responsive Design**: Works on desktop and mobile devices

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.IO
- **Utilities**: dotenv, cors, body-parser

### Frontend
- **Core**: HTML5, CSS3, Vanilla JavaScript
- **UI Library**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

### Hardware
- **Microcontroller**: ESP32
- **Sensors**: 
  - MLX90614 Infrared Thermometer
  - Ultrasonic Distance Sensor
- **Indicators**: LEDs and Buzzer

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- ESP32 development board with sensors

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd fever-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI
```

4. Start the server:
```bash
npm start
# Server runs on http://localhost:3000 by default
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/feverdb
PORT=3000
```

## 📡 API Endpoints

### POST `/api/temps`
Submit a new temperature reading

**Request Body:**
```json
{
  "deviceId": "ESP32-FEVER-1",
  "tempC": 36.8,
  "distanceCm": 15,
  "status": "normal"
}
```

**Response:**
```json
{
  "success": true,
  "id": "68edca85f747e72d26e89ab2"
}
```

### GET `/api/temps`
Retrieve temperature readings

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 100)

**Response:**
```json
[
  {
    "_id": "68edca85f747e72d26e89ab2",
    "deviceId": "ESP32-FEVER-1",
    "timestamp": "2025-10-14T03:59:01.643Z",
    "tempC": 36.8,
    "distanceCm": 15,
    "status": "normal"
  }
]
```

### DELETE `/api/temps/:id`
Delete a specific temperature reading

**Response:**
```json
{
  "success": true,
  "message": "Reading deleted successfully"
}
```

## 🔌 Socket.IO Events

### Server → Client
- `new-reading`: Emitted when a new temperature reading is received
  ```javascript
  socket.on('new-reading', (reading) => {
    // Handle new reading
  });
  ```

## 🎛️ Dashboard Features

### Real-time Updates
- Live temperature readings displayed as they arrive
- Automatic refresh every 6 seconds
- Visual notifications for new readings

### Data Visualization
- **Temperature Trend Chart**: Line chart showing temperature history
- **Reading Distribution**: Doughnut chart showing normal vs. fever readings
- **Summary Cards**: Key metrics including total readings, fever alerts, and average temperature

### Interactive Controls
- **Status Filtering**: Filter records by All, Normal, or Fever status
- **Record Deletion**: Delete individual temperature records with confirmation
- **Manual Refresh**: Force data refresh at any time

## 📊 Data Model

```javascript
const ReadingSchema = new mongoose.Schema({
  deviceId: String,
  timestamp: { type: Date, default: Date.now },
  tempC: Number,
  distanceCm: Number,
  status: String // 'normal' or 'fever'
});
```

## 🔧 ESP32 Firmware

The ESP32 firmware includes:
- Wi-Fi connectivity with retry logic
- MLX90614 temperature sensing
- Ultrasonic distance measurement
- LED and buzzer status indicators
- HTTP POST to backend API

### Key Components
- **Temperature Threshold**: 37.0°C for fever detection
- **Proximity Detection**: Waits for subject within 20cm for 4 seconds
- **Local Alerts**: 
  - Green LED + short beeps for normal readings
  - Red LED + continuous buzzer for fever readings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped develop this system
- Special recognition for the open-source libraries and tools that made this project possible
- Inspired by the need for contactless health screening solutions

## 📞 Support

For support, please open an issue on the GitHub repository or contact the maintainers.