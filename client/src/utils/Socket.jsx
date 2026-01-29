import { io } from "socket.io-client";

// Replace with your Flask Server URL
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket"], // Forces WebSocket mode for better performance
});

const gameSocket = io(`${SOCKET_URL}/game`, {
    autoConnect: true,
    transports: ["websocket"], // Forces WebSocket mode for better performance
});

export { socket, gameSocket };