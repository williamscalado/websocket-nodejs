import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const dataWord: any = ["luz", "dados"];
function teste(text: string) {
  dataWord.push(text);
  console.log(dataWord);
}

io.on("connection", (socket) => {
  socket.on("hello", (arg) => {
    teste(arg);
    socket.emit("data", dataWord);
  });
  socket.emit("data", dataWord);
  console.log("dados", dataWord);
  console.log("cliente connect", socket.id);
});

httpServer.listen(process.env.PORTWS);
