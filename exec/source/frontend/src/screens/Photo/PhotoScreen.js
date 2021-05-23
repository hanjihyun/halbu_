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
import axios from "axios";
import ImgToBase64 from "react-native-image-base64"; //uri -> base64 변환 라이브러리

export default function App(props) {
  const [response, setUserResponse] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [userphone, setUserphone] = React.useState(null);
  const { navigation } = props;

  useEffect(() => {
    try {
      setUsername(props.navigation.state.params.contact.displayName);
      setUserphone(
        props.navigation.state.params.contact.phoneNumbers[0].number
      );
    } catch (error) {
      console.log(error);
    }
  });

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
    let date = new Date();
    let title = Math.floor(date.getTime() + date.getSeconds() / 2) + ".jpg";
    const formData = new FormData();
    let content = "";
    //uri -> base64 변환 라이브러리
    console.log("URI " + response.uri);
    ImgToBase64.getBase64String(response.uri)
      .then((base64String) => {
        content = base64String;
        //console.log("함수내부에서 base64 "+base64String)
      })
      .catch((err) => doSomethingWith(err));
    formData.append("name", username);
    formData.append("mobile", userphone);
    formData.append("multipartFile", {
      // response.uri
      name: title,
      type: "image/jpeg",
      uri: response.uri,
    });
    //'file://' + response.uri + '/' + item.title
    // console.log("이미지 " + response.uri); //경로 -> 이미지를 찾아야
    //const baseURL = "http://10.0.2.2:8085";
    const baseURL = "http://halbu.net";
    try {
      axios
        .post(`${baseURL}/phonebook/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "auth-token": info.accessToken,
          },
        })
        .then((result) => {
          console.log("result :" + result);
          this.message = result.data.msg;
          localSave(title, content);
          navigation.navigate("Home", { flag: "1" });
        });
    } catch (error) {
      console.log("err: " + error);
    }
  };

  localSave = (title, content) => {
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
    <SafeAreaView>
      <ScrollView>
        {!response && (
          <View style={styles.image}>
            <View style={styles.image2}>
              <TouchableOpacity
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
                <Image
                  style={styles.btn}
                  source={require("../../../assets/camera.png")}
                />
                <Text
                  style={{
                    fontFamily: "Binggrae-Bold",
                    fontSize: 28,
                    color: "#BCA4D7",
                    textAlign: "center",
                  }}
                >
                  카메라
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
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
                <Image
                  style={styles.btn}
                  source={require("../../../assets/photo.png")}
                ></Image>
                <Text
                  style={{
                    fontFamily: "Binggrae-Bold",
                    fontSize: 28,
                    color: "#BCA4D7",
                    textAlign: "center",
                  }}
                >
                  사진첩
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* <Button
          title="잘왔는지 찍어보기"
          onPress={() =>{
            try {
              console.log(props.navigation.state.params.contact.phoneNumbers[0].number); 
            } catch (error) {
              console.log(error);
            }
            
          }
          }
        /> */}

        {/* <View style={styles.response}>
          <Text>Res: {JSON.stringify(response)}</Text>
        </View> */}

        {response && (
          <View style={styles.container}>
            <View style={styles.image3}>
              <Image
                style={{ width: 200, height: 220, margin: 50 }}
                source={{ uri: response.uri }}
              />
            </View>
            <View style={styles.insert}>
              <Button
                style={styles.button}
                color="#D9C5E4"
                onPress={() => {
                  setUserResponse(response);
                  navigation.navigate("Contacts");
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
                style={styles.input}
                multiline
                numberOfLines={2}
                placeholder="이름"
                onChangeText={(text) => setUsername(text)}
                value={username}
              />
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
                    setUserResponse(null);
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  image3: {
    flex: 0.3,
    height: height * 0.45,
    width: width,
    alignItems: "center",
    justifyContent: "center",
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
