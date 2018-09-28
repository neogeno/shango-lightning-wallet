import React, { Component } from 'react';
import {
  View,
  Alert,
  Keyboard,
  Platform, 
  TouchableOpacity,
  Image,
} from 'react-native';
import {Button, Text, Card, Input, Icon, Overlay } from 'react-native-elements';
import styles from '../screens/styles';
import Spinner from 'react-native-spinkit';
import Modal from "react-native-modal";
import {extendObservable, ObservableMap} from 'mobx';
import store from '../store';
import ActionsWallet from '../actions/wallet';
import ActionsPayments from '../actions/payments';
import ActionsTransactions from '../actions/transactions';
import ActionsChannels from '../actions/channels';
import { observer } from 'mobx-react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { MNEMONIC_WALLET } from '../config';
import { formatSatoshis, getSAT } from '../helpers';

var sendButton;
var amount, payment, description;
var buttonText = 'Pay';
var sendButton;
var final_amt =  0;
var final_fees = 0;
var final_network = '';
var dict = new ObservableMap();
var response;
var gotError = false;

function handleCancelButton() 
{
    this.clearFields();
    dict.set('isPayVisible', false);
    store.isPayVisible = false;
    //this.props.callbackFromParent();
}

function updateBalances() {
    this.actionsWallet.getBalance();
    this.actionsChannels.getCombinedChannels();
    this.actionsTransactions.getPayments();
    this.actionsTransactions.getTransactions();
}

function noRoute() {
    if (response == undefined && gotError == false) 
    Alert.alert('We got a Small Problem','Your payment request timed out. Open more channels with reliable, well connected and better funded nodes. Also, check your counterparties are marked ACTIVE in the Channels Tab and if necessary open a channel to your Recipient directly.',[{text: 'OK', onPress: () => {    store.isSpinnerVisible = false;  }    },],);
}


async function handlePayButton () 
{
    Keyboard.dismiss();
    
    let amount = getSAT(dict.get('amount'));
    let invoice = dict.get('address').toLowerCase();
   
    //sendButton.disabled=true;
    try {
        var isLightning =   (invoice.substring(0,2) == 'ln' || invoice.substring(0,9)=='lightning');
        if (isLightning && store.deepLinkAddress != null && store.paymentRequestResponse.invoiceref == invoice) {
                // deep link launch so fill in the memo fields
                dict.set('memo', store.paymentRequestResponse.description);
                dict.set('destination', store.paymentRequestResponse.destination);
        }
        store.isSpinnerVisible = true;
        if (isLightning)
            var payTimer = setTimeout(noRoute.bind(this), 20000);
        response = await this.actionsPayments.makePayment(invoice, amount);
        console.log('Payment Response:',  response );
        if ( isLightning) {
            // Handle Lightning Response
            if (response.payment_error == '') {
                this.clearFields();
                store.isSpinnerVisible = false;
               
                dict.set('isPayVisible', false);
                store.isPayVisible = false;  // and no errors in lightning
                store.isPaying = true;
                store.final_amt = response.payment_route.total_amt;
                store.final_fees = response.payment_route.total_fees;
                store.final_network = 'Lightning';
                store.showAlert = false;
                store.isConfirmVisible = true;
                
                let preImageArray = response.payment_preimage.data;
                let hexPreImage = (preImageArray.map(function (x) {let x1 = x.toString(16); if (x1.length <2) return '0'+ x.toString(16); else return x1;})).join("");
                let logEntry = {
                    protocol    : 'lightning',
                    type        : 'payment',
                    address     : dict.get('address'),
                    hash        : hexPreImage,
                    memo        : dict.get('memo'),
                    avatarKey   : dict.get('destination')
                }
                var transferArray = JSON.parse(store.transferLogsJSON);
                if (!transferArray) transferArray = [];
                transferArray.push(logEntry)
                store.transferLogsJSON = JSON.stringify(transferArray);
                store.save();
                console.log('Saved Log to Store:', store.transferLogsJSON);
                
                 
            }
            else {
                //We got a lightning error
                throw String(response.payment_error);
            }
        }
        else {
            // Handle Bitcoin response
            if ( response.txid) {
                store.isSpinnerVisible = false;
                
                store.isPaying = true;
                var now = new Date();
                store.final_amt = getSAT;
                store.final_network ='Bitcoin Blockchain';
                store.final_fees = 100;
                store.showAlert = false;
                store.isPayVisible = false;
                dict.set('isPayVisible', false);
                store.isConfirmVisible = true;
                
                let amount_sent = formatSatoshis(dict.get('amount'));
                var transferArray = JSON.parse(store.transferLogsJSON);
                if (!transferArray) transferArray = [];
                let logEntry = {
                    protocol    : 'bitcoin',
                    type        : 'payment',
                    address     : dict.get('address'),
                    hash        : response.txid,
                    memo        : dict.get('memo') ,
                    avatarKey   : dict.get('address')
                }
                transferArray.push(logEntry);
                let txentry = {
                    type        : 'bitcoin',
                    record      : 'transaction',
                    amount      : - (dict.get('amount')),
                    status      : 'unconfirmed',
                    date        : now.getTime() + (now.getTimezoneOffset() / 1000),
                    hdate       : 'Just Now' ,
                    memo        : dict.get('memo'),
                    hash        : response.txid,
                    avatarKey   : dict.get('address')
                }
                
                unconfirmedTx = JSON.parse(store.settings.unconfirmedTxJSON);
                if (unconfirmedTx == undefined ) unconfirmedTx = [];
                unconfirmedTx.push(txentry);
                store.settings.unconfirmedTxJSON = JSON.stringify(unconfirmedTx);
                store.transferLogsJSON = JSON.stringify(transferArray);
                store.save();
                console.log('Saved Log to Store:', store.transferLogsJSON);
                this.clearFields();
               
            }
            else {// Got a Bitcoin Error
              store.isSpinnerVisible = false;
              
              throw String(response.payment_error);
            }
        }
    } catch (error) {
        console.log('Error in PayCard Component :', error.message);
        store.isSpinnerVisible = false;
        let emessage = String(error.message);
        gotError = true;
        console.log('error onbject:', emessage);
        if (emessage.startsWith('unable to find a path')) {
            Alert.alert('We got a Problem', `LND cannot find a path to your destination.${'\n\n'}- Open more channels with reliable, connected and well funded nodes${'\n\n'}- Check your counterparties are marked ACTIVE in the Channels Tab${'\n\n'}- If necessary, open a channel to your Recipient's Node directly.`,[{text: 'OK', onPress: () => console.log('OK Pressed')},],);
        }
        else
            Alert.alert('We got a Problem', emessage ,[{text: 'OK', onPress: () => console.log('OK Pressed')},],);
    }
}

 


async function onSuccess(qr) {
    console.log('Received Data from QR:', qr);
    store.qrVisible = false;
    let decodeString = String(qr.data).toLowerCase();
    if  ( decodeString.substring(0,2) == 'ln' || decodeString.substring(0,10) == 'lightning:') { 
        if ( decodeString.substring(0,10) == 'lightning:') decodeString = decodeString.substring(10);
        await this.actionsPayments.decodePaymentRequest(decodeString);
        var { paymentRequestResponse } = store;
        if (paymentRequestResponse.numSatoshis && paymentRequestResponse.invoiceref) {
                dict.set('address', paymentRequestResponse.invoiceref.toLowerCase()); 
                dict.set('amount', paymentRequestResponse.numSatoshis); 
                dict.set('enableEditing', false);
                dict.set('memo', paymentRequestResponse.description);
                dict.set('destination', paymentRequestResponse.destination);
        }
    }
    else {
        var stringx = String(qr.data);
       if (stringx.startsWith('bitcoin:'))
           stringx = stringx.substring(8);
        dict.set('address',stringx);

    }
   
    
}

function closeButton() {
    return(
        <Icon
            raised
            containerStyle={{margin:0}}
            name='qrcode'
            type='font-awesome'
            color='#48647C'
            size={16}
            onPress={() => {
                store.qrVisible = false;
                dict.set('isPayVisible', true);
                store.isPayVisible = true;
            }}
        />
    )
}


class PayCard extends React.Component
{   
    constructor(props) {
        super(props);
        this._inputAddr = null;
        this._inputAmt = null;
        this._inputMemo = null;
        this.actionsGrpc = this.props.grpc;
        this.actionsWallet = new ActionsWallet(store, this.actionsGrpc); 
        this.actionsTransactions = new ActionsTransactions(store, this.actionsGrpc, this.actionsWallet);
        this.actionsChannels = new ActionsChannels(store, this.actionsGrpc, this.actionsTransactions);
        this.actionsPayments = new ActionsPayments(store, this.actionsGrpc, this.actionsWallet);
        dict = this.props.dict;
        dict.set('enableEditing', true)
        dict.set('isConfirmVisible', false);
        store.isConfirmVisible =false;
        if (!dict.get('address') )
            dict.set('address',''); 
        if (!dict.get('amount'))
            dict.set('amount','');
       
    }
    clearFields()
    {
        var { paymentRequestResponse } = store;
        this._inputAddr.clear();
        this._inputAmt.clear();
        this._inputMemo.clear();
        paymentRequestResponse.description='';
        paymentRequestResponse.numSatoshis='';
        paymentRequestResponse.invoiceref='';
        this._inputAddr.value='';
        dict.set('address','');
        dict.set('amount','');
        dict.set('enableEditing', true);
        store.deepLinkAddress = null;
        
    }
    addDisplayUnit() {
        store.addDisplayUnit();
    }
    render()
    {
        var { paymentRequestResponse, isPayVisible } = store;
        return (
            <View>
                <Modal  
                    useNativeDriver 
                    avoidKeyboard
                    onBackButtonPress ={() => {store.isPayVisible = false; dict.set('isPayVisible', false);}}
                    animationType={ store.isPayVisible == true ? 'slide' :'none'} 
                    onModalHide={ () => {if (store.isPaying) dict.set('isConfirmVisible', true) }} 
                    isVisible={(dict.get('isPayVisible') || store.isPayVisible == true) }  
                >
                    <Card title='NEW PAYMENT' style={styles.card} > 
                            <Input 
                                ref={(c) => this._inputAmt = c} 
                                style={{width:'100%'}}
                                containerStyle={{height:65, width: '100%'}}
                                editable ={dict.get('enableEditing')}
                                inputStyle={{ height:'100%', width: '100%'}}
                                placeholder= {'Amount '+ store.unitText}
                                leftIcon={
                                    <TouchableOpacity onPress={() => { store.addDisplayUnit(); console.log(store.displayUnit); } }>
                                    <View style = {{width: 27, height: 27}}>
                                    {store.unitIcon}
                                    </View>
                                    </TouchableOpacity>
                                }
                                placeholderTextColor='lightgrey'
                                keyboardType ="numeric"
                                returnKeyType="done"
                                clearButtonMode='while-editing'
                                clearTextOnFocus
                                onChangeText={_amount => {
                                    _amount = _amount.replace(/\./g, '');
                                    _amount = _amount.replace(/\,/g, '');
                                    _amount = _amount.replace(/\s/g, '');
                                    dict.set('amount', _amount);
                                    console.log(_amount);
                                }}
                                value={
                                    (  (paymentRequestResponse.numSatoshis) ? paymentRequestResponse.numSatoshis : (Number(dict.get('amount')) > 0 ?  String(formatSatoshis ( dict.get('amount'))) : null) )
                                }
                        />
                        <Input 
                            ref={(c) => this._inputAddr = c}
                            style={{width:'100%'}}
                            containerStyle={{height:65, width: '100%'}}
                            inputStyle={{ height:'100%', width: '100%'}}
                            leftIcon={
                                <Icon
                                    containerStyle={{margin:0}}
                                    name='qrcode'
                                    type='font-awesome'
                                    color='#48647C'
                                    onPress={() => store.qrVisible = true} 
                                    // onPress={() => dict.set('isCamVisible', true)} 
                                />}
                            clearButtonMode='while-editing'
                            placeholder="Lightning / Bitcoin Address"
                            placeholderTextColor='lightgrey'
                            value={dict.get('address')}
                            onChangeText={async _payment => {
                                if (store.deepLinkAddress == null && _payment.length>=35 && _payment.substring(0,2) == 'ln') {
                                    store.isSpinnerVisible = true;
                                    console.log('evaluating ln invoice..');
                                    await this.actionsPayments.decodePaymentRequest(_payment);
                                    var { paymentRequestResponse } = store;
                                    if (paymentRequestResponse.invoiceref == _payment) {
                                        // invoice resolved so populate dict with info
                                        dict.set('enableEditing', false);
                                        dict.set('address', paymentRequestResponse.invoiceref.toLowerCase()); 
                                        dict.set('amount', paymentRequestResponse.numSatoshis); 
                                        dict.set('memo', paymentRequestResponse.description);
                                        dict.set('destination', paymentRequestResponse.destination);
                                    }
                                    Keyboard.dismiss();
                                    store.isSpinnerVisible = false;
                                }
                                dict.set('address', _payment);
                            }}
                        />
                        <Input 
                        ref={(c) => this._inputMemo = c}
                       
                        editable ={dict.get('enableEditing')}
                        style={{width:'100%'}}
                        containerStyle={{height:65, width: '100%'}}
                        inputStyle={{ height:'100%', width: '100%'}}
                        leftIcon={
                            <Icon
                                name='pencil-square-o'
                                containerStyle={{margin:0}}
                                type='font-awesome'
                                color='#48647C'
                                //onPress={()=>store.isSpinnerVisible = true}
                            
                            />}
                        clearButtonMode='while-editing'
                        placeholderTextColor='lightgrey'
                        placeholder="Memo / Description "
                    
                        onChangeText={_memo => {
                                dict.set('memo', _memo);
                        }}
                        value={
                            (paymentRequestResponse &&  paymentRequestResponse.description) ||
                            dict.get('memo')
                        }
                        />
                        <View style={{paddingLeft: '15%', flexDirection:'column', height: 100, justifyContent:'space-between'}}>
                            <Button 
                                ref={(c) => sendButton = c}
                                disabled={!(dict.get('address') && dict.get('address').length >= 25 && dict.get('amount') >0 || paymentRequestResponse.numSatoshis >0 ) ||   store.isSpinnerVisible == true}
                                disabledStyle ={{backgroundColor: 'lightgrey'}}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title = {'Pay SAT '+ ( paymentRequestResponse.numSatoshis ? formatSatoshis(getSAT(paymentRequestResponse.numSatoshis)) : formatSatoshis(getSAT(dict.get('amount')) )) }
                                buttonStyle={{width: '80%', justifyContent: 'center',  backgroundColor :'rgba(250, 188, 60, 1)'} }
                                onPress={handlePayButton.bind(this)}
                            />
                            <Button 
                                ref={(c) => cancelButton = c}
                                titleStyle={{flex: 1, alignItems: 'center'}}
                                title='Cancel'
                                buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor :'#48647C'} }
                                onPress={handleCancelButton.bind(this)}
                            />
                        </View>
                        <Overlay
                            isVisible={store.isSpinnerVisible}
                            windowBackgroundColor="rgba(0, 0, 0, 0)"
                            overlayBackgroundColor="rgba(0, 0, 0, 0)"
                            containerStyle= {{flexDirection:'column', flex: 1, width:'100%', height:'100%', justifyContent:'center'}}
                            width="auto"
                            height="auto"
                        >
                            <Spinner isVisible type='FadingCircleAlt' color='red' size={70}/>
                        </Overlay>
                    </Card> 
                    <Modal  transparent animationType='none' isVisible={  store.qrVisible && Platform.OS == 'ios' }   hideModalContentWhileAnimating={true}>
                            <QRCodeScanner
                                onRead={onSuccess.bind(this)} 
                                fadeIn= {false}
                                showMarker = {true}
                                reactivate = {false}
                                topViewStyle = {{height: 0}}
                                bottomViewStyle ={{height: 50, backgroundColor:'black'}}
                                cameraStyle ={{height:'90%'}}
                                containerStyle ={{alignItems: 'center'}}
                                bottomContent = {closeButton.bind(this)()}
                            />
                    </Modal>  
                    
                </Modal>
                <Modal  transparent animationType='none' isVisible={  store.qrVisible && Platform.OS != 'ios' }   hideModalContentWhileAnimating={true}> 
                            <QRCodeScanner
                                onRead={onSuccess.bind(this)} 
                                fadeIn= {false}
                                showMarker = {true}
                                reactivate = {false}
                                topViewStyle = {{height: 0}}
                                bottomViewStyle ={{height: 50, backgroundColor:'black'}}
                                cameraStyle ={{height:'90%'}}
                                containerStyle ={{alignItems: 'center'}}
                                bottomContent = {closeButton.bind(this)()}
                            />
                    </Modal>  
                <Modal  animationType='slide' onModalHide={updateBalances.bind(this)} isVisible={dict.get('isConfirmVisible')} >
                <View style={{height:'100%', backgroundColor: '#3CC29E', flex: 1, flexDirection:'column', justifyContent:'center'}} >
                        <Icon       
                            containerStyle={{padding:50}}
                            name='check-circle-outline'
                            type='material-community'
                            color='white'
                            size={240}
                        />
                        <Text style={{textAlign: 'center', fontSize: 20, padding:10, color:'white'}}> {store.final_amt} Satoshis successfully sent via {store.final_network} incurring {store.final_fees} SAT fee. </Text>
                        <View style={{ width:'80%', paddingLeft:'15%', flexDirection:'column', height: 50, justifyContent:'center'}}>
                            <Button style={{width:  (Platform.OS) == 'ios' ? '100%': '50%' }} title='Close' onPress= { () => { dict.set('isConfirmVisible', false); store.isPaying = false; } } /> 
                        </View>
                </View> 
                </Modal>
              
                
            </View>
            
           
        )
    }
}

export default observer(PayCard);

//  // <View style={{flexDirection:'column', flex: 1, width:'100%', justifyContent:'center'}} >