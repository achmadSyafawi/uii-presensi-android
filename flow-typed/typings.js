declare type AbsenType = 'masuk' | 'ijin' | 'pulang';

declare type LokasiResponse = {
  locationId: string,
  locationName: string,
};

declare type WindowDimension = {
  width: number,
  height: number,
};

declare type Service = {
  auth(nidn: string, password: string): Promise<string>,
  checkAuth(token: string): Promise<string>,
  lookupLokasi(
    lat: number,
    lng: number,
    token: string,
  ): Promise<LokasiResponse>,
  performAbsen(
    photo: string,
    locationId: string,
    timestamp: number,
    type: AbsenType,
    token: string,
  ): Promise<void>,
  checkHoliday(): Promise<Boolean>,
};

declare type Storage = {
  get(key: string): Promise<string>,
  set(key: string, value: string): Promise<void>,
  remove(key: string): Promise<void>,
};

declare type DeviceProps = {
  service: Service,
  storage: Storage,
};
