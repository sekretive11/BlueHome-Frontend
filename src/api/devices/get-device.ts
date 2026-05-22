import { request } from "../core/request";
import type { DeviceDetails } from "../types";

export const getDevice = (id: number) => request<DeviceDetails>(`/api/devices/${id}`);
