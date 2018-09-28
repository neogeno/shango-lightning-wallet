import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Keyboard,
  TouchableOpacity,
  Image
 
} from 'react-native';
import {Button, Text, Card, Input, Icon, Overlay} from 'react-native-elements';
import styles from '../screens/styles';
import Spinner from 'react-native-spinkit';
import Modal from "react-native-modal";
import {extendObservable, ObservableMap} from 'mobx';
import store from '../store';
import { observer } from 'mobx-react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { formatSatoshis} from '../helpers'
var sendButton;
var buttonText = 'Open Channel';
var openChannelNode = '';
var openChannelMemo ='';
 

var dict = new ObservableMap();

class NewChannelCard extends React.Component
{   
    constructor(props) {
        super(props);
        this.actionsGrpc = this.props.grpc;
        this.actionsChannel = this.props.actionsChannel;
        dict = this.props.dict;
        dict.set('openChannelNode', '');
        dict.set('openChannelAmt', '');
        dict.set('remoteChannelAmt', '');
        dict.set('feePerByte', '');
    }
    async onSuccess(qr) {
        console.log('Received Data from QR:', qr);
        if (dict.get('isCamVisible') == true) { 
            store.openChannelNode = qr.data;
            dict.set('openChannelNode', qr.data)
        }
        dict.set('isCamVisible', false);
    }  
    closeButton() {
        return(
            <Icon
                raised
                containerStyle={{margin:0}}
                name='qrcode'
                type='font-awesome'
                color='#48647C'
                size={16}
                onPress={() => dict.set('isCamVisible', false)} 
            />
        )
    }
    

    async handleOpenButton () {
        Keyboard.dismiss();
        store.isSpinnerVisible = true;
        dict.set('isSpinnerVisible', true);
        var openChannelAmt = dict.get('openChannelAmt');
        var remoteChannelAmt = dict.get('remoteChannelAmt');
        if (remoteChannelAmt == '') remoteChannelAmt =0;
        var fee = dict.get('feePerByte');
        
        if (store.confirmedBalanceSatoshis <30000)
        {
            Alert.alert('We got a Problem', 'You have insufficient funds to open a channel. Deposit at least 30,000 Satoshis to your on-chain wallet first',[{text: 'OK', onPress: () => dict.set('isNewChannelVisible', false)},],);
            return;
        }
        try {
            console.log('opening Channel...');
            var result = await this.actionsChannel.openChannel(dict.get('openChannelNode'), Number(openChannelAmt), Number(remoteChannelAmt), Number(fee) );
            if (result) {
                dict.set('isSpinnerVisible', false);
                store.isSpinnerVisible = false;
                this.actionsChannel.getCombinedChannels();
                store.isOpeningChannels = true;
                this.handleCancelButton();
            }
        } 
        catch (error) {
            dict.set('isSpinnerVisible', false);
            store.isSpinnerVisible = false;
            console.log('Error in Opening Channel :', error);
            Alert.alert('We got a Problem', '\n' +'Lightning Open Channel Error: ' +error,[{text: 'OK', onPress: () => console.log('OK Pressed')},],);
        }
    }
    clearFields()
    {
        this._inputAddr.clear();
        this._inputAmt.clear();
        this._inputMemo.clear();
        this._inputFee.clear();
        openChannelNode = '';
        dict.set('openChannelNode', '');
        dict.set('openChannelAmt', '');
        dict.set('remoteChannelAmt', '');
        dict.set('feePerByte', '');
        openChannelMemo ='';
        this._inputAddr.value='';
    }
    handleCancelButton() 
    {
        this.clearFields();
        dict.set('isNewChannelVisible', false);
    }
    render()
    {    
        return (
            <Modal useNativeDriver avoidKeyboard transparent animationType='slide' isVisible={dict.get('isNewChannelVisible')}>
                <Modal useNativeDriver transparent animationType='none' isVisible={dict.get('isCamVisible')}   hideModalContentWhileAnimating={true}>
                    <QRCodeScanner
                        onRead={this.onSuccess} 
                        fadeIn= {false}
                        showMarker = {true}
                        reactivate = {false}
                        topViewStyle = {{height: 0}}
                        bottomViewStyle ={{height: 50, backgroundColor:'black'}}
                        cameraStyle ={{height:'90%'}}
                        containerStyle ={{alignItems: 'center'}}
                        bottomContent = {this.closeButton()}
                    />
                </Modal>
                <View style={{height:420}}>
                    <Card title='NEW CHANNEL' containerStyle={styles.card}> 
                        <Input 
                            ref={(c) => this._inputAddr = c}
                            leftIcon = {<Icon
                                containerStyle={{margin:0}}
                                name='qrcode'
                                type='font-awesome'
                                color='#48647C'
                                onPress={() => dict.set('isCamVisible', true)} 
                            />}
                            inputStyle={{ height:'100%', width: '100%'}}
                            containerStyle={{height:55, width: '100%'}}
                            clearButtonMode='while-editing'
                            placeholder="Remote Pubkey / Node address"
                            placeholderTextColor='lightgrey'
                            value={ dict.get('openChannelNode')}
                            onEndEditing={() => {
                                sendButton.disabled=false;
                            }}
                            onChangeText={_pubkey => {
                                openChannelNode= _pubkey;
                                dict.set('openChannelNode', _pubkey);
                            }}
                        />
                        <Input 
                            ref={(c) => this._inputAmt = c} 
                            containerStyle={{height:55, width: '100%'}}
                            leftIcon={
                                <TouchableOpacity onPress={this._onPressButton}>
                                    <Image
                                        style={{width: 20, height: 20}}
                                        source={require('./satoshi.png')}
                                    />
                                </TouchableOpacity>
                            }
                            placeholder="Capacity in Satoshis"
                            inputStyle={{ height:'100%', width: '100%'}}
                            placeholderTextColor='lightgrey'
                            keyboardType ="numeric"
                            returnKeyType="done"
                            clearButtonMode='while-editing'
                            editable={true}
                            value={ Number(dict.get('openChannelAmt')) > 0 ?  String(formatSatoshis ( dict.get('openChannelAmt'))) : null}
                            onChangeText={_amount => {
                                _amount = _amount.replace(/\./g, '');
                                _amount = _amount.replace(/\,/g, '');
                                _amount = _amount.replace(/\s/g, '');
                                dict.set('openChannelAmt', _amount);
                                console.log(_amount);
                            }}
                        />
                        <Input 
                            ref={(c) => this._inputRemote = c} 
                            containerStyle={{height:55, width: '100%'}}
                            leftIcon={
                                <TouchableOpacity onPress={this._onPressButton}>
                                    <Image
                                        style={{width: 20, height: 20}}
                                        source={require('./satoshi.png')}
                                    />
                                </TouchableOpacity>
                            }
                            placeholder="Remote deposit in Satoshis"
                            inputStyle={{ height:'100%', width: '100%'}}
                            placeholderTextColor='lightgrey'
                            keyboardType ="numeric"
                            returnKeyType="done"
                            clearButtonMode='while-editing'
                            value={  Number(dict.get('remoteChannelAmt')) > 0 ?  String(formatSatoshis ( dict.get('remoteChannelAmt'))) : null  }
                            editable={true}
                            onChangeText={_amount => {
                                _amount = _amount.replace(/\./g, '');
                                _amount = _amount.replace(/\,/g, '');
                                _amount = _amount.replace(/\s/g, '');
                                dict.set('remoteChannelAmt', _amount);
                            }}
                        />
                        <Input 
                            ref={(c) => this._inputFee = c} 
                            containerStyle={{height:55, width: '100%'}}
                            leftIcon={
                                <TouchableOpacity onPress={this._onPressButton}>
                                    <Image
                                        style={{width: 20, height: 20}}
                                        source={require('./satoshi.png')}
                                    />
                                </TouchableOpacity>
                            }
                            placeholder="SAT/byte Fee (optional)"
                            inputStyle={{ height:'100%', width: '100%'}}
                            placeholderTextColor='lightgrey'
                            keyboardType ="numeric"
                            returnKeyType="done"
                            clearButtonMode='while-editing'
                            value={ dict.get('feePerByte')}
                            editable={true}
                            onChangeText={_amount => {
                               
                                dict.set('feePerByte', _amount);
                            }}
                        />
                        <Input 
                            ref={(c) => this._inputMemo = c}
                            containerStyle={{height:55, width: '100%'}}
                            leftIcon={
                                <Icon
                                    name='pencil-square-o'
                                    containerStyle={{margin:0}}
                                    type='font-awesome'
                                    color='#48647C'
                                    onPress={() => console.log('hello')} 
                                />}         
                            clearButtonMode='while-editing'
                            inputStyle={{ height:'100%', width: '100%'}}
                            placeholderTextColor='lightgrey'
                            placeholder="Memo / Description "
                            value={this.openChannelMemo}
                        />
                        <View style={{padding: '7%', marginLeft:0, flexDirection:'column', width:'100%', height: 170, justifyContent:'space-between'}}>
                            <Button 
                                ref={(c) => sendButton = c}
                                disabled={( dict.get('openChannelNode').length < 20) }
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title={buttonText}
                                buttonStyle={{width: 240, justifyContent: 'center',  backgroundColor :'rgba(72, 100, 124, 1)'} }
                                disabledStyle= {{backgroundColor :'lightgrey'}}
                                onPress={this.handleOpenButton.bind(this)}
                            />
                            <Button 
                                ref={(c) => cancelButton = c}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Cancel'
                                buttonStyle={{width: 240, justifyContent: 'center', backgroundColor :'#48647C'} }
                                onPress={this.handleCancelButton.bind(this)}
                            />
                        </View>
                        <Overlay
                            isVisible={dict.get('isSpinnerVisible') && store.isSpinnerVisible == true }
                            windowBackgroundColor="rgba(0, 0, 0, 0)"
                            overlayBackgroundColor="rgba(0, 0, 0, 0)"
                            containerStyle= {{flexDirection:'column', flex: 1, width:'100%', height:'100%', justifyContent:'center'}}
                            width="auto"
                            height="auto"
                        >
                            <Spinner isVisible={dict.get('isSpinnerVisible')  && store.isSpinnerVisible == true } type='FadingCircleAlt' color='red' size={70}/>
                        </Overlay>
                </Card>
            </View>
            </Modal>
        )
    }
}

export default observer(NewChannelCard);