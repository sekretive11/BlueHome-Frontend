export const deviceTypes = [
    "Lamp",
    "Socket",
    "Thermostat",
    "LightSensor",
    "DoorSensor",
    "LeakSensor",
    "Cornise",
] as const;

export type DeviceType = (typeof deviceTypes)[number];
