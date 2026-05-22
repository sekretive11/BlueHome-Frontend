import { request } from "../core/request";
import type { LampActionResponse } from "../types";

export const turnLampOff = (deviceId: number) =>
    request<LampActionResponse>("/api/lamp/off", {
        method: "POST",
        body: { deviceId },
    });
