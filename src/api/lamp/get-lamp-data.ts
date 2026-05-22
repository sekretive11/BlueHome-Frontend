import { getDevice } from "../devices/get-device";
import type { DeviceDetails } from "../types";

export const getLampData = (deviceId: number) => getDevice(deviceId) as Promise<DeviceDetails>;
