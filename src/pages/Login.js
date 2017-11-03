/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { getDimensions, isIOS } from '../utilities';

import Logo from '../uikit/Logo';
import StatusBar from '../uikit/StatusBar';
import Button from '../component/Button';

const createStyle = (width: number, height: number): StyleSheet.Style =>
    StyleSheet.create({
        container: {
            flex: 1,
            position: 'relative',
            backgroundColor: '#FAFAFA',
        },
        accent: {
            position: 'absolute',
            top: '-15%',
            left: -120,
            zIndex: 1,
            height: height - 120,
            width: width + 200,
            backgroundColor: 'cyan',
            transform: [{ skewY: '-15deg' }],
        },
        mainContainer: {
            flex: 1,
            zIndex: 2,
            position: 'relative',
        },
        logoContainer: {
            height: '50%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        formWrapper: {
            flex: 1,
            padding: 20,
        },
        formContainer: {
            borderRadius: 10,
            shadowColor: '#222',
            shadowOffset: {
                width: 0,
                height: 15,
            },
            shadowRadius: 20,
            shadowOpacity: 0.3,
        },
        input: {
            height: 40,
            backgroundColor: '#fff',
            opacity: 0.9,
            marginBottom: 15,
            paddingHorizontal: 15,
        },
        toolbar: {
            backgroundColor: 'blue',
            paddingTop: 20,
            paddingBottom: 10,
            flexDirection: 'row',
        },
        toolbarButton: {
            width: 50,
            color: 'white',
            textAlign: 'center',
        },
        toolbarTittle: {
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            flex: 1,
        },
        wrapper: {
            paddingHorizontal: 15,
        },
        inputWrap: {
            flexDirection: 'row',
            marginVertical: 10,
            height: 40,
            backgroundColor: 'transparent',
        },
        button: {
            backgroundColor: '#82b2f4',
            paddingVertical: 15,
            marginVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: '#fff',
            fontSize: 15,
        },
    });

export default class Login extends Component {
    static navigationOptions = {
        header: null,
    };

    state = {
        nidn: '',
        password: '',
    };

    props: {
        screenProps: DeviceProps,
        navigation: Object,
    };

    passwordInput: HTMLInputElement;

    handleLogin(): void {
        const { nidn, password } = this.state;
        const { service, storage } = this.props.screenProps;
        if (nidn.length && password.length) {
            service
                .auth(nidn, password)
                .then(token => {
                    storage.set('token', token);
                })
                .then(() => {
                    this.props.navigation.navigate('Home');
                })
                .catch(err => {
                    const errMsg = err.message;
                    if (errMsg.includes('Network Error')) {
                        Alert.alert('cannot connect');
                    } else {
                        Alert.alert('Username/Password tidak ditemukan');
                    }
                });
        } else {
            Alert.alert('please check the box');
        }
    }

    render() {
        const { width, height } = getDimensions();
        const styles = createStyle(width, height);
        return (
            <KeyboardAvoidingView
                behavior={isIOS ? 'padding' : 'position'}
                style={styles.container}
                contentContainerStyle={
                    isIOS ? StyleSheet.create({}) : styles.container
                }
                keyboardVerticalOffset={isIOS ? 0 : -(height - 20 / 100)}
            >
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="rgba(0, 0, 0, .5)"
                />
                <LinearGradient
                    style={styles.accent}
                    colors={['#55d854', '#2fce56']}
                />
                <View style={styles.mainContainer}>
                    <View style={styles.logoContainer}>
                        <Logo width={250} height={250} />
                    </View>
                    <View style={styles.formWrapper}>
                        <View style={styles.formContainer}>
                            <TextInput
                                id="nidn"
                                placeholder="NIDN"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    this.passwordInput.focus()}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={nidn => this.setState({ nidn })}
                            />
                            <TextInput
                                id="nidn"
                                secureTextEntry
                                placeholder="Password"
                                returnKeyType="go"
                                ref={c => {
                                    this.passwordInput = c;
                                }}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                onChangeText={password =>
                                    this.setState({ password })}
                            />
                            <Button
                                onPress={() => this.handleLogin()}
                                text="Login"
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}
