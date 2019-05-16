import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";

const { height, width } = Dimensions.get("window");
import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType
} from "react-native-sensors";
import throttle from "lodash-es/throttle";
import { command as cmd } from "./bebop2/command";

const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
);

const PITCH = 100;
const DURATION = 500;
export default class Magic extends Component {
  static navigationOptions = {
    title: "Magic"
  };

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      lastX: 0,
      lastY: 0,
      lastZ: 0,
      noise: 2.0,
      initialized: false,
      isReading: false
    };
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    this.goForwardOnMove = throttle(this.goForwardOnMove.bind(this), 3000);
    this.goBackOnMove = throttle(this.goBackOnMove.bind(this), 3000);
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
  }

  subscribeHandler = ({ x, y, z, timestamp }) => {
    const { lastY } = this.state;
    if (Platform.OS === "android") {
      if (parseInt(y) > 4) {
        if (Math.abs(parseInt(lastY) - parseInt(y)) > 2) {
          this.goForwardOnMove();
        }
      }
      if (parseInt(y) < 3) {
        if (Math.abs(parseInt(lastY) - parseInt(y)) > 2) {
          this.goBackOnMove();
        }
      }
    }
    if (Platform.OS === "ios") {
        if (y > lastY) {
          if (Math.abs(lastY - y) > 0.3) {
            Alert.alert("Back", "Going down");
            this.goBackOnMove();
          }
        }
        if (y < lastY) {
          if (Math.abs(lastY - y) > 0.3) {
            Alert.alert("Forward", "Going forward");
            this.goBackOnMove();
          }
        }
    }
    this.setState({ x, y, z, lastX: x, lastY: y, lastZ: z });
  };

  handleSensorReading = () => {
    const { isReading } = this.state;
    if (!isReading) {
      const subscription = accelerometer.subscribe(this.subscribeHandler);
      this.setState({ subscription, isReading: true });
    } else {
      this.state.subscription.unsubscribe();
      this.setState({ subscription: null, isReading: false });
    }
  };

  goForwardOnMove() {
    console.log("Going forward");
    cmd.forward(PITCH);
    setTimeout(() => {
      console.log("Stopping");
      cmd.stop();
    }, DURATION);
  }

  goBackOnMove() {
    console.log("Going back");
    cmd.back(PITCH);
    setTimeout(() => {
      console.log("Stopping");
      cmd.stop();
    }, DURATION);
  }

  render() {
    const { isReading } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              marginTop: 30
            }}
          >
            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.3,
                alignSelf: "center"
              }}
              onPress={() => {
                console.log("Going up");
                cmd.up(PITCH);
                setTimeout(() => {
                  console.log("Stopping");
                  cmd.stop();
                }, DURATION);
              }}
            >
              <Text style={styles.buttonText}>Up</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log("Going left");
                  cmd.left(PITCH);
                  setTimeout(() => {
                    console.log("Stopping");
                    cmd.stop();
                  }, DURATION);
                }}
              >
                <Text style={styles.buttonText}>Left</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 80
                }}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log("Going right");
                  cmd.right(PITCH);
                  setTimeout(() => {
                    console.log("Stopping");
                    cmd.stop();
                  }, DURATION);
                }}
              >
                <Text style={styles.buttonText}>Right</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                ...styles.button,
                width: width * 0.3,
                alignSelf: "center"
              }}
              onPress={() => {
                console.log("Going down");
                cmd.down(PITCH);
                setTimeout(() => {
                  console.log("Stopping");
                  cmd.stop();
                }, DURATION);
              }}
            >
              <Text style={styles.buttonText}>Down</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 10,
              marginBottom: 10
            }}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("Going forward");
                cmd.forward(PITCH);
                setTimeout(() => {
                  console.log("Stopping");
                  cmd.stop();
                }, DURATION);
              }}
            >
              <Text style={styles.buttonText}>Forward</Text>
            </TouchableOpacity>
            <View
              style={{
                width: 80
              }}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log("Going back");
                cmd.back(PITCH);
                setTimeout(() => {
                  console.log("Stopping");
                  cmd.stop();
                }, DURATION);
              }}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{ ...styles.button, width: "100%" }}
            onPress={() => {
              this.handleSensorReading();
            }}
          >
            <Text style={styles.buttonText}>
              {isReading ? "Stop reading" : "Start reading"}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 30
            }}
          >
            <Value name="x" value={this.state.x} />
            <Value name="y" value={this.state.y} />
            <Value name="z" value={this.state.z} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  button: {
    width: width * 0.3,
    height: width * 0.2,
    backgroundColor: "red",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 90
  },
  buttonText: {
    color: "white"
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  }
});
