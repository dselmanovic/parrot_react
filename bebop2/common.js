export default {
  createFrame: function(buff, frameType, bufferId) {
    let frame = new Buffer(7);
    frame.writeUInt8(frameType, 0);
    frame.writeUInt8(bufferId, 1);
    frame.writeUInt8(0, 2); //Sequence number is always set to 0 as it will be set before sending
    frame.writeUInt32LE(buff.length + 7, 3);
    return Buffer.concat([frame, buff]);
  }
};
