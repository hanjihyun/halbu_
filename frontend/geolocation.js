import Geolocation from '@react-native-community/geolocation';

import React, { Component, useState } from 'react';

const Geo = forwardRef((props, ref) => {

    // constructor(props) {
    //   super(props);

    //   this.state = { 
    //     phonenum: '01066531241', 
    //     text: '휴대폰 배터리 10% 이하 경고 메세지',
    //     pre_lab: 0,
    //     pre_log: 0,
    //     cur_lab: 0,
    //     cur_log: 0,
    //     time: 0,
    //   };
    // }
    useImperativeHandle(ref, () =>({
      checkLocation = () =>{
        if((this.state.pre_lab==this.state.cur_lab) && (this.state.pre_log==this.state.cur_log)){
          this.state.time += 2
          console.log(this.state.time);
        }
        else{//위도 경도가 같음
          this.state.time = 0
          //이전 위치 갱신
          this.state.pre_lab = this.state.cur_lab
          this.state.pre_log = this.state.cur_log
        }
        if(this.state.time > 5){
          //메시지 전달
          this.sendSMS();
          this.state.time = 0
        }
      },
      //좌표 받기
      getGeoLocation = () => {
        console.log("좌표 실행")
        Geolocation.getCurrentPosition(
          (position) => {
              this.state.cur_lab = position.coords.latitude;
              this.state.cur_log = position.coords.longitude;
          },
          (error) => {
              console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000 }
        );
      }
    }));
    return <h1>hi</h1>
});

export default Geo