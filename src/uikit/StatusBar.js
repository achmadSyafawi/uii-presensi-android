// @flow

import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';

import { isIOS, mergeStyles } from '../utilities';

type Props = {
  backgroundColor?: string,
  style?: StyleSheet.Style | Array<StyleSheet.Style>,
};

const createStyle = (backgroundColor: string): StyleSheet.Style =>
  StyleSheet.create({
    statusBar: {
      height: isIOS ? 20 : 0,
      backgroundColor,
    },
  });

const CustomStatusBar = ({ backgroundColor, style, ...props }: Props) => {
  const styles = createStyle(backgroundColor);
  return (
    <View style={mergeStyles(styles.statusBar, style)}>
      <StatusBar {...props} />
    </View>
  );
};

CustomStatusBar.defaultProps = {
  backgroundColor: '#000',
  style: StyleSheet.create({}),
};

export default CustomStatusBar;
