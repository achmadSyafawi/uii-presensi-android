// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
    StackNavigator,
    NavigationActions,
} from 'react-navigation';

import routes from './routes';
import { createServices, createStorage } from './services';
import config from '../config';

const injectedService = createServices(config.API_ROOT);
const injectedStorage = createStorage('PO');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#39aee7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const resetAction = (routeName, params) => NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName, params: params || {} }),
  ],
});

class Main extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    loading: true,
  }

  componentWillMount() {
    const { storage, service } = this.props.screenProps;
    storage.get('token')
      .then(token => service.checkAuth(token))
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.dispatch(resetAction('Home'));
      })
      .catch(() => {
        this.setState({ loading: false });
        storage.remove('token');
        this.props.navigation.dispatch(resetAction('Login'));
      });
  }

  props: {
    screenProps: DeviceProps,
    navigation: Object,
  }

  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        {loading ? (<Text>Loading ...</Text>) : null}
      </View>
    );
  }
}

const AppNavigator = StackNavigator({
  ...routes,
  Main: {
    screen: Main,
  },
}, {
  initialRouteName: 'Main',
});

export default () => <AppNavigator screenProps={{ service: injectedService, storage: injectedStorage }} />;
