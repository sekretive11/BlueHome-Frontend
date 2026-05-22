import { request } from "../core/request";
import type { DeviceListItem } from "../types";

export const getDevices = () => request<DeviceListItem[]>("/api/devices");
