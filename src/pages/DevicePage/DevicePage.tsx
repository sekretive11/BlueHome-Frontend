import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./DevicePage.style.scss";
import { server } from "../../api";
import type { DeviceDetails, LocationItem, SpaceItem } from "../../api/server";

export const DevicePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [device, setDevice] = useState<DeviceDetails | null>(null);
    const [spaces, setSpaces] = useState<SpaceItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [brightness, setBrightness] = useState(50);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const loadDevice = async () => {
        setStatus("");
        setIsLoading(true);

        try {
            const [devices, nextSpaces, nextLocations] = await Promise.all([
                server.getDevices(),
                server.getSpaces(),
                server.getLocations(),
            ]);
            const requestedId = Number(id);
            const deviceId =
                requestedId || devices.find((item) => item.deviceType === "Lamp")?.deviceId;

            if (!deviceId) {
                setDevice(null);
                setSpaces(nextSpaces);
                setLocations(nextLocations);
                return;
            }

            const nextDevice = await server.getDevice(deviceId);

            setDevice(nextDevice);
            setBrightness(nextDevice.brightness);
            setSpaces(nextSpaces);
            setLocations(nextLocations);
        } catch {
            setStatus("Не удалось загрузить устройство.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadDevice();
        }, 0);

        return () => window.clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const deviceInfo = useMemo(
        () => [
            {
                id: 1,
                label: "тип",
                value: device?.deviceType ?? "—",
            },
            {
                id: 2,
                label: "статус",
                value: device?.status ?? "—",
            },
            {
                id: 3,
                label: "яркость",
                value: `${brightness}%`,
            },
        ],
        [brightness, device],
    );

    const isLamp = device?.deviceType === "Lamp";

    const handleLampPower = async (nextEnabled: boolean) => {
        if (!device || !isLamp) {
            return;
        }

        setIsActionLoading(true);

        try {
            if (nextEnabled) {
                await server.turnLampOn(device.deviceId);
            } else {
                await server.turnLampOff(device.deviceId);
            }

            const nextDevice = await server.getDevice(device.deviceId);
            setDevice(nextDevice);
            setStatus(nextEnabled ? "Лампа включена." : "Лампа выключена.");
        } catch {
            setStatus("Не удалось изменить состояние лампы.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBrightnessCommit = async () => {
        if (!device || !isLamp) {
            return;
        }

        setIsActionLoading(true);

        try {
            await server.setLampBrightness({
                deviceId: device.deviceId,
                brightness,
            });
            const nextDevice = await server.getDevice(device.deviceId);
            setDevice(nextDevice);
            setStatus("Яркость обновлена.");
        } catch {
            setStatus("Не удалось обновить яркость.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleMoveSpace = async (spaceId: number) => {
        if (!device) {
            return;
        }

        setIsActionLoading(true);

        try {
            await server.moveDeviceToSpace({
                deviceId: device.deviceId,
                spaceId,
            });
            const nextDevice = await server.getDevice(device.deviceId);
            setDevice(nextDevice);
            setStatus("Пространство обновлено.");
        } catch {
            setStatus("Не удалось переместить устройство.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleMoveLocation = async (locationId: number) => {
        if (!device) {
            return;
        }

        setIsActionLoading(true);

        try {
            await server.moveDeviceToLocation({
                deviceId: device.deviceId,
                locationId,
            });
            const nextDevice = await server.getDevice(device.deviceId);
            setDevice(nextDevice);
            setStatus("Комната обновлена.");
        } catch {
            setStatus("Не удалось переместить устройство.");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <main className="device-info-page">
            <header className="device-info-page__header">
                <button
                    className="device-info-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1 className="device-info-page__title">устройство</h1>

                <div className="device-info-page__placeholder" />
            </header>

            <section className="device-info-page__device-card">
                <div className="device-info-page__lamp-wrapper">
                    <div className="device-info-page__lamp">💡</div>
                </div>

                <h2 className="device-info-page__device-name">
                    {isLoading
                        ? "загрузка..."
                        : device?.deviceName ?? "устройство не найдено"}
                </h2>

                <span className="device-info-page__device-subtitle">
                    {isLoading ? "получаем данные" : device?.deviceType ?? "нет данных"}
                </span>
            </section>

            {isLoading && (
                <p className="device-info-page__loading">загружаем устройство...</p>
            )}

            {status && <p className="device-info-page__status">{status}</p>}

            <section className="device-info-page__info-list">
                {deviceInfo.map((item) => (
                    <div key={item.id} className="device-info-page__info-card">
                        <span className="device-info-page__info-label">
                            {item.label}
                        </span>

                        <span className="device-info-page__info-value">
                            {item.value}
                        </span>
                    </div>
                ))}
            </section>

            <section className="device-info-page__move-list">
                <select
                    className="device-info-page__select"
                    value={device?.spaceId ?? 0}
                    disabled={isLoading || isActionLoading || !device}
                    onChange={(event) =>
                        void handleMoveSpace(Number(event.target.value))
                    }
                >
                    {spaces.map((space) => (
                        <option key={space.spaceId} value={space.spaceId}>
                            {space.spaceName}
                        </option>
                    ))}
                </select>

                <select
                    className="device-info-page__select"
                    value={device?.locationId ?? 0}
                    disabled={isLoading || isActionLoading || !device}
                    onChange={(event) =>
                        void handleMoveLocation(Number(event.target.value))
                    }
                >
                    {locations.map((location) => (
                        <option
                            key={location.locationId}
                            value={location.locationId}
                        >
                            {location.locationName}
                        </option>
                    ))}
                </select>
            </section>

            {isLamp && (
                <section className="device-info-page__lamp-actions">
                    <input
                        className="device-info-page__range"
                        type="range"
                        min="0"
                        max="99"
                        value={brightness}
                        disabled={isLoading || isActionLoading}
                        onChange={(event) => setBrightness(Number(event.target.value))}
                        onMouseUp={() => void handleBrightnessCommit()}
                        onTouchEnd={() => void handleBrightnessCommit()}
                        onBlur={() => void handleBrightnessCommit()}
                    />

                    <div className="device-info-page__power-row">
                        <button
                            className="device-info-page__primary-button"
                            disabled={isLoading || isActionLoading}
                            onClick={() => void handleLampPower(true)}
                        >
                            {isActionLoading ? "..." : "включить"}
                        </button>

                        <button
                            className="device-info-page__danger-button"
                            disabled={isLoading || isActionLoading}
                            onClick={() => void handleLampPower(false)}
                        >
                            {isActionLoading ? "..." : "выключить"}
                        </button>
                    </div>
                </section>
            )}

            <section className="device-info-page__actions">
                <button
                    className="device-info-page__primary-button"
                    onClick={() => navigate("/devices")}
                >
                    все устройства
                </button>
            </section>
        </main>
    );
};
