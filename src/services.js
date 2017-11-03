// @flow

import axios from 'axios';
import { AsyncStorage } from 'react-native';

import { getType } from './utilities';

export const createServices = (baseURL: string): Service => {
  const apiInstance = axios.create({
    baseURL,
  });

  const auth = (nidn: string, password: string): Promise<string> =>
    apiInstance
      .post('/login', {
        nidn,
        password,
      })
      .then(result => result.data.token);

  const checkAuth = (token: string): Promise<string> =>
    apiInstance
      .post('/cekToken', {
        token,
      })
      .then(() => token);
      
  const checkHoliday = (): Promise<boolean> =>
    apiInstance
      .post('/checkHoliday', {
        timestamp: Date.now(),
        })
      .then(result => result.data.holiday);

  const lookupLokasi = (
    lat: number,
    lng: number,
    token: string,
  ): Promise<LokasiResponse> =>
    apiInstance
      .post(
        '/absensi/cekLokasi',
      {
        lat,
        lng,
      },
      {
        headers: { token },
      },
      )
      .then(({ data }) => ({
        locationId: data.id,
        locationName: data.name,
      }));

  const performAbsen = (
    photo: string,
    locationId: string,
    timestamp: number,
    type: AbsenType,
    token: string,
  ): Promise<void> =>
    apiInstance.post(
      '/absen',
      {
        photo,
        id_lokasi: locationId,
        timestamp,
        type: getType(type),
      },
      {
        headers: {
          token,
        },
      },
    );

  return {
    auth,
    checkAuth,
    lookupLokasi,
    performAbsen,
    checkHoliday,
  };
};

export const createStorage = (namespace: string): Storage => {
  const set = (key: string, value: string): Promise<void> =>
    AsyncStorage.setItem(`${namespace}:${key}`, value);
  const get = (key: string): Promise<string> =>
    AsyncStorage.getItem(`${namespace}:${key}`);
  const remove = (key: string): Promise<void> =>
    AsyncStorage.removeItem(`${namespace}:${key}`);

  return {
    set,
    get,
    remove,
  };
};
