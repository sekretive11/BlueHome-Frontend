import { getAccessToken } from "./auth-token";
import { mockRequest } from "../mock/mock-api";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export type RequestOptions = Omit<RequestInit, "body" | "method"> & {
    body?: unknown;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    auth?: boolean;
};

const buildUrl = (endpoint: string) => {
    const baseUrl = API_URL.replace(/\/$/, "");
    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return `${baseUrl}${normalizedEndpoint}`;
};

const buildHeaders = (headers: HeadersInit | undefined, hasBody: boolean, auth: boolean) => {
    const nextHeaders = new Headers(headers);

    if (hasBody && !nextHeaders.has("Content-Type")) {
        nextHeaders.set("Content-Type", "application/json");
    }

    const token = getAccessToken();
    if (auth && token && !nextHeaders.has("Authorization")) {
        nextHeaders.set("Authorization", `Bearer ${token}`);
    }

    return nextHeaders;
};

const readResponse = async <T>(response: Response): Promise<T> => {
    if (response.status === 204) {
        return undefined as T;
    }

    const text = await response.text();
    if (!text) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
};

export const request = async <T>(endpoint: string, options: RequestOptions = {}) => {
    if (USE_MOCK_API) {
        return mockRequest<T>(endpoint, options);
    }

    const { body, method = "GET", headers, auth = true, ...fetchOptions } = options;
    const hasBody = body !== undefined;

    const response = await fetch(buildUrl(endpoint), {
        ...fetchOptions,
        method,
        headers: buildHeaders(headers, hasBody, auth),
        body: hasBody ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorText = await response.text();
        const details = errorText ? `: ${errorText}` : "";

        throw new Error(`Request ${method} ${endpoint} failed with ${response.status}${details}`);
    }

    return readResponse<T>(response);
};
