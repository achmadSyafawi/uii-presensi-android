// @flow

import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { mergeStyles } from '../utilities';

type LogoProps = {
  style?: StyleSheet.Style | Array<StyleSheet.Style>,
  width: number,
  height: number,
};

const createStyle = (width: number, height: number): StyleSheet =>
  StyleSheet.create({
    logo: {
      width,
      height,
    },
  });

const Logo = ({ style, width, height }: LogoProps) => {
  const styles = createStyle(width, height);
  return (
    <Image
      source={require('../asset/logo.png')}
      style={mergeStyles(style, styles.logo)}
    />
  );
};

Logo.defaultProps = {
  style: StyleSheet.create({}),
};

export default Logo;
