// ws.js
import { io } from "socket.io-client";
 
 
const SOCKET_URL = 'http://192.168.1.103:3000' 

const socket = io(SOCKET_URL, {
  transports: ["websocket"],  
  withCredentials: true,
});

const connectWS = () => {
  console.log("🔌 Connecting to Socket.IO...");
  return socket;
};

export default connectWS;
