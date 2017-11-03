// @flow

import React from 'react';
import { View, TextInput, Text } from 'react-native';

type Props = {
  label?: string,
  isError?: boolean,
};

// const styles = StyleSheet.create({});

const Input = ({ label, isError, ...props }: Props) =>
  (<View>
    {label.length
      ? <Text>
        {label}
      </Text>
      : null}
    <TextInput {...props} />
  </View>);

Input.defaultProps = {
  label: '',
  isError: false,
};

export default Input;
