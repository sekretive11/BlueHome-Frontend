import { request } from "./request";
import type { RegisterDeviceRequest, RegisterDeviceResponse } from "./types";

export const registerDevice = (body: RegisterDeviceRequest) =>
    request<RegisterDeviceResponse>("/api/devices/register", {
        method: "POST",
        body,
    });
