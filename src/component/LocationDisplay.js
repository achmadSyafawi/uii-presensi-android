// @flow

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { getLocation, mergeStyles } from '../utilities';
import Button from '../component/Button';

const DEFAULT_FONT_SIZE = 20;

const createStyle = (fontSize: number | void): StyleSheet.Style =>
    StyleSheet.create({
        wrapper: {
            backgroundColor: 'transparent',
            padding: 20,
        },
        text: {
            fontSize: fontSize || DEFAULT_FONT_SIZE,
            fontWeight: 'bold',
            color: '#FFF',
            textAlign: 'center',
        },
        note: {
            fontSize: 12,
            fontWeight: 'normal',
            color: '#FFF',
            textAlign: 'center',
        },
    });

export default class LocationDisplay extends Component {
    static defaultProps = {
        size: DEFAULT_FONT_SIZE,
        style: StyleSheet.create({}),
    };

    state = {
        locationName: '',
        locationFound: false,
    };

    componentWillMount() {
        this.lookupLokasi().catch(err => {
            console.log('error cok', err);
        });
    }

    props: {
        onLocationFound: Function,
        size?: number,
        style?: StyleSheet.Style | Array<StyleSheet.Style>,
        screenProps: DeviceProps,
    };

    lookupLokasi() {
        const { storage, service } = this.props.screenProps;
        this.setState({
            locationName: 'Mencari ...',
            locationFound: true,
        });
        return storage
            .get('token')
            .then(token => getLocation({ token }))
            .then(({ latitude, longitude, token }) =>
                service.lookupLokasi(latitude, longitude, token)
            )
            .then(({ locationId, locationName }) => {
                this.setState({ locationName, locationFound: true });
                this.props.onLocationFound({ locationId });
            })
            .catch(err => {
                this.setState({
                    locationFound: false,
                });
            });
    }

    render() {
        const { locationName, locationFound } = this.state;
        const { size, style } = this.props;
        const styles = createStyle(size);
        return (
            <View style={mergeStyles(styles.wrapper, style)}>
                {locationFound
                    ? <Text style={styles.text}>
                          {locationName}
                          <Text style={styles.note}>
                              {'\n'} {'\n'}Mengambil gambar harus memperlihatkan
                              wajah
                          </Text>
                      </Text>
                    : <Button
                          onPress={() => this.lookupLokasi()}
                          text="Mencari Lokasi"
                      />}
            </View>
        );
    }
}
