import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap, observable, trace} from 'mobx';
import {
  View,
  TouchableOpacity,
  Clipboard,
} from 'react-native';
import {Overlay, Button, Text, Card, Input} from 'react-native-elements';
import styles from '../screens/styles';
import store from '../store';
import ActionsWallet from '../actions/wallet';
import QRCode from 'react-native-qrcode';
import Modal from "react-native-modal";
 
var dict = new ObservableMap();

class PubKeyCard extends React.Component {
    constructor(props)
    {
      super(props);
      const {uris} = store;
      this.actionsGrpc = this.props.grpc;
      this.actionsWallet = new ActionsWallet(store, this.actionsGrpc); 
      dict = this.props.dict;
      dict
      .set('showAddress', String(uris) )
      .set('title', 'LIGHTNING PUBLIC NODE KEY')
      .set('nowShow', 'lightning')
    }
    handleCancelButton() 
    {
        dict.set('isPubKeyVisible', false);
    }
    onTap() {
      console.log(dict.get('showAddress'))
      Clipboard.setString(dict.get('showAddress'));
      store.alertText = 'Address copied to Clipboard';
      store.showAlert = true;
      dict.set('isPubKeyVisible', false);
    }
    render() {
      return (
        <Modal hideModalContentWhileAnimating={true} transparent animationType='slide' isVisible={dict.get('isPubKeyVisible')}>
            <Card title={dict.get('title')} >
            <View style={styles.cardcol}>
              <TouchableOpacity onPress={this.onTap}>
              <Text selectable style={styles.smalltext}> {  dict.get('showAddress') } {'\n'}</Text>
              <View style={styles.qrcontainer}>
                { (store.lndReady) ? <QRCode
                  value={ dict.get('showAddress')}
                  size={200}
                  /> : <Text>LND Not Ready Yet</Text>}
              </View>
              </TouchableOpacity>
              <View style={{padding: 20, flexDirection:'column', height: 100, justifyContent:'space-between'}}>
                <Button 
                    ref={(c) => cancelButton = c}
                    titleStyle={{flex: 1, alignItems: 'center'}}
                    title='Close'
                    buttonStyle={{width: 240, justifyContent: 'center', backgroundColor :'#48647C'} }
                    onPress={this.handleCancelButton}
                    />
              </View>
            </View>
            </Card>
        </Modal>
      );
    }
  }

  export default observer(PubKeyCard);