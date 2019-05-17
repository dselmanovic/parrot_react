import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
const { height, width } = Dimensions.get("window");
import DropdownAlert from 'react-native-dropdownalert';

import { connect, sendCommand } from "./bebop2";
import { command as cmd } from "./bebop2/command";
export default class Home extends React.Component {
  static navigationOptions = {
    title: "Home"
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            marginTop: 40
          }}
        >
          Drone controller
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            connect(
              function() {
                Alert.alert('Success', 'Drone connected');
                console.log("Drone connected");
              },
              function(errData) {
                Alert.alert('Error', 'Drone not connected');
                console.log("Drone not connected", errData);
              }
            );
          }}
        >
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sendCommand(cmd.takeOff(), message => {
              console.log("TAKE OFF 2", message);
              this.dropdown.alertWithType('success', 'Info', 'Taking off');
            });
          }}
        >
          <Text style={styles.buttonText}>Take off</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            sendCommand(cmd.land(), message => {
              console.log("LAND", message);
              this.dropdown.alertWithType('success', 'Info', 'Landing');
            });
          }}
        >
          <Text style={styles.buttonText}>Land</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate("Magic");
          }}
        >
          <Text style={styles.buttonText}>Magic</Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        />
        <DropdownAlert ref={ref => this.dropdown = ref} closeInterval={1000} />
      </View>
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
    width: width * 0.7,
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
