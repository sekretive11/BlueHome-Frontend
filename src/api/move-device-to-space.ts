import { request } from "./request";
import type { MoveDeviceToSpaceRequest } from "./types";

export const moveDeviceToSpace = (body: MoveDeviceToSpaceRequest) =>
    request<void>("/api/devices/move/space", {
        method: "POST",
        body,
    });
