import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Icon, Badge, Text, ListItem, PricingCard, Divider, Overlay} from 'react-native-elements';
import Modal from 'react-native-modal';
import CountdownCircle from 'react-native-countdown-circle'
import store from '../store';
import { observer } from 'mobx-react';

class CountDownTimer extends React.Component {
  render(){
    return (
      <Modal transparent animationType='slide' animationType="slide" transparent={true} isVisible={store.isCountdownVisible} onModalShow={()=> store.shownCountdown = true}>
        <View style={{marginTop: 100, marginLeft:'4%', padding: '20%', width:'92%', height:'80%', backgroundColor: 'rgba(250, 188, 60, 0.95)', justifyContent: 'center', flexDirection:'column', alignContent:'center'}}>
        <Text style ={{fontSize:23, color: 'white', textAlign:'center', padding:20}}> Your LND node is Restarting </Text>
        <CountdownCircle
          seconds={40}
          radius={90}
          borderWidth={8}
          color="#ff003f"
          bgColor="#fff"
          containerStyle ={{backgroundColor:'rgba(250, 188, 60, 0.9)'}}
          textStyle={{ fontSize: 20 }}
          onTimeElapsed={function() {
              console.log('ELAPSED!!!');
              global.resultEmitter.emit('connect');
              store.restartingNode = false;
              store.isCountdownVisible = false;
          }} 
        />
        </View>
      </Modal>
    );
  }
}

export default observer(CountDownTimer)