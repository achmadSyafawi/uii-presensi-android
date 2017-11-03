// @flow

import React from 'react';
import { StyleSheet, Image } from 'react-native';

import { mergeStyles } from '../utilities';

const createStyle = (width: number, height: number) =>
  StyleSheet.create({
    preview: {
      width: height,
      height: width,
      // transform: [{ rotateY: '-90deg' }],
    },
  });

const CameraPreview = ({
  image,
  width,
  height,
  style,
}: {
  image: string,
  width: number,
  height: number,
  style?: StyleSheet.Style | Array<StyleSheet.Style>,
}) => {
  const uri = `data:image/jpg;base64,${image}`;
  const styles = createStyle(width, height);
  return <Image style={mergeStyles(styles.preview, style)} source={{ uri }} />;
};

CameraPreview.defaultProps = {
  style: StyleSheet.create({}),
};

export default CameraPreview;
