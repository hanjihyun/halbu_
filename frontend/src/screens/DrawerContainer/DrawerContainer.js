import React from "react";
import {
  View,
  Text,
  Switch,
  Wrap,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../../components/MenuButton/MenuButton";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundJob from "react-native-background-actions";
import RNRestart from "react-native-restart";

let playing = BackgroundJob.isRunning();

export default class DrawerContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      check: true,
    };
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      AsyncStorage.removeItem("userData");
      this.props.navigation.closeDrawer();
      this.props.navigation.navigate("Login");
      // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <MenuButton
            title="HOME"
            source={require("../../../assets/icons/home.png")}
            onPress={() => {
              navigation.navigate("Home");
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="긴급번호등록"
            source={require("../../../assets/icons/list.png")}
            onPress={() => {
              navigation.navigate("Regist", { setEmergencyFlag: "1" });
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="백그라운드"
            source={
              this.state.check
                ? require("../../../assets/on.png")
                : require("../../../assets/off.png")
            }
            onPress={() => {
              if (this.state.check) {
                BackgroundJob.stop();
                // this.setState({ playing: false });
                playing = false;
                this.setState({ check: false });
                console.log(this.state.playing);
              } else {
                Alert.alert("실행을 위해 앱을 재시작합니다.");
                RNRestart.Restart();
              }
            }}
          />
          {/* <View>
                        {this.state.check ? (
                            <Image style={styles.favbt} source={require('../../../assets/green.png')} />
                        ) : (
                            <Image style={styles.favbt} source={require('../../../assets/red.png')} />
                        )}
                    </View> */}
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <MenuButton
            title="로그아웃"
            source={require("../../../assets/icons/logout.png")}
            onPress={() => {
              this.signOut();
            }}
          />
        </View>
      </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
