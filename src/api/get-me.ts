import { request } from "./request";
import type { User } from "./types";

export const getMe = () => request<User>("/api/users/me");
