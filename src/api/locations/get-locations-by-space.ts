import { request } from "../core";
import type { LocationItem } from "../types";

export const getLocationsBySpace = (spaceId: number) =>
    request<LocationItem[]>(`/api/locations/space/${spaceId}`);
