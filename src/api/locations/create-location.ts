import { request } from "../core/request";
import type { CreateLocationRequest, CreateLocationResponse } from "../types";

export const createLocation = (body: CreateLocationRequest) =>
    request<CreateLocationResponse>("/api/locations", {
        method: "POST",
        body,
    });
