import Constants from "expo-constants";

var environments = {
  staging: {
    FIREBASE_API_KEY: "AIzaSyDhxqtWZ-2LIjK4g_U63ObDm_uF9nMTGKc",
    FIREBASE_AUTH_DOMAIN: "grandparentscare-2b1f2.firebaseapp.com",
    FIREBASE_APP_ID: "1:538740324729:web:25d653e9566697d75b97a8",
    FIREBASE_PROJECT_ID: "grandparentscare-2b1f2",
    FIREBASE_STORAGE_BUCKET: "grandparentscare-2b1f2.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "G-TC01GN0WGJ",
    GOOGLE_CLOUD_VISION_API_KEY: "AIzaSyC3lyhBMpp68ortr3nIhitvnF1NIBIhhU4",
  },
  production: {
    // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
  },
};

function getReleaseChannel() {
  let releaseChannel = Constants.manifest.releaseChannel;
  if (releaseChannel === undefined) {
    return "staging";
  } else if (releaseChannel === "staging") {
    return "staging";
  } else {
    return "staging";
  }
}
function getEnvironment(env) {
  console.log("Release Channel: ", getReleaseChannel());
  return environments[env];
}
var Environment = getEnvironment(getReleaseChannel());
export default Environment;
