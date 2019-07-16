import WebSocket = require("ws");
import * as request from "request";
import { WS_SEND_MESSAGE } from "./../types/ws";

let SERVER_URL = "";
const headers = { "content-type": "application/json" };

const getMessages = (
  client: WebSocket,
  userId: string = "",
  adminId: string = ""
) => {
  request.post(
    {
      headers,
      url: `${SERVER_URL}/chat/getUserMessages`,
      body: JSON.stringify({ adminId, userId })
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log("ERROR", err);
      }

      const { messages = [], status = "" } = JSON.parse(body);
      console.log(`Get messages for ${userId} status: ${status}`);

      client.send(JSON.stringify({ status, messages, type: "get" }));
    }
  );
};

const sendMessage = (client: WebSocket, data: WS_SEND_MESSAGE) => {
  request.post(
    {
      headers,
      url: `${SERVER_URL}/chat/sendMessage`,
      body: JSON.stringify(data)
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log("ERROR", err);
      }

      const { messages = [], status = "" } = JSON.parse(body);
      console.log(`Send message  for ${data.userId}  status: ${status}`);
      client.send(JSON.stringify({ status, messages, type: "send" }));
    }
  );
};

export const setServerURL = (url: string) => {
  SERVER_URL = url;
};

export const initialSocket = (socket: WebSocket.Server) => {
  socket.on("connection", ws => {
    ws.on("message", (message: string) => {
      socket.clients.forEach(client => {
        const { type, userId, adminId, data } = JSON.parse(message);

        if (userId && adminId) {
          if (type === "initial" && userId && adminId) {
            getMessages(client, userId, adminId);
          } else if (type === "message") {
            sendMessage(client, data);
          }
        } else {
          console.log("ERROR: userId or adminId are not valid");
          client.send(JSON.stringify([]));
        }
      });
    });
  });
};
