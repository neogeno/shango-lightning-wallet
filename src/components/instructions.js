import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {extendObservable, ObservableMap, observable, trace} from 'mobx';
import {
  View,
  ScrollView,
  Alert,
  Clipboard,
  Keyboard,
 
} from 'react-native';
import {Overlay, Button, Text, Card, Input, ButtonGroup} from 'react-native-elements';
import Modal from "react-native-modal";
var dict = new ObservableMap();

class Instructions extends React.Component {
    constructor(props)
    {
      super(props);
      dict = this.props.dict;
      this.state = {
        selectedIndex: 0
      }
      this.updateIndex = this.updateIndex.bind(this);
    }

    updateIndex (selectedIndex) {
      this.setState({selectedIndex})
    }

    handleCancelButton() 
    {
        dict.set('isInstructionsVisible', false);
    }
    render() {
      const buttons = ['Linux', 'Mac'];
      const { selectedIndex } = this.state;
      return (
        <Modal transparent animationType='slide' isVisible={dict.get('isInstructionsVisible')} style={{ backgroundColor:'white', justifyContent:'flex-start'}}>
        <View style={{padding:20, flex:1 , height: '100%'}}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{height: 25}}
          />
          <ScrollView  style ={{height:'100%'}}>
              <Text>{'\n'}1. Verify LND is listening on public IP and port</Text>
              <View style={{backgroundColor:'black', padding: 10}}> 
                  <Text selectable style={{color:'white',}}>$ {(selectedIndex ==0 ) ?  'echo IP=$(curl -s ipinfo.io/ip) && lncli --rpcserver=$(curl -s ipinfo.io/ip):10009 getinfo' : 'echo IP=$(curl -s ipinfo.io/ip) && lncli --rpcserver=$(curl -s ipinfo.io/ip):10009 getinfo' } </Text>
              </View>
              <Text  style={{color:'green'}}>Proceed ONLY if getinfo works</Text> 
              <Text>{'\n'}2. Install QRCode Utility and goto LND dir</Text>
              <View style={{backgroundColor:'black', padding: 10}}> 
                  <Text selectable style={{color:'white'}}>$ {(selectedIndex ==0) ? 'sudo apt-get install qrencode && cd ~/.lnd' : 'brew install qrencode && cd ~/"Library/Application Support/Lnd"'}</Text>
              </View>
              <Text>{'\n'}3. Show QR code in LND folder</Text>
              <View style={{backgroundColor:'black', padding: 10}}> 
                  <Text selectable style={{color:'white'}}>$ {(selectedIndex ==0) ? 'echo -e "$(curl -s ipinfo.io/ip),\\n$(xxd -p -c2000 admin.macaroon)," > qr.txt && cat tls.cert >>qr.txt && qrencode -t ANSIUTF8 < qr.txt' : 'echo -e "$(curl -s ipinfo.io/ip),\\n$(xxd -p -c2000 admin.macaroon)," > qr.txt && cat tls.cert >>qr.txt && qrencode -r qr.txt -t ANSIUTF8'} </Text>
              </View>
              <Text style={{color:'green'}}>Tap Scan QR Button{'\n'}</Text>
              
              <Text>{'\n'}Note:{'\n\n'}* Make sure you have set the --tlsextraip and --externalip options when starting lnd if you want to access your node remotely.</Text>
              <Text>{'\n'}* Check if your router has port forwarding configured properly from public to private IP on ports 10009 and 9735.</Text>
              <Text>{'\n'}* If you have previously started lnd without the public IP specified in the --tlsextraip option, delete tls.cert and tls.key from the LND folder and then restart lnd so it can generate a new certificate.</Text>
              </ScrollView>
              <View style={{padding: 15, paddingLeft:'15%', flexDirection:'column', justifyContent:'space-between'}}>
                <Button 
                    ref={(c) => infoButton = c}
                    titleStyle={{flex: 1, alignItems: 'center'}}
                    title='Close'
                    buttonStyle={{width: '80%', justifyContent: 'center', backgroundColor :'#48647C'} }
                    onPress={() => {dict.set('isInstructionsVisible', false)}}
                />
              </View>
          </View>
        </Modal>
       
      );
    }
  }

  export default observer(Instructions);