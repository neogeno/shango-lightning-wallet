import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap} from 'mobx';
import {
  TextInput,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  Keyboard
} from 'react-native';
import {Overlay, Button, Text, Card, Input, Icon} from 'react-native-elements';
import styles from '../screens/styles';
import store from '../store';
import ActionsWallet from '../actions/wallet';
import { format } from 'url';
import QRCode from 'react-native-qrcode';
import Spinner from 'react-native-spinkit';
import { Dropdown } from 'react-native-material-dropdown';
import Modal from "react-native-modal";
import { formatSatoshis, convertAmount } from '../helpers';

var dict = new ObservableMap();


function handleCancel(){
  dict.set('isInvoiceVisible', false);
}

function handleButton ()
{
  let amount = convertAmount(dict.get('amount'),'LN');
  console.log('final amount = ', amount);
  Keyboard.dismiss();
  dict.set('isSpinnerVisible', true);
   dict.set('showInvoice', true);
   console.log('PRESSED amt note', amount, dict.get('note'));
  this.actionsWallet.genInvoice(amount, dict.get('note'))
      .then(invoiceref => {
        dict.set('paymentRequest',invoiceref);
        dict.set('allowScroll', false);
        dict.set('showInvoice', true);
        dict.set('amount', '');
        dict.set('note', '');
        dict.set('isSpinnerVisible',false)
      })
}

function handleBitcoin() {
  let amount = convertAmount(dict.get('amount'),'BTC');
  console.log('final amount = ', amount);
  dict.set('paymentRequest',`bitcoin://${store.walletAddress}?amount=${amount}&message=${dict.get('note')}`);
  dict.set('allowScroll', false);
  dict.set('showInvoice', true);
  Keyboard.dismiss();
  dict.set('showInvoice', true);
}

class InvoiceCard extends React.Component {
  constructor(props)
  {
    super(props);
    this.actionsGrpc = this.props.grpc;
    this.actionsWallet = new ActionsWallet(store, this.actionsGrpc); 
    dict = this.props.dict;
    dict
      .set('amount', '')
      .set('note', '')
      .set('showInvoice', false)
      .set('paymentRequest', '')
      .set('isLoading', false)
      .set('formFilled', false)
      .set('isSpinnerVisible',false)
  }
  onTap() {
    Clipboard.setString(dict.get('paymentRequest'));
    dict.set('showInvoice', false);
    store.alertText = 'Address copied to Clipboard';
    store.showAlert = true;
  }
  render() {
      const { walletAddress, pubKey } = store;
      const bitcoinURL = format({ protocol: 'bitcoin:', host: walletAddress });
      return (
            <Modal transparent animationType='slide' isVisible={dict.get('isInvoiceVisible')}>
                <Modal transparent animationType='slide' isVisible={dict.get('showInvoice')} onDismiss= {() =>  dict.set('isInvoiceVisible', false) } >
                <View style={{backgroundColor:'white', height:500, padding:30}}>
                    <Text h3 style = { {textAlign: 'center'}}>Payment Invoice</Text>
                    <TouchableOpacity onPress={this.onTap}>
                       <Text style = { {textAlign: 'center'}}>{'\n'}{dict.get('paymentRequest')} {'\n'}</Text>
                        <View style={styles.container}>
                          <Spinner isVisible={dict.get('isSpinnerVisible')}  type='FadingCircleAlt' color='red' size={100}/>
                          {dict.get('paymentRequest') ==''  ? null : <QRCode
                              value={dict.get('paymentRequest')}
                              size={210}
                            />
                          } 
                          <Text>{'\n'} </Text>
                          <Button title='Close' buttonStyle={{width:200}} onPress= {()=>{
                            dict.set('allowScroll', true);
                            dict.set('amount','');
                            dict.set('paymentRequest','');
                            dict.set('note','');
                            dict.set('showInvoice', false);
                          }}/>
                        </View>
                    </TouchableOpacity>
                  </View>
                  </Modal>
                  <Card title="CREATE INVOICE" containerStyle={styles.card}>
                      <Input 
                        ref={(c) => this._inputAmt = c} 
                        style={{width:'100%'}}
                        containerStyle={{height:65, width: '100%'}}
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
                        value = {formatSatoshis ( dict.get('amount'))}
                        onChangeText={_amount => {
                            _amount = _amount.replace(',','');
                            _amount = _amount.replace('.','');
                            _amount = _amount.replace(',','');
                            _amount = _amount.replace('.','');
                            dict.set('amount', _amount);
                            console.log(_amount);
                        }}
                      />
                      <Input
                        ref={(c) => this._inputNote = c}
                        placeholder="What this is for"
                        leftIcon={
                          <Icon
                              name='pencil-square-o'
                              containerStyle={{margin:0}}
                              type='font-awesome'
                              color='#48647C'
                          />
                        }
                        style={{width:'100%'}}
                        containerStyle={{height:60, width: '100%'}}
                        inputStyle={{ height:'100%', width: '100%'}}
                        value={dict.get('note')}
                        placeholderTextColor='lightgrey'
                        onChangeText={ _note=> {dict.set('note', _note)}}
                      />
                   
                      <View style={{paddingLeft: 20, width:'100%', flexDirection:'column', height: 150, justifyContent:'space-between'}}>
                          <Button
                            disabled = {dict.get('amount')==''}
                            title="Lightning Request"
                            buttonStyle={{width: '90%', justifyContent: 'center',  backgroundColor :'rgba(72, 100, 124, 1)'} }
                            onPress={ handleButton.bind(this) }
                          />
                          <Button
                            disabled = {dict.get('amount')==''}
                            title="Bitcoin Request"
                            buttonStyle={{width: '90%', justifyContent: 'center',  backgroundColor :'rgba(72, 100, 124, 1)'} }
                            onPress={ handleBitcoin.bind(this) }
                          />
                          <Button
                          title="Cancel"
                          buttonStyle={{width: '90%', justifyContent: 'center', backgroundColor :'rgba(44, 62, 80, 1)'} }
                          onPress={ handleCancel.bind(this) }
                        />
                      </View>
                    </Card>
         
          </Modal>
    );
  }
}
export default observer(InvoiceCard);



  
 
 
