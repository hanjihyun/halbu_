import React from "react";
import { StyleSheet, View, Button as RNButton } from "react-native";

export function Button({ style, title, onPress, color }) {
  return (
    <View style={styles.container}>
      <RNButton
        style={styles.button}
        title={title}
        onPress={onPress}
        color={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 24,
    borderRadius: 30,
  },
});
