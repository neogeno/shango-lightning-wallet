import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap, observable, trace, observe} from 'mobx';
import {
  View,
  TouchableOpacity,
  Clipboard,
  Alert,
  Keyboard
} from 'react-native';
import {Overlay, Button, Text, Card, Input} from 'react-native-elements';
import styles from '../screens/styles';
import store from '../store';
import ActionsInfo from '../actions/info';
import Modal from "react-native-modal";
import Spinner from 'react-native-spinkit';

var dict = new ObservableMap();

class TerminateCard extends React.Component {
    constructor(props)
    {
      super(props);
      const {uris} = store;
      dict = this.props.dict;
      this.actionsGrpc = this.props.grpc;
      this.actionsInfo = this.props.info; 
      dict.set('disableButton', true)
          .set('title', 'TERMINATE NODE CHECK')
    }
    async burn() {
      try {
        store.isSpinnerVisible = true;
        store.restartingNode = true;
        store.lndReady = false;
        Keyboard.dismiss();
        dict.set('disableButton', true)
        let result = await this.actionsInfo.terminateNode();
        if (result.OK) {
          dict.set('isTerminateVisible', false);
          console.log('** NODE TERMINATED SO NOW RECONNECTING ***');
          store.settings.showSetup = true;
          store.settings.stateless_macaroon = null;
          store.save();
          dict.set('isSpinnerVisible', false);
          dict.set('editable', !dict.get('editable'));
          const disposer = observe(store, 'lndReady', () => {
            if (store.lndReady == true) {
                disposer();
                store.restartingNode = false;
                //Alert.alert('Node Terminated', 'Enjoy your new full LND node.',[{text: 'OK', onPress: () => console.log('OK Pressed')},],);
            }
          });
          global.resultEmitter.emit('reconnect');
          store.isSpinnerVisible = false;
          dict.set('disableButton', false);
        }
      }
      catch(error) {
        store.isSpinnerVisible = false;
        dict.set('disableButton', false)
        console.log(error);
      }
    }
    render() {
      return (
        <Modal avoidKeyboard hideModalContentWhileAnimating={true} transparent animationType='slide' isVisible={dict.get('isTerminateVisible') == true}>
            <Card title='TERMINATE LND NODE'>
            <View style={styles.cardcol}>
                <Text>Just to be sure, Type the words 'burn baby burn' to really destroy your cloud node: </Text>
                <Input
                  placeholder='burn baby burn'
                  placeholderTextColor ='lightgrey'
                  style={{width:'100%'}}
                  autoCapitalize ='none'
                  containerStyle={{height:65, width: '100%', paddingVertical: 5}}
                  inputStyle={{  width: '100%'}}
                  onChangeText={_newPass => { 
                      if (_newPass == 'burn baby burn')
                      {
                          Keyboard.dismiss();
                          dict.set('disableButton', false);
                      }
                      else 
                        dict.set('disableButton', true);
                  }}
                />
                <View style={{paddingLeft: '15%', flexDirection:'column', height: 100, width:'100%', justifyContent:'space-between'}}>
                  <Button 
                      ref={(c) => cpButton = c}
                      titleStyle={{flex: 1, alignItems: 'center'}}
                      title='Nuke it'
                      disabled={dict.get('disableButton') == true}
                      buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                      onPress={() => this.burn() }
                  />
                  <Button 
                      ref={(c) => cpButton = c}
                      titleStyle={{flex: 1, alignItems: 'center'}}
                      title='Abort'
                      buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor : '#48647C' } }
                      onPress={() => { dict.set('isTerminateVisible', false); dict.set('disableButton', true);}}
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
              <Spinner isVisible={ store.isSpinnerVisible == true } type='FadingCircleAlt' color='red' size={100}/>
            </Overlay>
        </Modal>
      );
    }
  }

  export default observer(TerminateCard);