import React, { useState, useEffect } from "react";
import { View, Image, ImageBackground } from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import styles from "./styles";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "638193370790-grbc8mqqid406uota1dindk8j32k6amm.apps.googleusercontent.com",
  offlineAccess: true,
});

export default class LoginScreen extends React.Component {
  state = {
    userInfo: null,
    userId: "",
    accessToken: "",
    loggedIn: false,
  };
  constructor(props) {
    super(props);
  }

  // 인증 정보 저장
  _storeData = async (accessToken, email) => {
    try {
      // await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          accessToken: accessToken,
          userId: email,
        })
      );
      this.props.navigation.navigate("Home");
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    GoogleSignin.configure();
    // setInterval(() => {
    //   onGoogleButtonPress();
    // }, 2000);
  }

  onGoogleButtonPress = async () => {
    // const baseURL = "http://10.0.2.2:8085";
    const baseURL = "http://halbu.net";
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo" + userInfo);

      const idToken = await GoogleSignin.getTokens();

      this.setState({
        userInfo: userInfo,
        userId: userInfo.user.email,
        accessToken: idToken.accessToken,
        loggedIn: true,
      });
      console.log(userInfo.idToken);
      console.log(userInfo.user.id);
      console.log(userInfo.user.email);
      console.log(userInfo.user.name);
      console.log(userInfo.user.photo);
      //console.log(idToken.accessToken);

      const headers = {
        "auth-token": idToken.accessToken,
      };
      axios
        .get(`${baseURL}/phonebook`, { headers })
        .then((res) => {
          console.log(res.data);
          this._storeData(this.state.accessToken, userInfo.user.email);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.backImg}
          source={require("../../../assets/loginBack.png")} //이미지경로
          resizeMode="cover" // 'cover', 'contain', 'stretch', 'repeat', 'center' 중 선택
        >
          <Image
            center
            style={styles.photo}
            source={require("../../../assets/logo.png")}
          />
          <Button
            //   shadowless
            style={styles.btnStyle}
            center
            //   color={nowTheme.COLORS.PRIMARY}
            // onPress={() => this.signInWithGoogle()}
            onPress={this.onGoogleButtonPress}
            // onPress={() => this.signInAsync()}
            // onPress={() => {
            //   navigation.navigate("Home");
            // }}
          >
            <Text
              style={{
                fontFamily: "Binggrae-Bold",
                fontSize: 30,
                color: "white",
              }}
            >
              구글 로그인
            </Text>
          </Button>
        </ImageBackground>
      </View>
    );
  }
}
