import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import messageRouter from './router/messageRouter.js';
import cookieParser from 'cookie-parser';
import http from 'http';

import { initSocket } from './socket.js';

dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"https://saldapaldwde.netlify.app",
  credentials: true,
}));

// Define API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/messages", messageRouter);

const server = http.createServer(app);

// Initialize Socket.io server with HTTP server
initSocket(server);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
