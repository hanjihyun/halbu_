import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  ScrollView,
  Platform,
  TextInput,
  SafeAreaView,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";

import { Block, Button, Text, theme } from "galio-framework";
import { Value } from "react-native-reanimated";
import RNFS from "react-native-fs";
const { width, height } = Dimensions.get("window");

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function App(props) {
  const [response, setUserResponse] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [userphone, setUserphone] = React.useState(null);
  const { navigation } = props;

  useEffect(() => {
    try {
      // setUserphone(
      //   props.navigation.state.params.contact.phoneNumbers[0].number
      // );
      // console.log("hihihihihihih")
      // console.log(props.navigation.state.params.setEmergencyFlag);
      props.navigation.state.params.setEmergencyFlag = "0";
      setEmergencyInfo();
    } catch (error) {
      console.log(error);
    }
  }, [props.navigation.state.params.setEmergencyFlag]);

  async function setEmergencyInfo() {
    await AsyncStorage.getItem("personInfo", (err, result) => {
      try{
        info = JSON.parse(result);
        // setUsername(info.name);
        setUserphone(info.phonenum);
      }catch(err){
        console.log(err);
      }
    });
  }

  const changeinput = (text) => {
    setUsername(text);
    console.log(text);
  };

  const uploadData = async () => {
    let info = {};
    await AsyncStorage.getItem("userData", (err, result) => {
      info = JSON.parse(result);
    });
    console.log(info.accessToken);

    const formData = new FormData();

    formData.append("name", username);
    formData.append("emergencyMobile", userphone);
    console.log(formData);

    //const baseURL = "http://10.0.2.2:8085";
    const baseURL = "http://halbu.net";
    try {
      axios
        .post(`${baseURL}/emergency/save`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "auth-token": info.accessToken,
          },
        })
        .then((result) => {
          console.log("############################");
          console.log("result :" + result);
          this.message = result.data.msg;
          setUserphone(userphone);
          personInfo = {
            phonenum: userphone,
          };
          AsyncStorage.setItem("personInfo", JSON.stringify(personInfo));
          alert("수정 완료");
          navigation.navigate("Home");
        });
    } catch (error) {
      console.log("############################");
      console.log("err: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.insert}>
          <Button
            style={styles.button}
            color="#D9C5E4"
            onPress={() => {
              setUserResponse(response);
              navigation.navigate("Contacts2");
            }}
          >
            <Text
              style={{
                fontFamily: "Binggrae-Bold",
                fontSize: 20,
                color: "white",
              }}
            >
              연락처
            </Text>
          </Button>
          {/* <TextInput
            style={styles.input}
            multiline
            numberOfLines={2}
            placeholder="이름"
            onChangeText={(text) => setUsername(text)}
            value={username}
          /> */}
          {/* <Text>전화번호</Text> */}
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={2}
            placeholder="전화번호"
            value={userphone}
            onChangeText={(text) => setUserphone(text)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 0.2,
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Image
                style={styles.before}
                source={require("../../../assets/before.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                uploadData();
              }}
            >
              <Image
                style={styles.ok}
                source={require("../../../assets/ok.png")}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    fontFamily: "Binggrae",
    color: "black",
    margin: 10,
    height: 50,
    width: "80%",
    fontSize: 20,
    borderColor: "#BCA4D7",
    borderRadius: 10,
    textAlign: "center",
    borderWidth: 2,
  },
  button: {
    height: 45,
    width: "30%",
    marginVertical: 24,
    marginHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  insert: {
    height: height * 0.65,
    width: width,
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  before: {
    marginLeft: 30,
    marginTop: 50,
    height: 60,
    width: 60,
  },
  ok: {
    height: 60,
    width: 60,
    marginRight: 30,
    marginTop: 50,
  },
});
