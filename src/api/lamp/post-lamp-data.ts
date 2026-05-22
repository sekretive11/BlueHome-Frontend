import { setLampBrightness } from "./set-lamp-brightness";
import { turnLampOff } from "./turn-lamp-off";
import { turnLampOn } from "./turn-lamp-on";

export const postLampData = (
    deviceId: number,
    action: "on" | "off" | "brightness",
    brightness?: number,
) => {
    if (action === "on") {
        return turnLampOn(deviceId);
    }

    if (action === "off") {
        return turnLampOff(deviceId);
    }

    return setLampBrightness({
        deviceId,
        brightness: brightness ?? 50,
    });
};
