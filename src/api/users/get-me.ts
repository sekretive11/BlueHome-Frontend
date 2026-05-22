import { request } from "../core/request";
import type { User } from "../types";

export const getMe = () => request<User>("/api/users/me");
