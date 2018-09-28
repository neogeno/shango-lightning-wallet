import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
  View
} from 'react-native';
import {Button, Text, Card, Input, Slider} from 'react-native-elements';
import styles from '../screens/styles';
import Modal from "react-native-modal"; 
import store from '../store'


class FileTransfer extends React.Component {
    constructor(props)
    {
      super(props);
      dict = this.props.dict;
      dict.set('title', 'DOWNLOAD LND DATA');
       // Initial State of Download Bar
      dict.set('statustext', 'Creating Backup..');
      // Prepare Progress update Listener for download bar
      global.resultEmitter.addListener('downloadFile', (jsonMsg) => {
        let jsonRes = jsonMsg.result;
        console.log('listener:', jsonMsg);
        dict
        .set('percent', jsonRes.percent == undefined ? '0': jsonRes.percent)
        .set('totalfile', jsonRes.totalfile)
        .set('bytes', jsonRes.bytes)
        .set('statustext', jsonRes.statustext )
      });
    }
    handleCancelButton() 
    {
      if (dict.get('statustext') == 'Completed') {
        store.settings.lastbackupdate = new Date();
        store.save();
        global.resultEmitter.emit('connect');
      }
      else 
        global.resultEmitter.emit('reconnect');
      store.isFileTransferVisible =  false;
    }
    render() {
      return (
        <Modal hideModalContentWhileAnimating={true} transparent animationType='slide' isVisible={store.isFileTransferVisible}>
            <Card title={dict.get('title')} >
              <View style={styles.cardcol}>
                <Text>{dict.get('statustext')}</Text>
                <View style={{width:'100%', alignItems: 'stretch', justifyContent: 'center'}}>
                    <Slider
                      value={dict.get('bytes')} 
                      disabled={true} 
                      thumbStyle ={{width:6, height:6}}  
                      maximumValue={ dict.get('totalfile')}
                    />
                    <Text style={{textAlign:'center'}}>{dict.get('statustext') != 'Completed' ? dict.get('percent') +'%': 'Open shango_lnd.tar.gz using the Files App'}</Text>
                </View>
                <View style={{padding: 20, flexDirection:'column', height: 100, justifyContent:'space-between'}}>
                  <Button
                      ref={(c) => cancelButton = c}
                      titleStyle={{flex: 1, alignItems: 'center'}}
                      title={dict.get('statustext') != 'Completed' ? 'Abort' : 'Close'}
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

  export default observer(FileTransfer);