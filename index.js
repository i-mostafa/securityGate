var log4js = require("log4js");

const express = require("express");
const path = require("path");
const { SerialPort } = require("serialport");
const { readFileSync } = require("fs");
const app = express();
const authList = readFileSync(path.join(__dirname, "authList.txt"))
  .toString()
  .replace(/\r/g, "")
  .split("\n")
  .filter(Boolean);

log4js.configure({
  appenders: { securityGate: { type: "file", filename: "securityGate.log" } },
  categories: { default: { appenders: ["securityGate"], level: "debug" } },
});

const logger = log4js.getLogger("securityGate");

const arduinoCOMPort = "COM7";
const arduinoSerialPort = new SerialPort({
  path: arduinoCOMPort,
  baudRate: 9600,
});

arduinoSerialPort.on("open", function () {
  console.log("Serial Port " + arduinoCOMPort + " is opened.");
});
arduinoSerialPort.on("readable", function () {
  const data = arduinoSerialPort.read();
  console.log("serial", data.toString());
});

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());
// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/api/qr", (req, res) => {
  const { qr } = req.body;
  console.log(qr);
  if (qr && authList.includes(qr)) {
    logger.debug(`${qr} is authorized at ${new Date().toLocaleString()}`);
    arduinoSerialPort.write("o");
  } else if (qr) {
    logger.debug(`${qr} is not authorized at ${new Date().toLocaleString()}`);
    arduinoSerialPort.write("c");
  }

  res.json({
    sleep: true,
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
