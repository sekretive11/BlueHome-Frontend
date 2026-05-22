import { request } from "../core/request";
import type { LampActionResponse } from "../types";

export const turnLampOn = (deviceId: number) =>
    request<LampActionResponse>("/api/lamp/on", {
        method: "POST",
        body: { deviceId },
    });
