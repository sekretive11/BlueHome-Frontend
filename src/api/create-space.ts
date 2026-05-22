import { request } from "./request";
import type { CreateSpaceRequest, CreateSpaceResponse } from "./types";

export const createSpace = (body: CreateSpaceRequest) =>
    request<CreateSpaceResponse>("/api/Spaces", {
        method: "POST",
        body,
    });
