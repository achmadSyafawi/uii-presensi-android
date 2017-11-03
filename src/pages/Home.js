// @flow

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Camera from 'react-native-camera';

import { getDimensions, mergeStyles } from '../utilities';

import LocationDisplay from '../component/LocationDisplay';
import Button from '../component/Button';

import StatusBar from '../uikit/StatusBar';
import ShutterButton from '../uikit/ShutterButton';
import LogoutButton from '../uikit/LogoutButton';
import CameraPreview from '../uikit/CameraPreview';

const buttons = [
    {
        text: 'Absensi Masuk',
        actionParam: 'masuk',
    },
    {
        text: 'Absensi Keluar',
        actionParam: 'keluar',
    },
];

const createStyle = (width: number, height: number): StyleSheet.Style =>
    StyleSheet.create({
        container: {
            flex: 1,
            position: 'relative',
        },
        contentWrapper: {
            flex: 1,
            position: 'relative',
        },
        innerContent: {
            position: 'absolute',
            width,
            height,
            top: 0,
            left: 0,
            flex: 1,
        },
        content: {
            zIndex: 3,
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        camera: {
            zIndex: 1,
        },
        absenView: {
            position: 'absolute',
            zIndex: 3,
            width,
            height: height - 25,
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
        },
        preview: {
            flex: 1,
        },
        locationDisplay: {
            width,
        },
        buttonContainer: {
            width,
            paddingTop: 20,
            paddingBottom: 30,
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        buttonShutter: {
            justifyContent: 'center',
        },
        buttonLogout: {
            paddingLeft: 30,
        },
        absenButton: {
            width,
        },
    });

export default class Home extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.camera = null;
    }

    state = {
        busy: false,
        shouldAbsen: false,
        holiday: false,
        locationFound: false,
        token: '',
        data: '',
        locationId: '',
    };

    componentWillMount() {
        const { storage } = this.props.screenProps;
        storage.get('token').then(token => {
            this.setState({ token });
        });
    }
    componentDidMount() {
        const { service } = this.props.screenProps;
        service.checkHoliday().then(holiday => {
            this.setState({ holiday });
        });
    }

    camera: any;

    props: {
        screenProps: DeviceProps,
    };

    handleCapture(): void {
        if (!this.state.shouldAbsen) {
            const options = {};
            this.camera.capture({ metadata: options }).then(({ data }) => {
                this.setState({
                    shouldAbsen: true,
                    data,
                });
            });
        }
    }

    submitAbsen(action: string): void {
        const { service } = this.props.screenProps;
        this.setState({ busy: true }, () => {
            service
                .performAbsen(
                    this.state.data,
                    this.state.locationId,
                    Date.now(),
                    action,
                    this.state.token
                )
                .then(() => {
                    this.setState({
                        busy: false,
                        shouldAbsen: false,
                    });
                })
                .catch(() => {
                    this.setState({
                        busy: false,
                        shouldAbsen: false,
                    });
                });
        });
    }

    handleLogout() {
        const { storage } = this.props.screenProps;
        storage.remove('token');
        const resetRouter = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Login',
                }),
            ],
        });
        this.props.navigation.dispatch(resetRouter);
    }

    render() {
        const { screenProps } = this.props;
        const { width, height } = getDimensions();
        const styles = createStyle(width, height);
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />
                <View style={styles.contentWrapper}>
                    <View
                        style={mergeStyles(styles.innerContent, styles.content)}
                    >
                        <LocationDisplay
                            onLocationFound={({ locationId }) => {
                                this.setState({
                                    locationId,
                                    locationFound: true,
                                });
                            }}
                            screenProps={screenProps}
                            style={styles.locationDisplay}
                        />
                        <View style={styles.buttonContainer}>
                            {!this.state.holiday && this.state.locationFound
                                ? <View style={styles.buttonWrapper}>
                                      <ShutterButton
                                          width={100}
                                          height={100}
                                          onPress={() => this.handleCapture()}
                                          pause={this.state.busy}
                                      />
                                  </View>
                                : null}
                            <View style={styles.buttonLogout}>
                                <LogoutButton
                                    width={50}
                                    height={50}
                                    onPress={() => this.handleLogout()}
                                    pause={this.state.busy}
                                />
                            </View>
                        </View>
                    </View>
                    <Camera
                        ref={c => {
                            this.camera = c;
                        }}
                        style={mergeStyles(styles.innerContent, styles.camera)}
                        aspect={Camera.constants.Aspect.fill}
                        captureTarget={Camera.constants.CaptureTarget.memory}
                        type={Camera.constants.Type.front}
                        rotation={360}
                        orientation={Camera.constants.Orientation.portrait}
                    />
                </View>
                {this.state.shouldAbsen
                    ? <View style={styles.absenView}>
                          <CameraPreview
                              image={this.state.data}
                              width={width}
                              height={height}
                              style={mergeStyles(
                                  styles.innerContent,
                                  styles.preview
                              )}
                          />
                          <View style={styles.absenButton}>
                              {buttons.map(btn =>
                                  <Button
                                      key={btn.actionParam}
                                      onPress={() =>
                                          this.submitAbsen(btn.actionParam)}
                                      text={btn.text}
                                  />
                              )}
                              <Button
                                  onPress={() =>
                                      this.setState({
                                          busy: false,
                                          shouldAbsen: false,
                                      })}
                                  text="Foto Ulang"
                              />
                          </View>
                      </View>
                    : null}
            </View>
        );
    }
}
