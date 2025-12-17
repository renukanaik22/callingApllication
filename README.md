# WebRTC Video Call Application

A real-time peer-to-peer video calling application built with React, Node.js, Socket.io, and WebRTC.

## Features

✅ Create and join video call rooms  
✅ Real-time video and audio streaming  
✅ Mute/unmute microphone  
✅ Turn video on/off  
✅ Copy room ID to clipboard  
✅ Connection status indicator  
✅ Responsive design  
✅ End call functionality  
✅ CI/CD pipeline with GitHub Actions  

## Tech Stack

**Frontend:**
- React 18
- Vite
- Socket.io Client
- WebRTC API

**Backend:**
- Node.js
- Express
- Socket.io

**CI/CD:**
- GitHub Actions

## Architecture

### WebRTC Flow

1. **Room Creator (Initiator):**
   - Creates RTCPeerConnection
   - Adds local media tracks
   - Waits for joiner
   - Receives offer and sends answer

2. **Room Joiner:**
   - Creates RTCPeerConnection
   - Adds local media tracks
   - Creates and sends offer
   - Receives answer

3. **ICE Candidate Exchange:**
   - Both peers exchange ICE candidates through signaling server
   - Candidates are added to peer connection

### Signaling Server Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `create-room` | Client → Server | Create a new room with unique ID |
| `room-created` | Server → Client | Room successfully created |
| `join-room` | Client → Server | Join existing room |
| `room-joined` | Server → Client | Successfully joined room |
| `user-joined` | Server → Client | Another user joined the room |
| `offer` | Client ↔ Server ↔ Client | WebRTC SDP offer exchange |
| `answer` | Client ↔ Server ↔ Client | WebRTC SDP answer exchange |
| `ice-candidate` | Client ↔ Server ↔ Client | ICE candidate exchange |
| `user-disconnected` | Server → Client | Peer disconnected |
| `room-not-found` | Server → Client | Room doesn't exist |
| `room-full` | Server → Client | Room already has 2 participants |

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebRTC support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd callingApplication
```

2. Install dependencies:
```bash
npm run install:all
```

Or install manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Running Locally

### Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3001`

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm run dev
```

Application runs on `http://localhost:3000`

### Using the Application

1. Open `http://localhost:3000` in your browser
2. Click **Create Room** to start a new call
3. Copy the Room ID displayed
4. Share the Room ID with another person
5. They open the app and click **Join Room**, enter the Room ID
6. Allow camera and microphone permissions when prompted
7. Start your video call!

### Controls

- 🎤 **Mute/Unmute** - Toggle microphone
- 📷 **Video On/Off** - Toggle camera
- 📞 **End Call** - Leave the room and return to home

## CI/CD Pipeline

### GitHub Actions Workflow

The pipeline automatically runs on:
- Push to `master` branch
- Pull requests to `master` branch

### Pipeline Steps

1. **Build and Test Job:**
   - Checkout code
   - Setup Node.js 18
   - Install dependencies for frontend and backend
   - Run tests
   - Build React application
   - Upload build artifacts

2. **Deploy Job (Optional):**
   - Downloads build artifacts
   - Ready for deployment to Vercel/Netlify

Test the build process:

```bash
npm test
npm run build:frontend
```

## Project Structure

```
callingApplication/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   ├── VideoCallPage.jsx
│   │   │   └── VideoCallPage.css
│   │   ├── SignalingServer.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── package.json
└── README.md
```

## Error Handling

The application handles:
- Camera/microphone permission denials
- Network connection failures
- Peer disconnection scenarios
- Invalid room IDs
- Full rooms (max 2 participants)

## Browser Compatibility

Requires a modern browser with WebRTC support:
- Chrome 56+
- Firefox 44+
- Safari 11+

## Security Considerations

- Uses STUN server for NAT traversal
- Peer-to-peer connection for media streaming
- No media data stored on server
- Room IDs are randomly generated

## Troubleshooting

**Camera/Microphone not working:**
- Check browser permissions
- Ensure HTTPS or localhost
- Try different browser

**Connection fails:**
- Check if both users are on the same network or use TURN server for production
- Verify signaling server is running
- Check firewall settings

**Build fails:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)


