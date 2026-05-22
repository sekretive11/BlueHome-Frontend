const TOKEN_STORAGE_KEY = "accessToken";

export const getAccessToken = () => {
    if (typeof localStorage === "undefined") {
        return null;
    }

    return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAccessToken = (token: string) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
};

export const removeAccessToken = () => {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
};
