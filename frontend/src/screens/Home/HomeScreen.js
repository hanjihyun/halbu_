import React, { useState } from "react";
import {
  getUniqueId,
  Dimensions,
  getMaufacturer,
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  useEffect,
  Button,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { useAsync } from "react-async";
import styles from "./styles";
import MenuImage from "../../components/MenuImage/MenuImage";
import DrawerActions from "react-navigation";
import { NativeModules } from "react-native";
import { Linking } from "react-native";
import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import Modal from "react-native-modal";
import axios from "axios";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CallToActionBox from "react-native-plus-button-box";
import SearchBar from "react-native-search-bar";
const { width, height } = Dimensions.get("window");

// const baseURL = 'http://13.124.136.200';
const baseURL = "http://halbu.net";
const search1 = React.createRef();
export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerLeft: () => (
        <MenuImage
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      ),
      headerTitle: () => (
        <SearchBar
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
            flex: 1,
          }}
          inputContainerStyle={{
            backgroundColor: "#EDEDED",
          }}
          inputStyle={{
            fontFamily: "Binggrae",
            backgroundColor: "#EDEDED",
            borderRadius: 10,
            color: "black",
          }}
          textColor="Black"
          barStyle="black"
          //lightTheme
          // round
          // onChangeText={(text) => params.handleSearch(text)}
          // text={params.searchValue}
          ref={search1}
          // onChange={(e) => console.log(e.nativeEvent)}
          
          onChangeText={(searchValue) => {
              try {
                params.handleSearch(searchValue)
              } catch (err) {
                console.log(err);
              }
            }
          }
          onSearchButtonPress={() => search1.current.blur()}
          onClear={() => params.handleSearch("")}
          placeholder="검색"
          // value={params.searchValue}
        />
      ),
    };
  };

  componentDidUpdate() {
    if (this.props.navigation.state.params.flag == "1") {
      this.forRefresh();
      this.props.navigation.state.params.flag = 0;
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;
    await this.getToken();

    this.getList();
    navigation.setParams({
      handleSearch: this.handleSearch.bind(this),
      searchValue: this.getValue,
    });
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((files) => {
        console.log("files :: " + files.length);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }
  getValue = () => {
    return this.state.searchValue;
  };

  handleSearch = (text) => {
    this.setState({ searchValue: text });
    const recipeArray1 = this.getName(text);

    if (text == "") {
      this.setState({
        searchValue: text,
        list: JSON.parse(JSON.stringify(this.state.searchData)),
      });
    } else {
      this.setState({
        searchValue: text,
        list: recipeArray1,
      });
    }
  };

  getName(title) {
    const nameUpper = title.toUpperCase();

    const contacts = [];
    for (var i = 0; i < this.state.searchData.length; i++) {
      var data = JSON.parse(JSON.stringify(this.state.searchData[i]));
      if (data.name.toUpperCase().indexOf(nameUpper) >= 0) {
        contacts.push(data);
      }
    }

    if (contacts.length <= 0) {
      this.setState({ listlen: false });
    } else {
      this.setState({ listlen: true });
    }

    return contacts;
  }

  constructor(props) {
    super(props);

    this.state = {
      isToggleOn: false,
      token: "",
      list: [],
      searchData: [],
      route: "",
      refreshing: false,
      page: 1,
      open: false,
      searchValue: "",
      nowitem: {},
      listlen: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (item) => {
    let fav = 0;
    if (item.favorite == 0) {
      fav = 1;
    }
    let title = item.title;
    console.log(item.favorite + " (" + title + ")>> " + fav);

    item.favorite = fav;
    this.setState({ isToggleOn: true });
    try {
      const headers = {
        "auth-token": this.state.token,
      };
      axios
        .put(`${baseURL}/phonebook/favorite/${title}`, {}, { headers })
        .then((res) => {
          // item.favorite = fav;
          this.getList();
          console.log(res.data);
          // this.setState({ isToggleOn: true });
          return item;
        })
        .catch(function (error) {
          console.warn(error);
          this.setState({ isToggleOn: false });
          if (fav == 1) {
            fav = 0;
          } else {
            fav = 1;
          }
          item.favorite = fav;
          return item;
        });
    } catch (error) {
      console.warn(error);
    }
  };

  onPressRecipe = (item) => {
    //this.props.navigation.navigate('Recipe', { item });
    //전화걸기
    console.log("전화걸기");
    console.log(item.mobile);
    RNImmediatePhoneCall.immediatePhoneCall(item.mobile);
    this.setState({ open: false });
  };

  getToken = async () => {
    await AsyncStorage.getItem("userData", (err, value) => {
      let info = JSON.parse(value);
      this.state.token = info.accessToken;
      console.log("TOKEN :: " + this.state.token);
    });
    // this.getList();
  };

  getList = () => {
    console.log("getList");
    try {
      const headers = {
        "auth-token": this.state.token,
      };
      axios
        .get(`${baseURL}/phonebook/list`, { headers })
        .then((res) => {
          console.log("res.data.texts" + JSON.stringify(res.data.texts));
          if (res.data.texts.length > 0) this.setState({ listlen: true });
          // this.state.list = res.data.texts;
          this.setState({ list: res.data.texts, searchData: res.data.texts });
          this.storeData(res.data.texts);
          this.photoFor(this.state.list);
        })
        .catch(function (error) {
          console.warn(error);
        });
    } catch (error) {
      console.warn(error);
    }
  };

  photoFor = async (data) => {
    console.log("list for" + data.length);
    for (let index = 0; index < data.length; index++) {
      await this.loadPhoto(data[index]);
    }
    this.setState({ refreshing: false });
  };

  storeData = async (texts) => {
    console.log("storeData");
    try {
      // await AsyncStorage.setItem('list', texts);
      await AsyncStorage.setItem(
        "list",
        JSON.stringify({
          texts: texts,
        })
      );
      // this.props.navigation.navigate('Home');
      // await AsyncStorage.getItem('list', (err, value) => {
      //     let info = JSON.parse(value);
      //     this.state.list = info;
      //     console.log(this.state.list)
      // });
    } catch (err) {
      console.log(err);
    }
  };

  getPhotoData = (title) => {
    try {
      const headers = {
        "auth-token": this.state.token,
      };
      axios
        .get(`${baseURL}/phonebook/download/pic/${title}`, { headers })
        .then((res) => {
          // console.log(res.data);
          const data = {
            file: res.data.file,
            title: title,
          };
          this.uploadPhoto(data);
        })
        .catch(function (error) {
          console.warn(error);
          console.warn(Object.keys(error));
        });
    } catch (error) {
      console.warn(error);
    }
  };

  uploadPhoto = (data) => {
    console.log("내부 폴더 저장 :: " + data.title);
    var savePath = RNFS.DocumentDirectoryPath + "/" + data.title;
    RNFS.writeFile(savePath, data.file, "base64")
      .then((res) => {
        console.log("내부 폴더 저장 성공");
        this.setState({ route: savePath });
      })
      .catch((err) => {
        console.warn(err.message, err.code);
      });
  };

  loadPhoto = async (item) => {
    var savePath = RNFS.DocumentDirectoryPath + "/" + item.title;
    this.state.route = "";

    await RNFS.exists(savePath).then((exists) => {
      if (exists) {
        this.setState({ route: savePath });
        // this.saveBase(this.state.route);
      } else {
        console.log("사진 없음" + this.state.route);
        this.getPhotoData(item.title);
      }
    });
  };

  forRefresh = () => {
    this.setState(
      {
        refreshing: true,
        page: 1,
      },
      this.getList
    );
  };

  removeBack = async (item) => {
    console.log("백엔드 삭제");
    try {
      const headers = {
        "auth-token": this.state.token,
      };
      axios
        .delete(`${baseURL}/phonebook/remove/${item.title}`, { headers })
        .then((res) => {
          console.log(res.data);
          this.deletePhoto(item);
        })
        .catch(function (error) {
          console.warn(error);
        });
    } catch (error) {
      console.warn(error);
    }
  };

  deletePhoto = (item) => {
    var savePath = RNFS.DocumentDirectoryPath + "/" + item.title;

    RNFS.unlink(savePath)
      .then((res) => {
        console.log("내장 파일 삭제 성공");
        this.forRefresh();
        this.setState({ open: false });
        Alert.alert("삭제가 완료되었습니다!");
      })
      .catch((err) => {
        console.warn(err.message, err.code);
      });
  };

  setItem = async (item) => {
    console.log("nowitem" + item);
    this.state.nowitem = item;
    this.setState({ open: true });
  };

  renderRecipes = ({ item }) => (
    <TouchableHighlight
      underlayColor="#D9C5E4"
      onPress={() => this.setItem(item)}
    >
      <View style={styles.container}>
        {/* <Image style={styles.photo} onLoadStart={() => this.loadPhoto(item)} source={{ uri: item.photo_url }}></Image> */}
        <Image
          style={styles.photo}
          source={{
            uri: "file://" + RNFS.DocumentDirectoryPath + "/" + item.title,
          }}
        ></Image>
        <TouchableOpacity
          style={styles.fav}
          onPress={() => this.handleClick(item)}
        >
          <View>
            {item.favorite == 1 ? (
              <Image
                style={styles.favbt}
                source={require("../../../assets/icons/star-true.png")}
              />
            ) : (
              <Image
                style={styles.favbt}
                source={require("../../../assets/icons/star-false.png")}
              />
            )}
          </View>
        </TouchableOpacity>
        {/* <Text style={styles.title}>{item.title}</Text> */}
      </View>
    </TouchableHighlight>
  );

  moveToModify = async () => {
    this.setState({ open: false });
    this.props.navigation.navigate("Modify", { nowitem: this.state.nowitem });
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: "center" }} tmfs>
        {this.state.listlen ? (
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.list}
            refreshing={this.state.refreshing}
            onRefresh={this.forRefresh}
            renderItem={this.renderRecipes}
            keyExtractor={(item) => `${item.title}`}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.result}
                source={require("../../../assets/search.png")}
              />
              <Text></Text>
              <Text style={styles.title}>
                등록된 전화번호가 존재하지 않습니다!
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
        )}
        <CallToActionBox
          style={
            ({ zIndex: 999 },
            {
              position: "absolute",
              top: Dimensions.get("window").height - 200,
              bottom: 0,
              left: Dimensions.get("window").width - 100,
              right: 0,
            })
          }
          buttonColor="#BCA4D7"
          actions={[
            {
              key: "test",
              text: "Test me",
              onPress: () => {
                this.props.navigation.navigate("Photo");
              },
            },
          ]}
        />
        <Modal
          backdropColor={"white"}
          backdropOpacity={0.9}
          children
          useNativeDriver={true}
          isVisible={this.state.open}
          // modalDidOpen={() => console.log("modal did open")}
          // onModalHide={() => this.setState({ open: false })}
          onModalHide={() => this.setState({ open: false })}
          style={{ alignItems: "center", borderRadius: 30 }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  margin: 5,
                  width: width * 0.4,
                }}
                onPress={this.moveToModify}
              >
                <Text
                  style={{
                    height: height * 0.05,
                    fontFamily: "Binggrae-Bold",
                    fontSize: 15,
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#3CB371",
                    borderRadius: 10,
                    paddingTop: 7,
                  }}
                >
                  수정
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  margin: 5,
                  width: width * 0.4,
                }}
                onPress={() => this.removeBack(this.state.nowitem)}
              >
                <Text
                  style={{
                    height: height * 0.05,
                    fontFamily: "Binggrae-Bold",
                    fontSize: 15,
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "#FA8072",
                    borderRadius: 10,
                    paddingTop: 7,
                  }}
                >
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 5,
                borderColor: "#BCA4D7",
                borderRadius: 10,
                margin: 10,
              }}
            >
              <Image
                style={{
                  margin: 20,
                  height: height * 0.3,
                  width: width * 0.6,
                }}
                resizeMode="contain"
                source={{
                  uri:
                    "file://" +
                    RNFS.DocumentDirectoryPath +
                    "/" +
                    this.state.nowitem.title,
                }}
              ></Image>
            </View>
            <View>
              <Text style={styles.input}>{this.state.nowitem.name}</Text>
              <Text style={styles.input}>{this.state.nowitem.mobile}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ open: false, nowitem: {} })}
              >
                <Image
                  style={{
                    height: height * 0.3,
                    width: width * 0.35,
                    marginRight: 10,
                  }}
                  resizeMode="contain"
                  source={require("../../../assets/cancel.png")}
                ></Image>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.onPressRecipe(this.state.nowitem)}
              >
                <Image
                  style={{
                    height: height * 0.3,
                    width: width * 0.35,
                    marginLeft: 10,
                  }}
                  resizeMode="contain"
                  source={require("../../../assets/phone-call.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <Button title="클릭" onPress={this.sendSMS} /> */}

        {/* <Image style={{width: 50, height: 50}} source={{uri: base64Image}}/> */}
      </View>
    );
  }
}
