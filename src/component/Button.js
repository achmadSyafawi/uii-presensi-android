import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#82b2f4',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});

const Button = ({ onPress, text, style }) =>
  (<TouchableOpacity
    activeOpacity={0.5}
    onPress={onPress}
    style={[styles.button, style || {}]}
  >
    <Text style={styles.buttonText}>
      {text}
    </Text>
  </TouchableOpacity>);

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.number,
};

export default Button;
