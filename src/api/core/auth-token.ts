export const getAccessToken = () => {
    if (typeof localStorage === "undefined") {
        return null;
    }

    return localStorage.getItem("token");
};

export const setAccessToken = (token: string) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("token", token);
    }
};

export const removeAccessToken = () => {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem("token");
    }
};
