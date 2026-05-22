import { request } from "./request";
import type { User } from "./types";

export const getUser = (userId: number) => request<User>(`/api/users/${userId}`);
