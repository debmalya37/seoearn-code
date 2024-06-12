import { v4 as uuidv4 } from 'uuid';

export const getStoredDeviceIdentifier = (): string | null => {
  return localStorage.getItem('deviceIdentifier');
};

export const getDeviceIdentifier = (): string => {
  let deviceIdentifier = getStoredDeviceIdentifier();
  if (!deviceIdentifier) {
    deviceIdentifier = uuidv4();
    localStorage.setItem('deviceIdentifier', deviceIdentifier);
  }
  return deviceIdentifier;
};
