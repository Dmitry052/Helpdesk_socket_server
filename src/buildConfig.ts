import fs = require("fs");
import path = require("path");

const devPath = path.resolve(__dirname, "./../../config/dev.json");
const prodPath = path.resolve(__dirname, "./../../config/prod.json");
const srcPath =
  process.env.ENV === "prod"
    ? path.resolve(__dirname, "./../../build/config.json")
    : path.resolve(__dirname, "./../../config.json");
const soursePath = process.env.ENV === "prod" ? prodPath : devPath;

fs.copyFile(soursePath, srcPath, err => {
  if (err) throw err;
  console.log(`${soursePath} was copied to ${srcPath}`);
});
