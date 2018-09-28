import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { ObservableMap} from 'mobx';
import {
  View,
  Keyboard,
  Alert
} from 'react-native';
import {Overlay, Button, Text, Card, Input, CheckBox} from 'react-native-elements';
import store from '../store';
import Modal from "react-native-modal";
import Spinner from 'react-native-spinkit';

var dict = new ObservableMap();

class ChangePasswordCard extends React.Component {
    constructor(props)
    {
      super(props);
      this.actionsGrpc = this.props.grpc;
      this.checkedbox = true;
      this.actionsInfo = this.props.info
      dict.set('currentPass', '')
          .set('newPass', null)
          .set('repeatPass', null)
          .set('disableButton', true)
    }
    async changePassword() {
      try {
        store.isSpinnerVisible = true;
        var result = await this.actionsInfo.changePass(dict.get('currentPass'), dict.get('newPass'));
        if (result = {}) { 
            store.isSpinnerVisible = false;
            Alert.alert('PASSWORD SET SUCCESSFULLY','Your new password is now effective. Note that if you lose your password, you will lose access to your node as your actual password is not stored anywhere.',[{text: 'OK', onPress: () =>  { setTimeout( () => global.resultEmitter.emit('reconnect'), 7000); store.changePassVisible = false; } },],);
            store.settings.passwordChange = false;
            store.save();
            dict.set('currentPass', null)
                .set('newPass', null)
                .set('repeatPass', null)
                .set('disableButton', true)
                .set('changePassVisible', false)
        }
      } catch (error) {
          store.isSpinnerVisible = false;
          console.log(error);
      }
    }
    render() {
      return (
        <Modal avoidKeyboard animationType='slide' transparent isVisible={store.changePassVisible == true}>
                    <Card title='CHOOSE LND PASSWORD' > 
                        <Input
                            placeholder='Current password (if any)'
                            placeholderTextColor='lightgrey'
                            style={{width:'100%'}}
                            secureTextEntry
                            containerStyle={{height:65, width: '100%'}}
                            inputStyle={{  width: '100%'}}
                            errorStyle={{ color: 'red' }}
                            errorMessage={dict.get('errorMsgCurrent')}
                            onChangeText={_currentPass => { 
                                    dict.set('currentPass', _currentPass)
                            }}
                            value={dict.get('currentPass')}
                        />
                        <Input
                            placeholder='Enter your NEW password'
                            placeholderTextColor='lightgrey'
                            style={{width:'100%'}}
                            secureTextEntry
                            containerStyle={{height:65, width: '100%'}}
                            inputStyle={{  width: '100%'}}
                            errorStyle={{ color: 'red' }}
                            errorMessage={dict.get('errorMsgNew')}
                            onChangeText={_newPass => { 
                                if (_newPass.length <8)
                                    dict.set('errorMsgNew', 'NEW PASSSWORDS MUST BE 8 CHARS OR LONGER');
                                else {
                                    dict.set('errorMsgNew', null);
                                    dict.set('newPass', _newPass)
                                }
                            }}
                        />
                        <Input
                            placeholder='Repeat it here once more'
                            placeholderTextColor='lightgrey'
                            style={{width:'100%'}}
                            secureTextEntry
                            containerStyle={{height:65, width: '100%'}}
                            inputStyle={{  width: '100%'}}
                            errorStyle={{ color: 'red' }}
                            errorMessage={dict.get('errorMsgRepeat')}
                            onChangeText={_newPassRepeat => { 
                                if (_newPassRepeat.length <8)
                                    dict.set('errorMsgRepeat', 'PASSSWORDS MUST BE 8 CHARS OR LONGER');
                                else if (_newPassRepeat != dict.get('newPass'))
                                    dict.set('errorMsgRepeat', 'PASSSWORDS DO NOT MATCH YET');
                                else {
                                    dict.set('errorMsgRepeat', null);
                                    dict.set('repeatPass', _newPassRepeat);
                                    dict.set('disableButton', false);
                                    Keyboard.dismiss();
                                }
                            }}
                        />
                        <View style= {{flexDirection:'row', height: 50, alignContent:'center'}}>
                            <CheckBox size={20} checked={this.checkedbox} onPress ={ () => {this.checkedbox = !this.checkedbox; this.forceUpdate(); }} />
                            <Text style={{textAlign:'center', paddingVertical:12}} >Invalidate old access keys (safer) </Text>
                        </View>
                        <View style={{paddingLeft: '15%', flexDirection:'column', height: 90, justifyContent:'space-between'}}>
                            <Button 
                                ref={(c) => cpButton = c}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Change Password'
                                disabled={dict.get('disableButton')}
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                                onPress={() => this.changePassword() }
                            />
                            <Button 
                                ref={(c) => infoButton = c}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Cancel'
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                                onPress={() => store.changePassVisible = false }
                            />
                        </View>
                    </Card>
                    <Overlay
                        isVisible={  store.isSpinnerVisible == true}
                        windowBackgroundColor="rgba(0, 0, 0, 0)"
                        overlayBackgroundColor="rgba(0, 0, 0, 0)"
                        overlayStyle={{backgroundColor:'transparent'}}
                        borderRadius ={0.01}
                        containerStyle= {{flexDirection:'column', flex: 1, width:'100%', height:'100%', justifyContent:'center'}}
                        width="auto"
                        height="auto"
                    >
                        <Spinner isVisible={ store.isSpinnerVisible == true } type='FadingCircleAlt' color='red' size={100}/>
                    </Overlay>
                </Modal>
      );
    }
  }

  export default observer(ChangePasswordCard);