import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.style.scss";
import { ArrowLeft, ArrowRight, Menu, User } from "lucide-react";
import { server } from "../../api";
import { IconButton, Page, StatusMessage } from "../../components";
import type { DeviceDetails, LocationItem, SpaceItem } from "../../api/server";

export const HomePage = () => {
    const [enabled, setEnabled] = useState(true);
    const [brightness, setBrightness] = useState(65);
    const [device, setDevice] = useState<DeviceDetails | null>(null);
    const [space, setSpace] = useState<SpaceItem | null>(null);
    const [location, setLocation] = useState<LocationItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState("");
    const spaceId = Number(sessionStorage.getItem("currentSpace"));
    const locationId = Number(sessionStorage.getItem("currentLocation"));
    const navigate = useNavigate();

    const [devices, setDevices] = useState<DeviceDetails[] | null>(null);
    const [locations, setLocations] = useState<LocationItem[] | null>(null);

    const [deviceCounter, setDeviceCounter] = useState(0);
    const [locationCounter, setLocationCounter] = useState(0);

    const loadDashboard = async () => {
        setError("");
        setIsLoading(true);

        try {
            let spaceData: SpaceItem | SpaceItem[];

            if (spaceId) {
                spaceData = [await server.getSpace(spaceId)];
            } else {
                spaceData = await server.getSpaces();
            }
            setSpace(spaceData[0]);

            const locationData = await server.getLocationsBySpace(
                spaceData[0].spaceId,
            );

            setLocation(locationData[locationCounter]);
            setLocations(locationData);

            const devicesData = await server.getDevicesByLocation(
                locationData[locationCounter].locationId,
            );

            setDevice(devicesData[0]);

            setDevices(devicesData);
        } catch {
            setError("Не удалось загрузить устройства.");
        } finally {
            setIsLoading(false);
        }
    };

    console.log(devices);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadDashboard();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [locationCounter]);

    useEffect(() => {
        if (space) {
            sessionStorage.setItem("currentSpace", String(space?.spaceId));
        }
        if (location) {
            sessionStorage.setItem(
                "currentLocation",
                String(location?.locationId),
            );
        }
        if (device) {
            sessionStorage.setItem("currentDevice", String(device?.deviceId));
        }
    }, [space, location, device]);

    const syncDevice = async (deviceId: number) => {
        const nextDevice = await server.getDevice(deviceId);

        setDevice(nextDevice);
        // setEnabled(nextDevice.isOn);
        // setBrightness(nextDevice.brightness);
    };

    const handleSelectDevice = (direction: string) => {
        if (!devices || devices.length === 0) return;

        const nextIndex =
            direction === "left" ? deviceCounter - 1 : deviceCounter + 1;
        const clampedIndex = Math.max(
            0,
            Math.min(devices.length - 1, nextIndex),
        );

        setDeviceCounter(clampedIndex);
        setDevice(devices[clampedIndex]);
    };

    const handleSelectLocation = (direction: string) => {
        if (!locations || locations.length === 0) return;

        const nextIndex =
            direction === "left" ? locationCounter - 1 : locationCounter + 1;
        const clampedIndex = Math.max(
            0,
            Math.min(locations.length - 1, nextIndex),
        );
        setLocationCounter(clampedIndex);
        setLocation(locations[clampedIndex]);
    };

    const handlePowerChange = async (nextEnabled: boolean) => {
        if (!device) {
            return;
        }

        setEnabled(nextEnabled);
        setIsActionLoading(true);

        try {
            if (nextEnabled) {
                await server.turnLampOn(device.deviceId);
            } else {
                await server.turnLampOff(device.deviceId);
            }

            await syncDevice(device.deviceId);
        } catch {
            setError("Не удалось изменить состояние лампы.");
            // setEnabled(device.isOn);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBrightnessCommit = async () => {
        if (!device || !enabled) {
            return;
        }

        setIsActionLoading(true);

        try {
            await server.setLampBrightness({
                deviceId: device.deviceId,
                brightness,
            });
            await syncDevice(device.deviceId);
        } catch {
            setError("Не удалось изменить яркость.");
            // setBrightness(device.brightness);
        } finally {
            setIsActionLoading(false);
        }
    };

    const lampStyle = useMemo(() => {
        const opacity = enabled ? 0.45 + brightness / 180 : 0.2;

        const glow = enabled ? brightness : 0;

        return {
            opacity,
            filter: enabled
                ? `
          drop-shadow(0 0 ${glow / 2}px rgba(255,215,106,0.9))
          brightness(${0.7 + brightness / 100})
        `
                : "grayscale(0.5)",
        };
    }, [enabled, brightness]);

    return (
        <Page className="home-page">
            <header className="home-page__header">
                <IconButton onClick={() => navigate("/profile")}>
                    <User />
                </IconButton>

                {isLoading ? (
                    <h3>Загрузка...</h3>
                ) : (
                    <button
                        className="home-page__space-button"
                        onClick={() => navigate("/spaces")}
                    >
                        {space?.spaceName ?? "пространства"}
                    </button>
                )}

                <IconButton onClick={() => navigate("/rooms")}>
                    <Menu />
                </IconButton>
            </header>

            {isLoading ? (
                <StatusMessage variant="loading">
                    загружаем дом...
                </StatusMessage>
            ) : (
                <section className="home-page__content">
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        {locationCounter > 0 ? (
                            <ArrowLeft
                                className="arrow"
                                onClick={() => handleSelectLocation("left")}
                            />
                        ) : (
                            <div style={{ width: "24px" }}></div>
                        )}
                        <h2 className="home-page__device-title">
                            {isLoading
                                ? "загрузка..."
                                : (location?.locationName ??
                                  "комната не найдена")}
                        </h2>
                        {locations?.length &&
                        locationCounter !== locations?.length - 1 ? (
                            <ArrowRight
                                className="arrow"
                                onClick={() => handleSelectLocation("right")}
                            />
                        ) : (
                            <div style={{ width: "24px" }}></div>
                        )}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "20px",
                        }}
                    >
                        {deviceCounter > 0 ? (
                            <ArrowLeft
                                className="arrow"
                                onClick={() => handleSelectDevice("left")}
                            />
                        ) : (
                            <div style={{ width: "24px" }}></div>
                        )}
                        <div
                            className={`home-page__lamp-wrapper ${enabled ? "home-page__lamp-wrapper--active" : ""}`}
                            style={{
                                boxShadow: enabled
                                    ? `0 0 ${brightness}px rgba(255, 215, 106, 0.35)`
                                    : "none",
                            }}
                        >
                            <div
                                className={`home-page__lamp ${enabled ? "home-page__lamp--enabled" : "home-page__lamp--disabled"}`}
                                style={lampStyle}
                                onClick={() => {
                                    if (device) {
                                        navigate(`/device/${device.deviceId}`);
                                    }
                                }}
                            >
                                💡
                            </div>
                        </div>
                        {devices?.length &&
                        deviceCounter !== devices?.length - 1 ? (
                            <ArrowRight
                                className="arrow"
                                onClick={() => handleSelectDevice("right")}
                            />
                        ) : (
                            <div style={{ width: "24px" }}></div>
                        )}
                    </div>

                    <h2 className="home-page__device-title">
                        {isLoading
                            ? "загрузка..."
                            : (device?.deviceName ?? "лампа не найдена")}
                    </h2>

                    {error ? (
                        <StatusMessage variant="error">{error}</StatusMessage>
                    ) : (
                        <>
                            <div className="home-page__slider-block">
                                <div className="home-page__slider-header">
                                    <span className="home-page__slider-title">
                                        яркость
                                    </span>

                                    <span className="home-page__slider-value">
                                        {brightness}%
                                    </span>
                                </div>

                                <input
                                    disabled={
                                        !enabled || isLoading || isActionLoading
                                    }
                                    className="home-page__slider"
                                    type="range"
                                    min="0"
                                    max="99"
                                    value={brightness}
                                    onChange={(event) => {
                                        setBrightness(
                                            Number(event.target.value),
                                        );
                                    }}
                                    onMouseUp={() =>
                                        void handleBrightnessCommit()
                                    }
                                    onTouchEnd={() =>
                                        void handleBrightnessCommit()
                                    }
                                    onBlur={() => void handleBrightnessCommit()}
                                    style={{
                                        background: enabled
                                            ? `linear-gradient(
                                    to right,
                                    var(--primary) ${brightness}%,
                                    var(--border) ${brightness}%
                                )`
                                            : `linear-gradient(
                                    to right,
                                    #C8CCD6 ${brightness}%,
                                    var(--border) ${brightness}%
                                )`,
                                    }}
                                />
                            </div>

                            <div className="home-page__toggle">
                                <div
                                    className={`home-page__toggle-slider ${enabled ? "home-page__toggle-slider--enabled" : ""}`}
                                />

                                <button
                                    className="home-page__toggle-option"
                                    disabled={
                                        isLoading || isActionLoading || !device
                                    }
                                    onClick={() => void handlePowerChange(true)}
                                >
                                    ВКЛ
                                </button>

                                <button
                                    className="home-page__toggle-option"
                                    disabled={
                                        isLoading || isActionLoading || !device
                                    }
                                    onClick={() =>
                                        void handlePowerChange(false)
                                    }
                                >
                                    ВЫКЛ
                                </button>
                            </div>
                        </>
                    )}
                </section>
            )}
        </Page>
    );
};
