import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import dishRoutes from "./routes/dish.route.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
app.use(express.json());

app.use("/api/dishes", dishRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(console.error);
