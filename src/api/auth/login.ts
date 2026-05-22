import { setAccessToken } from "../core/auth-token";
import { request } from "../core/request";
import type { LoginRequest, LoginResponse } from "../types";

export const login = async (body: LoginRequest) => {
    const response = await request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body,
        auth: false,
    });

    setAccessToken(response.accessToken);

    return response;
};
