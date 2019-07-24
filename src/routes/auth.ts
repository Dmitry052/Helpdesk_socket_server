import express = require("express");
import * as request from "request-promise";

let _SERVER_URL: string;
const router = express.Router();

router.post("/", async function(req, res) {
  const { adminId } = req.body;

  if (adminId) {
    try {
      const optinons = {
        method: "POST",
        headers: { "content-type": "application/json" },
        uri: `${_SERVER_URL}/auth/check`,
        body: {
          adminId
        },
        json: true
      };
      const result = await request(optinons);
      console.log(`* Check user ${adminId} status: ${result.status}`);
      return res.send(result);
    } catch (err) {
      console.log(`* Check user ${adminId} status: ${err}`);
      return res.send({ status: "ERROR", message: err.message });
    }
  } 
  console.log(`* Check user ${adminId} status: Invalid admin id`);
  return res.send({ status: "ERROR", message: "Invalid admin id" });
});

module.exports = (SERVER_URL: string) => {
  _SERVER_URL = SERVER_URL;
  return router;
};
