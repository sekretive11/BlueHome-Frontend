import { request } from "../core/request";
import type { LocationItem } from "../types";

export const getLocation = (locationId: number) => request<LocationItem>(`/api/locations/${locationId}`);
