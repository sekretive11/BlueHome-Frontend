export const deviceTypes = ["Lamp"] as const;

export type DeviceType = (typeof deviceTypes)[number];
