import { request, type RequestOptions } from "./request";

export const getData = <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(endpoint, { ...options, method: "GET" });
