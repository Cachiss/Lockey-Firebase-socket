import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv"

//FIRESTORE FUNCTIONS
import { createUser, deleteUser, getUsers, listenerUsers, updateUser } from "./services/firebase_service.js";

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
  listenerUsers(async() => {
    const users = await getUsers();
    socket.emit("get_users", users);
  })

  console.log("a user connected");
  //list all users from firestore
  getUsers().then((users) => socket.emit("get_users", users));

  //list all users from firebase auth
  listAllUsersAuth().then((users) => socket.emit("get_users_auth", users));

  socket.on("create_user", async(data) => {
    await createUser(data);
  });
  socket.on("edit_user", async (data) => {
    console.log("edit_user", data);
    await updateUser(data.id, data);
  });

  socket.on("delete_user", async(id) => {
    console.log("delete_user", id);
    await deleteUser(id);
  });

  socket.on("test", (data) =>{
    console.log(data)
    //socket.emit("test", "mensaje enviado desde el backend")
    //para que no se envie 2 veces el mensaje se usa broadcast
    socket.emit("test", "mensaje enviado desde el backend")
  })
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
