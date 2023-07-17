import dotenv from "dotenv";
import express, { Request, Response } from "express";
import * as http from "http";
import * as crypto from "node:crypto";
import * as WebSocket from "ws";

dotenv.config();

const app = express();
const port = process.env.PORT;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Map();
wss.on("connection", (ws: WebSocket) => {
  const id = crypto.randomUUID();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };
  clients.set(ws, metadata);
  //connection is up, let's add a simple simple event
  ws.on("message", (message: any) => {
    const newData = JSON.parse(message);
    const metadata = clients.get(ws);

    newData.sender = metadata.id;
    newData.color = metadata.color;
    //log the received message and send it back to the client
    console.log("received: %s", newData);
    ws.send(`Hello, you sent -> ${JSON.stringify(newData)}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.listen(process.env.PORTWS || 8999, () => {
  console.log(`Server started on port ${server.address() || 8999} :)`);
});
