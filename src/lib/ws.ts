import WebSocket = require("ws");
import * as request from "request-promise";
import { WS_SEND_MESSAGE } from "./../types/ws";

let SERVER_URL = "";
let _client: WebSocket;
const headers = { "content-type": "application/json" };


const getMessages = async (
  userId: string = "",
  adminId: string = ""
) => {
  try {
    const optinons = {
      method: "POST",
      headers,
      url: `${SERVER_URL}/chat/getUserMessages`,
      body: {
        adminId,
        userId
      },
      json: true
    };
    const result = await request(optinons);
    const { messages = [], status = "" } = result;
    _client.send(JSON.stringify({ status, messages, type: "get" }));

    console.log(`* WS -> Get messages for ${userId} status: ${status}`);
  } catch (err) {
    console.log("* WS -> ERROR", err);
  }
};

export const sendMessage = async (data: WS_SEND_MESSAGE) => {
  try {
    const optinons = {
      method: "POST",
      headers,
      url: `${SERVER_URL}/chat/sendMessage`,
      body: {
        ...data
      },
      json: true
    };
    const result = await request(optinons);
    const { messages = [], status = "" } = result;
    _client.send(JSON.stringify({ status, messages, type: "send" }));
    console.log(`* WS -> Send message  for ${data.userId}  status: ${status}`);
  } catch (err) {
    console.log("* WS sendMessage -> ERROR", err);
  }
};

export const setServerURL = (url: string) => {
  SERVER_URL = url;
};

export const initialSocket = (socket: WebSocket.Server) => {
  socket.on("connection", ws => {
    ws.on("message", (message: string) => {
      socket.clients.forEach(client => {
        _client = client;
        const { type, userId, adminId, data } = JSON.parse(message);

        if (userId && adminId) {
          if (type === "initial" && userId && adminId) {
            getMessages(userId, adminId);
          } else if (type === "message") {
            console.log(data)
            sendMessage(data);
          }
        } else {
          console.log("ERROR: userId or adminId are not valid");
          client.send(JSON.stringify([]));
        }
      });
    });
  });
};
