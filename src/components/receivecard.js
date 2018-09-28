import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap, observable, trace} from 'mobx';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
 
} from 'react-native';
import {Overlay, Button, Text, Card, Input} from 'react-native-elements';
import styles from '../screens/styles';
import store from '../store';
import ActionsWallet from '../actions/wallet';
import { format } from 'url';
import QRCode from 'react-native-qrcode';
import Spinner from 'react-native-spinkit';
import Modal from "react-native-modal";
 
var dict = new ObservableMap();

class ReceiveCard extends React.Component {
    constructor(props)
    {
      super(props);
      this.actionsGrpc = this.props.grpc;
      this.actionsWallet = new ActionsWallet(store, this.actionsGrpc); 
      dict = this.props.dict;
      const {walletAddress} = store;
      dict
      .set('nowShow', 'bitcoin')
      .set('showAddress',  walletAddress)
      .set('title', 'YOUR ON-CHAIN WALLET')
    }
    handleCancelButton() 
    {
        dict.set('isReceiveVisible', false);
    }
    refreshButton() 
    {
         this.actionsWallet.getNewAddress();
    }
    onTap() {
      const {walletAddress} = store;
      console.log(  walletAddress)
      Clipboard.setString(walletAddress);
      store.alertText = 'Address copied to Clipboard';
      store.showAlert = true;
      dict.set('isReceiveVisible', false);
    }
    render() {
      const {walletAddress} = store;
      return (
        <Modal hideModalContentWhileAnimating={true} transparent animationType='slide' isVisible={dict.get('isReceiveVisible')}>
            <Card title={dict.get('title')} >
               <View style ={styles.cardcol}>
                  <TouchableOpacity onPress={this.onTap.bind(this)}>
                  <Text selectable style={styles.smalltext}> {  walletAddress  } {'\n'}</Text>
                  <View style={styles.qrcontainer}>
                    { (store.lndReady == true) ? <QRCode
                      value={  walletAddress}
                      size={200}
                      /> : <Text>LND Not Ready Yet</Text>}
                  </View>
                  </TouchableOpacity>
                  <View style ={{padding:20, height:130, justifyContent:'space-between'}}>
                    <Button 
                        ref={(c) => refreshButton = c}
                        title='New Address'
                        buttonStyle={{width: 240, justifyContent: 'center', backgroundColor :'#48647C'} }
                        onPress={this.refreshButton.bind(this)}
                        />
                    <Button 
                    ref={(c) => cancelButton = c}
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

  export default observer(ReceiveCard);