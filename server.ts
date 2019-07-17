import express = require("express");
import WebSocket = require("ws");
import { setServerURL, initialSocket } from "./src/lib/ws";

const config = require("./config.json");
const SOCKET_PORT = process.env.SOCKET_PORT || config.socket_port;
const HOST_PORT = process.env.HOST_PORT || config.host_port;
const API_SERVER_DB = process.env.API_SERVER_DB || config.api_server_db;

const app: express.Application = express();
const socket = new WebSocket.Server({ port: SOCKET_PORT });

setServerURL(API_SERVER_DB);
initialSocket(socket);

app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(`/auth`, require("./src/routes/auth")(API_SERVER_DB));

app.listen(HOST_PORT, () => {
  console.log(`Server is started on port: ${HOST_PORT}`);
});
