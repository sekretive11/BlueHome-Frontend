import { request } from "../core";
import type { DeviceListItem } from "../types";

export const getDevicesByLocation = (locationId: number) =>
    request<DeviceListItem[]>(`/api/devices/location/${locationId}`);
