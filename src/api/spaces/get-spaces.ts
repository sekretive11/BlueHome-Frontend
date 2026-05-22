import { request } from "../core/request";
import type { SpaceItem } from "../types";

export const getSpaces = () => request<SpaceItem[]>("/api/Spaces");
