import Constants from "./constants";
import Common from "./common";

export function Message(buff) {
  var $this = this;
  this.frameType = buff[0];
  this.bufferId = buff[1];
  this.sequence = buff[2];
  this.size = littleEndian(buff.slice(3, 7));
  if (this.size > 0) this.data = buff.slice(7);

  this.generateResponse = function() {
    //PING
    if (
      $this.frameType === Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA &&
      $this.bufferId ===
        Constants.BufferId.ARNETWORK_MANAGER_INTERNAL_BUFFER_ID_PING
    ) {
      return Common.createFrame(
        $this.data,
        Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA,
        Constants.FrameId.BD_NET_CD_NONACK_ID
      );
    }

    //ACK Data
    if (
      $this.frameType ===
      Constants.FrameType.ARNETWORKAL_FRAME_TYPE_DATA_WITH_ACK
    ) {
      var frame = new Buffer(1);
      frame.writeUInt8($this.sequence, 0);
      var id = $this.bufferId + 128;
      return Common.createFrame(
        frame,
        Constants.FrameType.ARNETWORKAL_FRAME_TYPE_ACK,
        id
      );
    }

    return null;
  };

  return this;
}

function littleEndian(buff) {
  let retVal = 0;
  for (let i = buff.length - 1; i >= buff.length - 4; i--) {
    retVal = retVal * 256 + buff[i];
  }
  return retVal;
}
