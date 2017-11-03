// @flow

import { Platform, Dimensions } from 'react-native';

export const isAndroid: boolean = Platform.OS === 'android';
export const isIOS: boolean = Platform.OS === 'ios';

export const mergeStyles = (...styles: T): T => [...styles];

export const getLocation = (additionalPayload?: Object): Promise<Object> =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                // eslint-disable-line
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude, ...(additionalPayload || {}) });
            },
            err => {
                reject(err);
            }
        );
    });

export const getDimensions = (): WindowDimension => {
    const windowDimensions = Dimensions.get('window');
    const height = windowDimensions.height;
    const width = windowDimensions.width;
    return { width, height };
};

export const getType = (typeEnum: string): number => {
    if (typeEnum === 'masuk') return 1;
    if (typeEnum === 'keluar') return 2;
    return 3;
};
