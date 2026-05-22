import { request } from "./request";
import type { LocationItem } from "./types";

export const getLocations = () => request<LocationItem[]>("/api/locations");
