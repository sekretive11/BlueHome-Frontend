export const postLampData = async (
    deviceId: number,
    eventType: "DevicePoweredOffEvent" | "DevicePoweredOnEvent" | "DeviceBrightnessChanged",
    description: "Device powered On" | "Device powered Off" | `Device set to ${}`,
) => {
    try {
        const response = await fetch(`/api/lamp/${deviceId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description,  eventType }),
        });

        if (!response.ok) {
            throw new Error(`Failed to post lamp data: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error posting lamp data:", error);
        throw error;
    }
};
