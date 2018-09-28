import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Icon, Badge, Text, ListItem, PricingCard, Divider, Overlay} from 'react-native-elements';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'dimgrey',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 25
  }
})

export default class Tutorial extends React.Component {
  render(){
    return (
        
            <Swiper style={styles.wrapper} showsButtons={true}>
                <View style={styles.slide1}>
                    <Text style={styles.text}>
                    Shango is the easiest and most secure way to run a Bitcoin Lightning node. 
                    </Text>
                    <Text style={styles.text}>
                    Swipe Left to get Started!
                    </Text>

                </View>
                <View style={styles.slide2}>
                    <Text style={styles.text}>Beautiful</Text>
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.text}>And simple</Text>
                </View>
            </Swiper>
         
    );
  }
}
