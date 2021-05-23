import React from "react";
import { 
    View, 
    Text,
    Wrap,
    Pressable,
    ToggleContainer,
    ToggleWheel,
    StyleSheet,
} from "react-native";

export default class Toggle extends React.Component {
    render(){
        return(
            <Wrap>
                <Pressable onPress={onToggle}>
                    <ToggleContainer style={{ backgroundColor: color }}>
                    <ToggleWheel style={[styles.toggleWheel, { transform: [{ translateX: moveSwitchToggle }] }]} />
                    </ToggleContainer>
                </Pressable>
            </Wrap>
        );
    }
}

const styles = StyleSheet.create({
  toggleWheel: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },
});