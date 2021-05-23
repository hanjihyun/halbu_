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
import * as ImagePicker from "./src";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImgToBase64 from "react-native-image-base64"; //uri -> base64 변환 라이브러리
import axios from "axios";
export default function App(props) {
  const { navigation } = props;
  const modifyInfo = navigation.getParam("nowitem");
  const [response, setUserResponse] = React.useState(null);
  const [oldtitle, setUserOldtitle] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [userphone, setUserphone] = React.useState(null);
  const [usertoken, setUsertoken] = React.useState(null);

  const baseURL = "http://halbu.net";

  useEffect(() => {
    try {
      console.log(
        "typeof props.navigation.state.params.contact: " +
          props.navigation.state.params.contact
      );
      if (typeof props.navigation.state.params.contact == "undefined") {
        console.log("modifyInfo.name" + modifyInfo.name);
        console.log("modifyInfo.mobile" + modifyInfo.mobile);
        console.log("modifyInfo.title" + modifyInfo.title);
        setUserResponse(modifyInfo.title);
        setUserOldtitle(modifyInfo.title);
        setUserResponse(modifyInfo.title);
        setUsername(modifyInfo.name);
        setUserphone(modifyInfo.mobile);
      } else {
        setUsername(props.navigation.state.params.contact.displayName);
        setUserphone(
          props.navigation.state.params.contact.phoneNumbers[0].number
        );
        props.navigation.state.params.modifyFlag = "0";
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.navigation.state.params.modifyFlag]);

  AsyncStorage.getItem("userData", (err, value) => {
    let info = JSON.parse(value);
    setUsertoken(info.accessToken);
  });

  const updatePhoto = async () => {
    let uri = "";
    if (oldtitle != response) {
      uri = response.uri;
    } else {
      uri = "file://" + RNFS.DocumentDirectoryPath + "/" + response;
    }
    let date = new Date();
    let newtitle = Math.floor(date.getTime() + date.getSeconds() / 2) + ".jpg";
    let formData = new FormData();
    formData.append("oldtitle", oldtitle);
    formData.append("multipartFile", {
      name: newtitle,
      type: "image/jpeg",
      uri: uri,
    });
    try {
      axios
        .put(`${baseURL}/phonebook/change/pic`, formData, {
          headers: {
            "auth-token": usertoken,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          console.log("update photo");
          
        });
    } catch (error) {
      console.log("err: " + error);
    }
    //로컬쪽 oldtitle 삭제
    deletePhoto(oldtitle);
    //로컬에  newtitle 사진 저장
    let content = "";
    await ImgToBase64.getBase64String(uri)
      .then((base64String) => {
        content = base64String;
      })
      .catch((err) => console.log(err));
    localSave(newtitle, content);
    //갱신 코드
    alert("수정 완료")
    navigation.navigate("Home", { flag: "1" });
  };

  //oldtitle 삭제
  const deletePhoto = (oldtitle) => {
    var savePath = RNFS.DocumentDirectoryPath + "/" + oldtitle;
    RNFS.unlink(savePath)
      .then((res) => {
        console.log("내장 파일 삭제 성공");
      })
      .catch((err) => {
        console.warn(err.message, err.code);
      });
  };

  //로컬에 저장
  const localSave = (title, content) => {
    console.log("내부 폴더 저장 :: " + title);
    console.log("전달받은 base64 :: " + content);
    var savePath = RNFS.DocumentDirectoryPath + "/" + title;
    RNFS.writeFile(savePath, content, "base64")
      .then((res) => {
        console.log("내부 폴더 저장 성공");
      })
      .catch((err) => {
        console.warn(err.message, err.code);
      });
  };

  const updateData = async () => {
    let formData = new FormData();
    formData.append("title", oldtitle); //title
    formData.append("name", username);
    formData.append("mobile", userphone);

    const baseURL = "http://halbu.net";
    const headers = {
      "auth-token": usertoken,
      "Content-Type": "application/json",
    };
    try {
      axios
        .put(`${baseURL}/phonebook/change/text`, formData, { headers })
        .then((result) => {
          console.log(result);
          updatePhoto();
        });
    } catch (error) {
      console.log("err: " + error);
    }
  };

  const changeinput = (text) => {
    setUsername(text);
    console.log(text);
  };

  // const uploadData = async () => {
  //   let date = new Date();
  //   let title = Math.floor(date.getTime() + date.getSeconds() / 2) + ".jpg";
  //   const formData = new FormData();
  //   formData.append("name", username);
  //   formData.append("mobile", userphone);
  //   formData.append("multipartFile", {
  //     // response.uri
  //     name: title,
  //     type: "image/jpeg",
  //     uri: response.uri,
  //   });
  //   //const baseURL = "http://10.0.2.2:8085";
  //   const baseURL = "http://halbu.net";
  //   try {
  //     axios
  //       .post(`${baseURL}/phonebook/upload`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           "auth-token": usertoken,
  //         },
  //       })
  //       .then((result) => {
  //         console.log("result :" + result);
  //         this.message = result.data.msg;
  //         localSave(title, response.uri);
  //       });
  //   } catch (error) {
  //     console.log("err: " + error);
  //   }
  // };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.image3}>
          <Image
            style={{ width: 200, height: 220, margin: 30 }}
            source={
              oldtitle == response
                ? {
                    uri:
                      "file://" + RNFS.DocumentDirectoryPath + "/" + response,
                  }
                : { uri: response.uri }
            }
          />

          <View style={styles.image4}>
            <Button
              style={styles.button}
              color="#D9C5E4"
              onPress={() => {
                requestCameraPermission();
                ImagePicker.launchCamera(
                  {
                    mediaType: "photo",
                    includeBase64: false,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  (response) => {
                    setUserResponse(response);
                  }
                );
              }}
            >
              <Text
                style={{
                  fontFamily: "Binggrae-Bold",
                  fontSize: 20,
                  color: "#BCA4D7",
                  textAlign: "center",
                }}
              >
                카메라
              </Text>
            </Button>
            <Button
              style={styles.button}
              color="#D9C5E4"
              onPress={() =>
                ImagePicker.launchImageLibrary(
                  {
                    mediaType: "photo",
                    includeBase64: false,
                    maxHeight: 200,
                    maxWidth: 200,
                  },
                  (response) => {
                    setUserResponse(response);
                  }
                )
              }
            >
              <Text
                style={{
                  fontFamily: "Binggrae-Bold",
                  fontSize: 20,
                  color: "#BCA4D7",
                  textAlign: "center",
                }}
              >
                사진첩
              </Text>
            </Button>
          </View>
        </View>
        <View style={styles.insert}>
          <Button
            style={styles.button}
            color="#D9C5E4"
            onPress={() => {
              setUserResponse(response);
              navigation.navigate("ModifyContacts");
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
          <TextInput
            style={styles.inputContact}
            multiline
            numberOfLines={2}
            placeholder="이름"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          {/* <Text>전화번호</Text> */}
          <TextInput
            style={styles.inputContact}
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
            flex: 0.1,
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
                source={require("../../../assets/error.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                updateData();
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
  inputContact: {
    fontFamily: "Binggrae",
    color: "black",
    margin: 10,
    height: 50,
    width: "80%",
    fontSize: 20,
    borderColor: "#BCA4D7",
    borderRadius: 10,
    borderWidth: 2,
  },
  button: {
    height: 45,
    width: "30%",
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  image3: {
    flex: 0.7,
    height: height * 0.45,
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  image4: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  insert: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  response: {
    marginVertical: 16,
    marginHorizontal: 8,
  },
  btn: {
    padding: 80,
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#9B85CB",
    backgroundColor: "#EFE8F1",
    marginHorizontal: 15,
  },
  before: {
    marginLeft: 30,
    marginTop: 30,
    height: 60,
    width: 60,
  },
  ok: {
    height: 60,
    width: 60,
    marginRight: 30,
    marginTop: 30,
  },
});
