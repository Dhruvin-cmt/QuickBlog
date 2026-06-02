import { io } from "socket.io-client";

export const socket = io("https://quickblog-nqxv.onrender.com", {
  autoConnect: false,
});
