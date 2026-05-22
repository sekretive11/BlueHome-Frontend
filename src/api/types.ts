import type { DeviceType } from "./device-types";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
};

export type RegisterDeviceRequest = {
    spaceId: number;
    locationId: number;
    name: string;
    type: DeviceType;
};

export type RegisterDeviceResponse = {
    id: number;
    name: string;
    type: DeviceType;
    spaceId: number;
    locationId: number;
};

export type MoveDeviceToSpaceRequest = {
    deviceId: number;
    spaceId: number;
};

export type MoveDeviceToLocationRequest = {
    deviceId: number;
    locationId: number;
};

export type DeviceListItem = {
    deviceId: number;
    spaceId: number;
    locationId: number;
    deviceName: string;
    status: string;
    deviceType: DeviceType | string;
};

export type DeviceDetails = {
    deviceId: number;
    spaceId: number;
    locationId: number;
    deviceName: string;
    deviceType: DeviceType | string;
    status: string;
    isOn: boolean;
    brightness: number;
};

export type LampActionResponse = {
    message: string;
};

export type LampBrightnessRequest = {
    deviceId: number;
    brightness: number;
};

export type LampBrightnessResponse = {
    deviceId: number;
    brightness: number;
};

export type CreateLocationRequest = {
    name: string;
    spaceId: number;
};

export type CreateLocationResponse = {
    id: number;
    name: string;
};

export type LocationItem = {
    locationId: number;
    locationName: string;
    spaceId: number;
};

export type CreateSpaceRequest = {
    name: string;
    type: string;
};

export type CreateSpaceResponse = {
    id: number;
    name: string;
    type: string;
};

export type SpaceItem = {
    spaceId: number;
    spaceName: string;
    spaceType: string;
    status: string;
    createdAt: string;
};

export type User = {
    userId: number;
    username: string;
    email: string;
    roleId: number;
};
