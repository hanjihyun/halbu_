import { StyleSheet, Dimensions } from "react-native";
// screen sizing
const { width, height } = Dimensions.get("window");
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  photo: {
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btnStyle: {
    width: width * 0.6,
    height: height * 0.07,
    backgroundColor: "#BCA4D7",
  },
  backImg: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default styles;
