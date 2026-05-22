import { request, type RequestOptions } from "./request";

export const postData = <T, Body = unknown>(
    endpoint: string,
    body?: Body,
    options?: Omit<RequestOptions, "method" | "body">,
) => request<T>(endpoint, { ...options, method: "POST", body });
