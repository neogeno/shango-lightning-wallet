import React, { Component } from 'react';
import { observe } from 'mobx';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Icon, Badge, Text, ListItem, PricingCard, Divider, Overlay} from 'react-native-elements';
import Modal from 'react-native-modal';

import { observer } from 'mobx-react';
import store from '../store';
import Spinner from 'react-native-spinkit';

class SpinUp extends React.Component {
  constructor(props)
  {
    super(props);
    this._actionsGrpc = this.props.grpc;
    const disp = observe(store, 'isLoaderVisible', async () => { 
      if (store.isLoaderVisible == true)
        this.startPolling();
    });
  }

  async pollCloud() {
      let resp = await this._actionsGrpc.sendCommand('pollServer', {}, 'nodejs');
      let currentStatus = JSON.parse(resp);
      store.containerRunning = currentStatus.running;
      store.locked = currentStatus.lndLocked;
      store.containerReady = currentStatus.lndready;
      store.containerSpinup = currentStatus.spinup;
      store.containerStatus = currentStatus.lastKnownStatus;
      console.log('runningstatus:',currentStatus.running);
      clearTimeout(this.checkServerStatus);
      if (!store.containerRunning || (!store.containerReady && !store.locked)  )
        this.checkServerStatus = setTimeout(() => this.pollCloud(),3000);
      else {
        setTimeout (() => store.isLoaderVisible = false, 500);
        global.resultEmitter.emit('reconnect');
      }
       
  }
 
  startPolling() {
    if (store.isLoaderVisible == true) {
      this.pollCloud();
      clearTimeout(this.checkServerStatus);
      this.checkServerStatus = setTimeout(() => this.pollCloud(),5000);
    }
  }
 
  componentDidMount(){
    if (store.isLoaderVisible == true) this.startPolling();
  }

  render() {
    
    return (
      <Modal transparent animationType='slide' animationType="slide" transparent={true} isVisible={store.isLoaderVisible} onModalShow={() => { store.containerRunning = false; store.containerReady = false;  store.containerStatus = 'UNKNOWN';} }>
      <View style={{marginTop: 100, marginLeft:'4%', padding: '5%', width:'92%', height:'80%', backgroundColor: 'rgba(250, 188, 60, 0.95)', justifyContent: 'center', flexDirection:'column', alignContent:'center'}}>
          <Text style ={{fontSize:23, color: 'white', textAlign:'center', padding:20}}> Firing up LND Node </Text>
          <Text style={{textAlign:'center', fontStyle: 'italic', color:'white'}}>Upgrade to a paid full Node to skip this wait, and earn routing fees!</Text>
          <ListItem
            containerStyle={{ height:70,  width: '100%', backgroundColor:'transparent'}}
            key={1}
            titleStyle={{fontSize:14, width:'80%', color:'white'}}
            title = 'Waiting for Cloud Server Boot Up'
            rightElement =  { store.containerStatus != 'RUNNING' ? <Spinner isVisible = {true}  type='FadingCircleAlt' color='red' size={20}/> : <Icon name='check-circle' type='material-community' color='green'/> }
          />
          <ListItem
            containerStyle={{ height:70,  width: '100%', backgroundColor:'transparent'}}
            key={2}
            titleStyle={{fontSize:14, width:'80%', color:'white'}}
            title = 'Loading / Restoring state'
            rightElement =  { store.containerRunning == false ? <Spinner isVisible = {true}  type='FadingCircleAlt' color='red' size={20}/> : <Icon name='check-circle' type='material-community' color='green'/> }
          />
          <ListItem
            containerStyle={{ height:70,  width: '100%', backgroundColor:'transparent'}}
            key={3}
            titleStyle={{fontSize:14, width:'80%', color:'white'}}
            title = 'Waiting for LND to be ready'
            rightElement =  { store.containerReady == true ||  store.locked == true ?  <Icon name='check-circle' type='material-community' color='green'/> : <Spinner isVisible = {true}  type='FadingCircleAlt' color='red' size={20}/>}
          />
          
      </View>
  </Modal>
         
    );
  }
}
export default observer(SpinUp);
  