import express = require("express");
import * as request from "request";

let _SERVER_URL: string;
const router = express.Router();
const headers = { "content-type": "application/json" };

router.post("/", function(req, res) {
  const { adminId } = req.body;

  request.post(
    {
      headers,
      url: `${_SERVER_URL}/auth/check`,
      body: JSON.stringify({ adminId })
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log("ERROR", err);
      }

      res.send(body);
    }
  );
});

module.exports = (SERVER_URL: string) => {
  _SERVER_URL = SERVER_URL;
  return router;
};
