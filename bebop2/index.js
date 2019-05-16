import "../shim";

let net = require("react-native-tcp");
let dgram = require("react-native-udp");
let client = dgram.createSocket("udp4");
let server = dgram.createSocket("udp4");

let tcp_client = new net.Socket();
import config from "./config";
let SequenceCount = [];
let clientPort = 54321;
let serverPort = config.drone.udpServerPort;

import { command as cmd } from "./command";
import { Message } from "./message";

export const connect = (onConnect, onError) => {
  let host = config.drone.host;
  let port = config.drone.port;

  server.on("message", function(msg, rinfo) {
    var decoded = new Message(msg);
    var response = decoded.generateResponse();
    if (response) {
      sendCommand(response);
    }
  });

  server.on("listening", function() {
    //var address = server.address();
    //console.log('Listening to drone', address);
  });

  server.on("error", function(error) {
    onError(error);
  });

  tcp_client.on("error", function(error) {
    onError(error);
  });

  tcp_client.on("data", function(data) {
    if (data.length > 0) {
      let strData = data.toString().substr(0, data.length - 1);
      let jsonData = JSON.parse(strData);
      console.log(jsonData);
      if (jsonData.status === 0) {
        if (jsonData.c2d_port) clientPort = jsonData.c2d_port;
        server.bind(serverPort);

        sendCommand(cmd.generateAllStates());
        sendCommand(cmd.flatTrim());

        // send pcmd values at 40hz
        setInterval(function() {
          sendCommand(cmd.generatePCMD());
        }, 25);

        tcp_client.end();
        if (onConnect) onConnect();
      }
    }
  });

  tcp_client.on("close", function() {
    console.log("SOCKET CLOSED");
  });

  tcp_client.connect(
    port,
    host,
    function() {
      console.log("Connecting drone...");
      let strMessage = JSON.stringify(config.commands.discover);
      tcp_client.write(strMessage);
    }
  );
};

export const sendCommand = (message, callback) => {
  let id = message[1];
  if (!SequenceCount[id]) {
    SequenceCount[id] = 0;
  }
  SequenceCount[id]++;
  if (SequenceCount[id] > 255) {
    SequenceCount[id] = 0;
  }
  message.writeUInt8(SequenceCount[id], 2); //Set sequence number for the FrameType
  client.send(
    message,
    0,
    message.length,
    clientPort,
    config.drone.host,
    function(err, bytes) {
      if (err) {
        console.log("ERROR SENDING", message);
      }
      if (callback) callback(message);
    }
  );
};
