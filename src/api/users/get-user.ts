import { request } from "../core/request";
import type { User } from "../types";

export const getUser = (userId: number) => request<User>(`/api/users/${userId}`);
