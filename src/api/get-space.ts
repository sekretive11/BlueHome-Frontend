import { request } from "./request";
import type { SpaceItem } from "./types";

export const getSpace = (spaceId: number) => request<SpaceItem>(`/api/Spaces/${spaceId}`);
