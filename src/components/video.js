import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  View
} from 'react-native';
import store from '../store';
import Video from 'react-native-video';
import { observer } from 'mobx-react';

class Intro extends React.Component {
  
  constructor() {
    super();
    this.loadDefaults();
  }

  async loadDefaults() {
    await this.initStore();
  }

  initStore() {
    return new Promise (async function (resolve, reject) {
      try {
        const settingsJSON = await AsyncStorage.getItem('settings');
        if (settingsJSON) {
          let loadsettings = JSON.parse(settingsJSON);
          store.settings = loadsettings; 
        } 
        resolve('OK')
      } catch (error) {
        // Error retrieving data
        console.log('Store load error', error);
        reject(error);
      }
    });
  }

  render(){
    console.log('mute=', store.settings.audioMuted);
    return (
      <Video
      source={require('./intro-vertical.mp4')}  // Can be a URL or a local file.
        ref={(ref) => {
          this.player = ref
        }}                                      // Store reference
        onBuffer={this.onBuffer}                // Callback when remote video is buffering
        onEnd={() => { console.log('video played'); store.videoPlayed = true }}                      // Callback when playback finishes
        onError={this.videoError}               // Callback when video cannot be loaded
        muted={store.settings.audioMuted}
        style={{
          flex:1
          }}
        allowsExternalPlayback
        playWhenInactive
      />
    );
  }
}

export default observer(Intro);
