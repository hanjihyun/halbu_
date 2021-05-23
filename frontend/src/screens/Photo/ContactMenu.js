import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  TextInput,
  SafeAreaView,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
export default class ContactMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.image}>
        <View style={styles.image2}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("");
            }}
          >
            <Image
              style={styles.btn}
              source={require("../../../assets/setting.png")}
            />
            <Text
              style={{
                fontFamily: "Binggrae-Bold",
                fontSize: 28,
                color: "#BCA4D7",
                textAlign: "center",
              }}
            >
              설정
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Photo");
            }}
          >
            <Image
              style={styles.btn}
              source={require("../../../assets/follower.png")}
            ></Image>
            <Text
              style={{
                fontFamily: "Binggrae-Bold",
                fontSize: 28,
                color: "#BCA4D7",
                textAlign: "center",
              }}
            >
              연락처 등록
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  image2: {
    marginVertical: height * 0.3,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  btn: {
    padding: 80,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
    borderColor: "#9B85CB",
    backgroundColor: "#EFE8F1",
    marginHorizontal: 15,
  },
});
