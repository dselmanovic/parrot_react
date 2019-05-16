export default {
  verbose: true,
  drone: {
    host: "192.168.42.1",
    port: 44444,
    udpServerPort: 43210
  },
  commands: {
    discover: {
      controller_type: "computer",
      controller_name: "parrotterm",
      d2c_port: "43210",
      arstream2_client_stream_port: 55004,
      arstream2_client_control_port: 55005
    }
  }
};
