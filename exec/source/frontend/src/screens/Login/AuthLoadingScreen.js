import React from "react";
import { View, StatusBar, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // 인증 정보 가져오기
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("userData");
    // console.log(userToken + "==========userToken");
    try {
      const userInfo = await GoogleSignin.signInSilently();
      if (userInfo !== null) {
        this.props.navigation.navigate("Home");
      }
    } catch (error) {
      console.log("hihi222222222222222");
      this.props.navigation.navigate("Login");
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        console.log(" user has not signed in yet");
      } else {
        // some other error
        console.log(" some other error");
      }
    }
  };
  render() {
    return <View></View>;
  }
}
