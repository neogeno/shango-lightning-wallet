import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap, observable, trace} from 'mobx';
import {
  View,
  TouchableOpacity,
  Clipboard,
  Keyboard
} from 'react-native';
import {Overlay, Button, Text, Card, Input} from 'react-native-elements';
import styles from '../screens/styles';
import store from '../store';
import Modal from "react-native-modal";
import Spinner from 'react-native-spinkit';

var dict = new ObservableMap();

class ConnectPeerCard extends React.Component {
    constructor(props)
    {
      super(props);
      this.actionsGrpc = this.props.grpc;
      this.actionsChannel= this.props.channel;
      dict = this.props.dict;
      dict.set('disableButton', false)
          .set('title', 'CONNECT LND PEER')
          .set('connectpeer', '');
    }
    async connectPeer() {
      try {
        store.isSpinnerVisible = true;
        Keyboard.dismiss();
        dict.set('disableButton', true)
        let result = await this.actionsChannel.connectToPeer(dict.get('connectpeer'));
        console.log('Peer request complete');
        store.isSpinnerVisible = false;
        dict.set('isConnectPeerVisible', false);
      }
      catch(error) {
        store.isSpinnerVisible = false;
        dict.set('disableButton', false)
        console.log(error);
      }
    }
    render() {
      return (
        <Modal avoidKeyboard useNativeDriver hideModalContentWhileAnimating transparent animationType='slide' isVisible={dict.get('isConnectPeerVisible') == true} >
            <Card title={dict.get('title')} >
            <View style={styles.cardcol}>
                <Input
                  placeholder='Enter nodekey@ip:port'
                  placeholderTextColor='lightgrey'
                  style={{width:'100%'}}
                  containerStyle={{height:65, width: '100%'}}
                  inputStyle={{  width: '100%'}}
                  errorStyle={{ color: 'red' }}
                  errorMessage={dict.get('errorMsgNew')}
                  onChangeText={_newPeer => { 
                      if (_newPeer.length >=60)
                      {
                          if (_newPeer.includes('@'))
                            dict.set('errorMsgNew', null);
                          else
                            dict.set('errorMsgNew', 'MISSING IP ADDRESS OR HOSTNAME')
                          dict.set('connectpeer', _newPeer.toLowerCase())
                      }
                      else if (_newPeer.length < 60)
                        dict.set('errorMsgNew', 'NOT A VALID PUBKEY');
                      else
                        Keyboard.dismiss();
                      
                  }}
                />
                <View style={{paddingLeft: '15%', flexDirection:'column', width:'100%', height:100, justifyContent:'space-between'}}>
                            <Button 
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Connect as Peer'
                                disabled={dict.get('disableButton')}
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                                onPress= {this.connectPeer.bind(this)}
                            />
                            <Button 
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Cancel'
                                disabled={dict.get('disableButton')}
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                                onPress={() => dict.set('isConnectPeerVisible', false) }
                            />
                </View>
            </View>
            </Card>
            <Overlay
              isVisible={  store.isSpinnerVisible == true}
              windowBackgroundColor="rgba(0, 0, 0, 0)"
              overlayBackgroundColor="rgba(0, 0, 0, 0)"
              overlayStyle={{backgroundColor:'transparent'}}
              borderRadius ={0}
              containerStyle= {{flexDirection:'column', flex: 1, width:'100%', height:'100%', justifyContent:'center'}}
              width="auto"
              height="auto"
            >
              <Spinner isVisible={ store.isSpinnerVisible == true } type='FadingCircleAlt' color='red' size={70}/>
            </Overlay>
        </Modal>
      );
    }
  }

  export default observer(ConnectPeerCard);