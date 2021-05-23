import React from 'react';
import { View, Text, Image, ScrollView, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';


export default class App extends React.Component {
   _storeData = async () => {
        try {
            console.log("실행")
            await AsyncStorage.setItem(
            '@MySuperStore:key',
            'I like to save it.'
            );
        } catch (error) {
            // Error saving data
        }
    };

    render(){
       
        return (
        
        <ScrollView>
        <Text>Some text</Text>
        <View>
            <Text>Some more text</Text>
            <Image
            source={{
                uri: 'https://reactnative.dev/docs/assets/p_cat2.png',
            }}
            style={{ width: 200, height: 200 }}
            />
        </View>
        <TextInput
            style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1
            }}
            defaultValue="You can type in me"
        />
        <Button
            onPress = {this._storeData}
            title="Learn More"
            color="#841584"
        />
        </ScrollView>
        );
    }
}