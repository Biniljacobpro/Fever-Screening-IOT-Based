# Project Overview: Contactless Fever Screening System

## Summary
This project delivers an end-to-end contactless fever screening solution composed of an ESP32-based sensor node and a Node.js/Express backend with a real-time web dashboard. The ESP32 measures body temperature via an MLX90614 infrared sensor, detects presence with an ultrasonic rangefinder, and signals status through LEDs and a buzzer. Readings are posted to the backend API, stored in MongoDB, and pushed out over WebSockets to an interactive dashboard for monitoring.

## System Architecture
1. **ESP32 Sensor Node**
   - MLX90614 infrared thermometer for body temperature.
   - Ultrasonic distance sensor for proximity detection.
   - LEDs and buzzer to indicate fever/normal status locally.
   - Wi-Fi connectivity; posts JSON readings to the server via HTTP.
   - Automatic retries if Wi-Fi disconnects.

2. **Backend Server (Node.js/Express)**
   - REST endpoint `/api/temps` for posting readings (POST) and retrieving recent history (GET).
   - Socket.IO broadcasts (`new-reading` events) for real-time dashboard updates.
   - MongoDB storage via Mongoose, persisting each reading.
   - Serves static frontend assets from `public/`.

3. **Frontend Dashboard (`public/index.html`)**
   - Displays metrics: total readings, fever count, average temperature, last update.
   - Interactive Chart.js line chart for temperature trends.
   - Live-updating table (without distance column) showing time, device, temperature, and status.
   - Auto-refresh logic with manual refresh/clear controls.

## Key Workflows
1. **Data Capture**
   - ESP32 waits for subject within 20 cm for 4 seconds to ensure stable reading.
   - Temperature sampled; fever threshold at 37.0 °C decides status.
   - Local alert: red LED with continuous buzzer for fever, green LED with short beeps for normal.

2. **Data Transmission**
   - POST request body example:
     ```json
     {
       "deviceId": "ESP32-FEVER-1",
       "tempC": 36.8,
       "distanceCm": 15,
       "status": "normal"
     }
     ```
   - Includes debug logging of Wi-Fi state for diagnostics.
   - Uses ArduinoJson and HTTPClient libraries.

3. **Backend Processing**
   - Validates payload, converts `timestamp` to `Date` if provided, otherwise uses `Date.now()`.
   - Persists document `{ deviceId, timestamp, tempC, distanceCm, status }` in MongoDB collection `readings`.
   - Emits `new-reading` event to all connected Socket.IO clients for instant UI updates.

4. **Frontend Rendering**
   - On load, fetches `/api/temps?limit=100` and populates summary cards, chart, and table.
   - Listens to `new-reading` events, prepending the latest record and refreshing stats.
   - Distance column removed; table columns now: Time, Device, Temperature, Status.

## Tech Stack
- **Firmware**: Arduino IDE, ESP32 board, MLX90614, ultrasonic sensor, LEDs, buzzer.
- **Backend**: Node.js 18+, Express 4, Socket.IO 4, Mongoose 7, MongoDB Atlas (connection string in `.env`).
- **Frontend**: HTML5, CSS3 (custom styling with glassmorphism aesthetic), JavaScript (vanilla), Chart.js.
- **Tooling**: dotenv for configuration, body-parser for JSON parsing, cors for cross-origin requests.

## Configuration & Deployment
1. **Environment Variables (`.env`)**
   - `MONGODB_URI` required (example uses MongoDB Atlas cluster).

2. **Setup Steps**
   1. Install dependencies: `npm install`.
   2. Start server: `npm start` (listens on `PORT` env or 3000 by default).
   3. Access dashboard at `http://<server-ip>:3000/`.
   4. Flash ESP32 with provided sketch (`ESP32_feversensor_post.ino`), updating Wi-Fi credentials and `SERVER_URL` if necessary.

3. **Network Considerations**
   - Ensure ESP32 and server share network or adjust routing for public endpoints.
   - `SERVER_URL` should resolve from ESP32 (e.g., `http://192.168.x.x:3000/api/temps`).

## Data Model (`models/Reading.js`)
```javascript
const ReadingSchema = new mongoose.Schema({
  deviceId: String,
  timestamp: { type: Date, default: Date.now },
  tempC: Number,
  distanceCm: Number,
  status: String
});
```

## REST API
1. **POST `/api/temps`**
   - Body: JSON (see example above)
   - Response: `{ success: true, id: "<document-id>" }`
   - Emits Socket.IO event `new-reading` with the saved reading.

2. **GET `/api/temps?limit=<n>`**
   - Returns array of up to `n` readings sorted from oldest to newest.

## Socket.IO Events
- **Server → Client**
  - `new-reading`: emitted after successful POST, payload is the saved reading document.

- **Client → Server**
  - None currently defined (read-only dashboard).

## Frontend Highlights
- Uses Font Awesome icons and Google Fonts (Poppins).
- Auto-refresh indicator shows update cadence (6s as per UI text).
- Error modal displayed on fetch issues with retry capabilities.
- Animations for table rows and card updates.

## Firmware Details (ESP32 Sketch)
- Wi-Fi retry logic (20-second initial attempt; 10-second reconnect in `postReading`).
- Distance measurement using `pulseIn` with 30 ms timeout.
- Buzzer control: active buzzer (LOW = ON), with different patterns for fever vs normal.
- Debug printouts for IP, Wi-Fi status, and server URL when posting data.
- Posts `tempC`, `distanceCm`, and `status`; `timestamp` is omitted to rely on server time.

## Known Adjustments
- Frontend table hides the distance column per requirement.
- `.env` stores sensitive connection string; avoid committing it to public repos.
- Server currently allows open CORS (`origin: "*"`); restrict if exposing publicly.

## Next Steps & Enhancements
- Add authentication for API endpoints.
- Implement rate limiting or validation to prevent malicious data.
- Introduce multi-device support with filtering on the dashboard.
- Persist and visualize distance data elsewhere if needed for analytics.
- Package the Arduino sketch with PlatformIO for reproducible builds.

---
Use this document to supply AI assistants with the critical architecture, components, and workflows of the Contactless Fever Screening System.