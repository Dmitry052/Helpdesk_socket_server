import express = require("express");

const app: express.Application = express();
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3000 });

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

server.on("connection", async (ws: any) => {
  ws.on("message", async (message: string) => {
    server.clients.forEach(async (client: any) => {
      client.send("Hello world!");
    });
  });
});

app.use(`/auth`, require("./src/routes/auth")({}));

app.listen(80, () => {
  console.log("Server is started on port: 80");
});
