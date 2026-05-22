import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.style.scss";
import { Menu, User } from "lucide-react";
import { server } from "../../api";
import type { DeviceDetails, DeviceListItem, SpaceItem } from "../../api/server";

export const HomePage = () => {
    const [enabled, setEnabled] = useState(true);
    const [brightness, setBrightness] = useState(65);
    const [device, setDevice] = useState<DeviceDetails | null>(null);
    const [space, setSpace] = useState<SpaceItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadDashboard = async () => {
        setError("");
        setIsLoading(true);

        try {
            const [devices, spaces] = await Promise.all([
                server.getDevices(),
                server.getSpaces(),
            ]);
            const lamp = devices.find(
                (item: DeviceListItem) => item.deviceType === "Lamp",
            );
            const nextDevice = lamp ? await server.getDevice(lamp.deviceId) : null;

            setDevice(nextDevice);
            setSpace(
                spaces.find((item) => item.spaceId === nextDevice?.spaceId) ??
                    spaces[0] ??
                    null,
            );

            if (nextDevice) {
                setEnabled(nextDevice.isOn);
                setBrightness(nextDevice.brightness);
            }
        } catch {
            setError("Не удалось загрузить устройства.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadDashboard();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const syncDevice = async (deviceId: number) => {
        const nextDevice = await server.getDevice(deviceId);

        setDevice(nextDevice);
        setEnabled(nextDevice.isOn);
        setBrightness(nextDevice.brightness);
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
            setEnabled(device.isOn);
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
            setBrightness(device.brightness);
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
        <main className="home-page">
            <header className="home-page__header">
                <button
                    className="home-page__icon-button"
                    onClick={() => navigate("/profile")}
                >
                    <User />
                </button>

                <button
                    className="home-page__space-button"
                    onClick={() => navigate("/spaces")}
                >
                    {space?.spaceName ?? "пространства"}
                </button>

                <button
                    className="home-page__icon-button"
                    onClick={() => navigate("/rooms")}
                >
                    <Menu />
                </button>
            </header>

            <section className="home-page__content">
                {isLoading && (
                    <p className="home-page__loading">загружаем дом...</p>
                )}

                {error && <p className="home-page__status">{error}</p>}

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

                <h2 className="home-page__device-title">
                    {isLoading
                        ? "загрузка..."
                        : device?.deviceName ?? "лампа не найдена"}
                </h2>

                <div className="home-page__slider-block">
                    <div className="home-page__slider-header">
                        <span className="home-page__slider-title">яркость</span>

                        <span className="home-page__slider-value">
                            {brightness}%
                        </span>
                    </div>

                    <input
                        disabled={!enabled || isLoading || isActionLoading}
                        className="home-page__slider"
                        type="range"
                        min="0"
                        max="99"
                        value={brightness}
                        onChange={(event) => {
                            setBrightness(Number(event.target.value));
                        }}
                        onMouseUp={() => void handleBrightnessCommit()}
                        onTouchEnd={() => void handleBrightnessCommit()}
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
                        disabled={isLoading || isActionLoading || !device}
                        onClick={() => void handlePowerChange(true)}
                    >
                        ВКЛ
                    </button>

                    <button
                        className="home-page__toggle-option"
                        disabled={isLoading || isActionLoading || !device}
                        onClick={() => void handlePowerChange(false)}
                    >
                        ВЫКЛ
                    </button>
                </div>
            </section>
        </main>
    );
};
