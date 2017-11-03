// @flow

import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createAnimatableComponent } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

import { mergeStyles } from '../utilities';

type Props = {
    onPress: Function,
    width: number,
    height: number,
    pause: boolean,
    iconStyle?: StyleSheet.Style | Array<StyleSheet.Style>,
};

const createStyle = (width: number, height: number) =>
    StyleSheet.create({
        container: {
            width: width + 20,
            height: height + 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        shutter: {
            backgroundColor: 'transparent',
            width,
            height,
            borderRadius: width / 2,
            elevation: 10,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#222',
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowRadius: 1,
            shadowOpacity: 1,
        },
        icon: {
            fontSize: 20,
            color: '#222',
        },
        shutterGradient: {
            width,
            height,
            padding: 20,
        },
    });

const AnimatedGradient = createAnimatableComponent(LinearGradient);

const LogoutButton = ({ onPress, width, height, pause, iconStyle }: Props) => {
    const styles = createStyle(width, height);
    const ShutterIcon = (
        <Icon name="sign-out" style={mergeStyles(styles.icon, iconStyle)} />
    );
    let Shutter = (
        <AnimatedGradient
            // animation="pulse"
            // easing="ease-in-out"
            colors={['#FAFAFA', '#DDD', '#EAEAEA']}
            iterationCount="infinite"
            style={styles.shutter}
        >
            {ShutterIcon}
        </AnimatedGradient>
    );
    if (pause) {
        Shutter = (
            <LinearGradient
                style={styles.shutter}
                colors={['#4c669f', '#3b5998', '#192f6a']}
            >
                {ShutterIcon}
            </LinearGradient>
        );
    }
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            {Shutter}
        </TouchableOpacity>
    );
};

LogoutButton.defaultProps = {
    iconStyle: StyleSheet.create({}),
};

export default LogoutButton;
