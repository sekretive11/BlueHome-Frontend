import { request } from "../core/request";
import type { MoveDeviceToLocationRequest } from "../types";

export const moveDeviceToLocation = (body: MoveDeviceToLocationRequest) =>
    request<void>("/api/devices/move/location", {
        method: "POST",
        body,
    });
