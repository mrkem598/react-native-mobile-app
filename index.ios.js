import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import AppContainer from './app/AppContainer'
export default class dinder extends Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

AppRegistry.registerComponent('dinder', () => dinder);
