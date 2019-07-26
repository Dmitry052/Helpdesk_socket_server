import express = require("express");
import * as request from "request-promise";

let _SERVER_URL: string;
const router = express.Router();

router.post("/getusers", async function(req, res) {
  const { adminId } = req.body;

  if (adminId) {
    try {
      const optinons = {
        method: "POST",
        headers: { "content-type": "application/json" },
        uri: `${_SERVER_URL}/chat/getusers`,
        body: {
          userId: adminId
        },
        json: true
      };
      const result = await request(optinons);
      console.log(`* Get chat users for ${adminId} status: ${result.status}`);
      return res.send(result);
    } catch (err) {
      console.log(`* Get chat users for ${adminId} status: ${err}`);
      return res.send({ status: "ERROR", message: err.message });
    }
  }
  console.log(`* Get chat users for ${adminId} status: Invalid admin id`);
  return res.send({ status: "ERROR", message: "Invalid admin id" });
});

module.exports = (SERVER_URL: string) => {
  _SERVER_URL = SERVER_URL;
  return router;
};
