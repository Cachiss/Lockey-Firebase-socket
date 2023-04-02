import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv"

//FIRESTORE FUNCTIONS
import { getUsers } from "./services/firebase_service.js";

//FIREBASE ADMIN FUNCTIONS
import { listAllUsersAuth } from "./services/firebase_admin.js";

const PORT = process.env.PORT || 3000;
const app = express();

dotenv.config();
app.use(cors({ origin: "http://localhost:5173" }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  //list all users from firestore
  getUsers().then((users) => socket.emit("get_users", users));

  //list all users from firebase auth
  listAllUsersAuth().then((users) => socket.emit("get_users_auth", users));

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
