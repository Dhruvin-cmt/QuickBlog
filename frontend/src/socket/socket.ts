import { io } from "socket.io-client";

export const socket = io("http://65.0.95.204", {
  autoConnect: false,
});
