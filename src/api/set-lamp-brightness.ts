import { request } from "./request";
import type { LampBrightnessRequest, LampBrightnessResponse } from "./types";

export const setLampBrightness = (body: LampBrightnessRequest) =>
    request<LampBrightnessResponse>("/api/lamp/brightness", {
        method: "POST",
        body,
    });
