import Constants from "./constants";
import Common from "./common";
let PCMD = {
  flag: 0,
  roll: 0,
  pitch: 0,
  yaw: 0,
  gaz: 0,
  psi: 0
};

export function validatePitch(val) {
  if (val > 100) {
    return 100;
  } else if (val < 0) {
    return 0;
  }

  return val | 0;
}

export const command = {
  takeOff: function() {
    var buff = new Buffer(4);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_PILOTING, 1);
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_PILOTING_CMD_TAKEOFF,
      2
    );
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  },

  land: function() {
    var buff = new Buffer(4);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_PILOTING, 1);
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_PILOTING_CMD_LANDING,
      2
    );
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  },

  clockwise: function(val) {
    PCMD.yaw = validatePitch(val);
    PCMD.flag = 1;
  },

  counterclockwise: function(val) {
    PCMD.yaw = validatePitch(val) * -1;
    PCMD.flag = 1;
  },

  forward: function(val) {
    PCMD.pitch = validatePitch(val);
    PCMD.flag = 1;
  },

  back: function(val) {
    PCMD.pitch = validatePitch(val) * -1;
    PCMD.flag = 1;
  },

  up: function(val) {
    PCMD.gaz = validatePitch(val);
    PCMD.flag = 1;
  },

  down: function(val) {
    PCMD.gaz = validatePitch(val) * -1;
    PCMD.flag = 1;
  },

  right: function(val) {
    PCMD.roll = validatePitch(val);
    PCMD.flag = 1;
  },

  left: function(val) {
    PCMD.roll = validatePitch(val) * -1;
    PCMD.flag = 1;
  },

  stop: function() {
    PCMD = {
      flag: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
      gaz: 0,
      psi: 0
    };
  },

  enableVideo: function() {
    var buff = new Buffer(5);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(
      Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_MEDIASTREAMING,
      1
    );
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_MEDIASTREAMING_CMD_VIDEOENABLE,
      2
    ); //0
    buff.writeUInt8(1, 4);
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  },

  disableVideo: function() {
    var buff = new Buffer(5);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(
      Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_MEDIASTREAMING,
      1
    ); //21
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_MEDIASTREAMING_CMD_VIDEOENABLE,
      2
    ); //0
    buff.writeUInt8(0, 4);
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    ); //1
  },

  videoStreamMode: function(mode) {
    var buff = new Buffer(5);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(
      Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_MEDIASTREAMING,
      1
    ); //21
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_MEDIASTREAMING_CMD_VIDEOSTREAMMODE,
      2
    ); //0
    buff.writeUInt8(mode, 4);
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    ); //1
  },

  generatePCMD: function() {
    var buff = new Buffer(13);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_PILOTING, 1);
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_PILOTING_CMD_PCMD,
      2
    );
    buff.writeUInt8(PCMD.flag || 0, 4);
    buff.writeInt8(PCMD.roll || 0, 5);
    buff.writeInt8(PCMD.pitch || 0, 6);
    buff.writeInt8(PCMD.yaw || 0, 7);
    buff.writeInt8(PCMD.gaz || 0, 8);
    buff.writeFloatLE(PCMD.psi || 0, 9);
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  },

  generateAllStates: function() {
    var buff = new Buffer(4);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_COMMON, 0);
    buff.writeUInt8(Constants.ClassId.ARCOMMANDS_ID_COMMON_CLASS_COMMON, 1);
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_COMMON_COMMON_CMD_ALLSTATES,
      2
    );
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  },

  flatTrim: function() {
    var buff = new Buffer(4);
    buff.writeUInt8(Constants.ProjectId.ARCOMMANDS_ID_PROJECT_ARDRONE3, 0);
    buff.writeUInt8(Constants.ClassId.ARCOMMANDS_ID_ARDRONE3_CLASS_PILOTING, 1);
    buff.writeUInt16LE(
      Constants.CmdId.ARCOMMANDS_ID_ARDRONE3_PILOTING_CMD_FLATTRIM,
      2
    );
    return Common.createFrame(
      buff,
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
      Constants.FrameId.BD_NET_CD_NONACK_ID
    );
  }
};
