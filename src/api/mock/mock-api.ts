import type {
    CreateLocationRequest,
    CreateSpaceRequest,
    DeviceDetails,
    DeviceListItem,
    LocationItem,
    LoginRequest,
    MoveDeviceToLocationRequest,
    MoveDeviceToSpaceRequest,
    RegisterDeviceRequest,
    SpaceItem,
    User,
} from "../types";
import type { RequestOptions } from "../core/request";

type MockState = {
    devices: DeviceDetails[];
    locations: LocationItem[];
    spaces: SpaceItem[];
    users: User[];
    currentUserId: number;
};

const MOCK_STORAGE_KEY = "blue-home-mock-api";

const defaultState: MockState = {
    currentUserId: 1,
    users: [
        {
            userId: 1,
            username: "Администратор",
            email: "admin",
            roleId: 1,
        },
        {
            userId: 2,
            username: "Дмитрий",
            email: "dmitry@example.com",
            roleId: 2,
        },
    ],
    spaces: [
        {
            spaceId: 5,
            spaceName: "Дом",
            spaceType: "home",
            status: "active",
            createdAt: "2026-05-12T22:07:40.339598Z",
        },
        {
            spaceId: 6,
            spaceName: "Офис",
            spaceType: "work",
            status: "active",
            createdAt: "2026-05-16T05:57:50.928288Z",
        },
    ],
    locations: [
        {
            locationId: 9,
            locationName: "Кухня",
            spaceId: 5,
        },
        {
            locationId: 10,
            locationName: "Гостиная",
            spaceId: 5,
        },
        {
            locationId: 11,
            locationName: "Кабинет",
            spaceId: 6,
        },
    ],
    devices: [
        {
            deviceId: 8,
            spaceId: 5,
            locationId: 10,
            deviceName: "Основная лампа",
            deviceType: "Lamp",
            status: "online",
            isOn: true,
            brightness: 65,
        },
        {
            deviceId: 9,
            spaceId: 5,
            locationId: 9,
            deviceName: "Розетка чайника",
            deviceType: "Socket",
            status: "online",
            isOn: true,
            brightness: 50,
        },
        {
            deviceId: 10,
            spaceId: 6,
            locationId: 11,
            deviceName: "Датчик двери",
            deviceType: "DoorSensor",
            status: "offline",
            isOn: false,
            brightness: 50,
        },
    ],
};

const cloneDefaultState = () => structuredClone(defaultState);

const getState = () => {
    if (typeof localStorage === "undefined") {
        return cloneDefaultState();
    }

    const storedState = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!storedState) {
        const nextState = cloneDefaultState();
        saveState(nextState);

        return nextState;
    }

    return JSON.parse(storedState) as MockState;
};

const saveState = (state: MockState) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(state));
    }
};

const getNextId = (ids: number[]) => Math.max(0, ...ids) + 1;

const createError = (message: string) => new Error(`Mock API: ${message}`);

const normalizeEndpoint = (endpoint: string) => {
    const url = new URL(endpoint, "http://mock.local");

    return url.pathname;
};

const toDeviceListItem = (device: DeviceDetails): DeviceListItem => ({
    deviceId: device.deviceId,
    spaceId: device.spaceId,
    locationId: device.locationId,
    deviceName: device.deviceName,
    status: device.status,
    deviceType: device.deviceType,
});

export const mockRequest = async <T>(endpoint: string, options: RequestOptions = {}) => {
    const method = options.method ?? "GET";
    const path = normalizeEndpoint(endpoint);
    const state = getState();

    await new Promise((resolve) => {
        window.setTimeout(resolve, 120);
    });

    if (path === "/api/auth/login" && method === "POST") {
        const body = options.body as LoginRequest;
        if (!body.email || !body.password) {
            throw createError("email and password are required");
        }

        return { accessToken: "mock-access-token" } as T;
    }

    if (path === "/api/devices/register" && method === "POST") {
        const body = options.body as RegisterDeviceRequest;
        const deviceId = getNextId(state.devices.map((device) => device.deviceId));

        state.devices.push({
            deviceId,
            spaceId: body.spaceId,
            locationId: body.locationId,
            deviceName: body.name,
            deviceType: body.type,
            status: "online",
            isOn: true,
            brightness: 50,
        });
        saveState(state);

        return {
            id: deviceId,
            name: body.name,
            type: body.type,
            spaceId: body.spaceId,
            locationId: body.locationId,
        } as T;
    }

    if (path === "/api/devices/move/space" && method === "POST") {
        const body = options.body as MoveDeviceToSpaceRequest;
        const device = state.devices.find((item) => item.deviceId === body.deviceId);

        if (!device) {
            throw createError("device not found");
        }

        device.spaceId = body.spaceId;
        saveState(state);

        return undefined as T;
    }

    if (path === "/api/devices/move/location" && method === "POST") {
        const body = options.body as MoveDeviceToLocationRequest;
        const device = state.devices.find((item) => item.deviceId === body.deviceId);
        const location = state.locations.find((item) => item.locationId === body.locationId);

        if (!device || !location) {
            throw createError("device or location not found");
        }

        device.locationId = body.locationId;
        device.spaceId = location.spaceId;
        saveState(state);

        return undefined as T;
    }

    if (path === "/api/devices" && method === "GET") {
        return state.devices.map(toDeviceListItem) as T;
    }

    const deviceMatch = path.match(/^\/api\/devices\/(\d+)$/);
    if (deviceMatch && method === "GET") {
        const device = state.devices.find((item) => item.deviceId === Number(deviceMatch[1]));

        if (!device) {
            throw createError("device not found");
        }

        return device as T;
    }

    if (path === "/api/lamp/on" && method === "POST") {
        const body = options.body as { deviceId: number };
        const device = state.devices.find((item) => item.deviceId === body.deviceId);

        if (!device) {
            throw createError("device not found");
        }

        device.isOn = true;
        device.status = "online";
        saveState(state);

        return { message: "Lamp turned ON" } as T;
    }

    if (path === "/api/lamp/off" && method === "POST") {
        const body = options.body as { deviceId: number };
        const device = state.devices.find((item) => item.deviceId === body.deviceId);

        if (!device) {
            throw createError("device not found");
        }

        device.isOn = false;
        device.status = "offline";
        saveState(state);

        return { message: "Lamp turned OFF" } as T;
    }

    if (path === "/api/lamp/brightness" && method === "POST") {
        const body = options.body as { deviceId: number; brightness: number };
        const device = state.devices.find((item) => item.deviceId === body.deviceId);

        if (!device) {
            throw createError("device not found");
        }

        device.brightness = body.brightness;
        saveState(state);

        return {
            deviceId: body.deviceId,
            brightness: body.brightness,
        } as T;
    }

    if (path === "/api/locations" && method === "POST") {
        const body = options.body as CreateLocationRequest;
        const locationId = getNextId(state.locations.map((location) => location.locationId));

        state.locations.push({
            locationId,
            locationName: body.name,
            spaceId: body.spaceId,
        });
        saveState(state);

        return {
            id: locationId,
            name: body.name,
        } as T;
    }

    if (path === "/api/locations" && method === "GET") {
        return state.locations as T;
    }

    const locationMatch = path.match(/^\/api\/locations\/(\d+)$/);
    if (locationMatch && method === "GET") {
        const location = state.locations.find((item) => item.locationId === Number(locationMatch[1]));

        if (!location) {
            throw createError("location not found");
        }

        return location as T;
    }

    if (path === "/api/Spaces" && method === "POST") {
        const body = options.body as CreateSpaceRequest;
        const spaceId = getNextId(state.spaces.map((space) => space.spaceId));

        state.spaces.push({
            spaceId,
            spaceName: body.name,
            spaceType: body.type,
            status: "active",
            createdAt: new Date().toISOString(),
        });
        saveState(state);

        return {
            id: spaceId,
            name: body.name,
            type: body.type,
        } as T;
    }

    if (path === "/api/Spaces" && method === "GET") {
        return state.spaces as T;
    }

    const spaceMatch = path.match(/^\/api\/Spaces\/(\d+)$/);
    if (spaceMatch && method === "GET") {
        const space = state.spaces.find((item) => item.spaceId === Number(spaceMatch[1]));

        if (!space) {
            throw createError("space not found");
        }

        return space as T;
    }

    const userMatch = path.match(/^\/api\/users\/(\d+)$/);
    if (userMatch && method === "GET") {
        const user = state.users.find((item) => item.userId === Number(userMatch[1]));

        if (!user) {
            throw createError("user not found");
        }

        return user as T;
    }

    if (path === "/api/users/me" && method === "GET") {
        const user = state.users.find((item) => item.userId === state.currentUserId);

        if (!user) {
            throw createError("current user not found");
        }

        return user as T;
    }

    throw createError(`${method} ${path} is not implemented`);
};
