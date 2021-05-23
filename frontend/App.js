import React, { useState } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import AppContainer from './src/navigations/AppNavigation';
import Geolocation from '@react-native-community/geolocation';

import DeviceInfo from 'react-native-device-info';
import { check, request, RESULTS, PERMISSIONS } from 'react-native-permissions';
import SmsAndroid from 'react-native-get-sms-android';

import BackgroundJob from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
});

const taskRandom = async taskData => {
    if (Platform.OS === 'ios') {
        console.warn(
            'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
            'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
        );
    }
    await new Promise(async resolve => {
        // For loop with a delay
        const { delay } = taskData;
        console.log(BackgroundJob.isRunning(), delay);
        let timeCount = true;
        let cnt = 0;
        for (let i = 0; BackgroundJob.isRunning(); i++) {
            // console.log('Runned -> ', i);
            // await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
            getGeoLocation();
            checkLocation();
            await getSMSPermission();
            DeviceInfo.getBatteryLevel().then(batteryLevel => {
                //console.log('BATTERY :: ' + batteryLevel * 100);
                if (batteryLevel <= 0.1) {
                    if (timeCount) {
                        usersms.text = '휴대폰 배터리 잔량이 10% 미만입니다! 경고!경고!';
                        sendSMS(usersms);
                        timeCount = false;
                    }
                    cnt++;
                    if (cnt >= 3600) {
                        cnt = 0;
                        timeCount = true;
                    }
                }
            });
            await sleep(delay);
        }
    });
};

const options = {
    taskName: 'Halbu Call',
    taskTitle: 'Halbu Call',
    taskDesc: 'Running',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'com.ssafy.halbu://',
    parameters: {
        delay: 2000,
    },
};

const geoValue = {
    pre_lab: 0,
    pre_log: 0,
    cur_lab: 0,
    cur_log: 0,
    time: 0,
};

const usersms = {
    phonenum: '임시 번호',
    text: '임시텍스트',
};

const getSMSPermission = async () => {
    //console.log(':::: permission');
    try {
        const checkResult = await check(PERMISSIONS.ANDROID.SEND_SMS);
        switch (checkResult) {
            case RESULTS.DENIED:
                const requestResult = await request(PERMISSIONS.ANDROID.SEND_SMS);
                return Promise.resolve(requestResult);
            case RESULTS.GRANTED:
                return Promise.resolve(checkResult);
            default:
                return Promise.reject();
        }
    } catch (err) {
        console.log(err);
    }
};

const sendSMS = async usersms => {
    // console.log(usersms.phonenum);
    // console.log(usersms.text);
    console.log(':::: sendSMS');
    try {
        // const result = await getSMSPermission();
        SmsAndroid.autoSend(
            usersms.phonenum,
            usersms.text,
            fail => {
                console.log('Failed with this error: ' + fail);
            },
            success => {
                console.log('SMS sent successfully');
            }
        );
    } catch (err) {
        console.log(err);
    }
};

function handleOpenURL(evt) {
    console.log(evt.url);
    // do something with the url
}
function getGeoLocation() {
    Geolocation.getCurrentPosition(
        position => {
            geoValue.cur_lab = position.coords.latitude;
            geoValue.cur_log = position.coords.longitude;
            //console.log("lab: "+position.coords.latitude+" "+"log: "+position.coords.longitude);
        },
        error => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 3600000, maximumAge: 3600000 }
    );
}
function checkLocation() {
    if (geoValue.pre_lab == geoValue.cur_lab && geoValue.pre_log == geoValue.cur_log) {
        //과거 좌표, 현재 좌표 같음
        geoValue.time += 2;
        //console.log(geoValue.time)
    } else {
        geoValue.time = 0;
        geoValue.pre_lab = geoValue.cur_lab; //이전 위치 갱신
        geoValue.pre_log = geoValue.cur_log;
    }
    if (geoValue.time > 10 * 3600) {
        // state 값 불러오고
        usersms.text = '장시간 움직임이 없습니다 고독사 위험!';
        sendSMS(usersms);
        geoValue.time = 0;
    }
}
//긴급연락망 번호 등록
getEmergencyInfo = async () => {
    let info = {};
    await AsyncStorage.getItem('userData', (err, result) => {
        info = JSON.parse(result);
    });

    const headers = {
        'auth-token': info.accessToken,
    };
    const baseURL = 'http://halbu.net';
    axios
        .get(`${baseURL}/emergency/info`, { headers })
        .then(response => {
            //console.log(JSON.stringify(response));
            usersms.phonenum = response.data.userinfo.emergencyMobile;
            personInfo = {
                phonenum: response.data.userinfo.emergencyMobile,
                // name : response.data.userinfo.name
            };
            AsyncStorage.setItem('personInfo', JSON.stringify(personInfo));
        })
        .catch(error => {
            console.log(error);
            //AsyncStorage.setItem('personInfo', JSON.stringify(personInfo));
        });
};

Linking.addEventListener('url', handleOpenURL);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        //this.state = { flag: false, phonenum: '01066531241', text: '휴대폰 배터리 10% 이하 경고 메세지' };
        getEmergencyInfo();
    }

    playing = BackgroundJob.isRunning();

    /**
     * Toggles the background task
     */
    toggleBackground = async () => {
        this.playing = !this.playing;
        if (this.playing) {
            try {
                console.log('Trying to start background service');
                await BackgroundJob.start(taskRandom, options);
                console.log('Successful start!');
            } catch (e) {
                console.log('Error', e);
            }
        }
    };

    render() {
        // usersms.phonenum = '';
        this.toggleBackground();
        return <AppContainer />;
    }
}
