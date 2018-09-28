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
import ActionsInfo from '../actions/info';
import Modal from "react-native-modal";
import Spinner from 'react-native-spinkit';

var dict = new ObservableMap();

class PasswordCard extends React.Component {
    constructor(props)
    {
      super(props);
      const {uris} = store;
      this.actionsGrpc = this.props.grpc;
      this.actionsInfo = new ActionsInfo(store, this.actionsGrpc); 
      dict.set('disableButton', false)
          .set('title', 'LND WALLET LOCKED')
          .set('loginPassword', '');
    }
    async login() {
      try {
        store.isSpinnerVisible = true;
        Keyboard.dismiss();
        dict.set('disableButton', true)
        let result = await this.actionsInfo.unlockWallet(dict.get('loginPassword'));
        if (result.ok) {
          console.log('Wallet Unlocked Successfully');
          this.pollCloud();
        }
      }
      catch(error) {
        store.isSpinnerVisible = false;
        dict.set('disableButton', false)
        console.log(error);
      }
    }
    async pollCloud() {
      let resp = await this.actionsGrpc.sendCommand('pollServer', {}, 'nodejs');
      let currentStatus = JSON.parse(resp);
      console.log('locked status:',currentStatus.lndLocked);
      console.log('container ready status:',currentStatus.lndready);
      if (currentStatus.lndLocked == true || currentStatus.lndready == false) {
        clearTimeout(this.checkServerStatus);
        this.checkServerStatus = setTimeout(() => this.pollCloud(),3000);
      }
      else {
        global.resultEmitter.emit('reconnect');
        store.isSpinnerVisible = false;
        dict.set('disableButton', false);
        store.isPasswordVisible = false;
      }
    }
    render() {
      return (
        <Modal  avoidKeyboard hideModalContentWhileAnimating={true} transparent animationType='slide' isVisible={store.isPasswordVisible == true}>
            <Card title={dict.get('title')} >
            <View style={styles.cardcol}>
                <Input
                  placeholder='Enter LND passphrase (case sensitive)'
                  placeholderTextColor='lightgrey'
                  style={{width:'100%'}}
                  secureTextEntry
                  containerStyle={{height:65, width: '100%'}}
                  inputStyle={{  width: '100%'}}
                  errorStyle={{ color: 'red' }}
                  errorMessage={dict.get('errorMsgNew')}
                  onChangeText={_newPass => { 
                      if (_newPass.length >=8)
                      {
                          dict.set('errorMsgNew', null);
                          dict.set('loginPassword', _newPass)
                      }
                  }}
                />
                <View style={{paddingLeft: '15%', flexDirection:'column', width:'100%', justifyContent:'space-between'}}>
                            <Button 
                                ref={(c) => cpButton = c}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Unlock Wallet'
                                disabled={dict.get('disableButton')}
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                                onPress={() => this.login() }
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

  export default observer(PasswordCard);