import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import "./DevicesPage.style.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { server } from "../../api";
import type {
    DeviceListItem,
    DeviceType,
    LocationItem,
    SpaceItem,
} from "../../api/server";

export const DevicesPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const locationId = Number(searchParams.get("locationId"));
    const [devices, setDevices] = useState<DeviceListItem[]>([]);
    const [spaces, setSpaces] = useState<SpaceItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [name, setName] = useState("");
    const [type, setType] = useState<DeviceType>("Lamp");
    const [spaceId, setSpaceId] = useState(0);
    const [selectedLocationId, setSelectedLocationId] = useState(0);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const visibleDevices = useMemo(() => {
        if (!locationId) {
            return devices;
        }

        return devices.filter((device) => device.locationId === locationId);
    }, [devices, locationId]);

    const loadData = async (showLoader = true) => {
        setStatus("");

        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const [nextDevices, nextSpaces, nextLocations] = await Promise.all([
                server.getDevices(),
                server.getSpaces(),
                server.getLocations(),
            ]);

            setDevices(nextDevices);
            setSpaces(nextSpaces);
            setLocations(nextLocations);
            setSpaceId((current) => current || nextSpaces[0]?.spaceId || 0);
            setSelectedLocationId(
                (current) =>
                    current ||
                    (locationId || nextLocations[0]?.locationId || 0),
            );
        } catch {
            setStatus("Не удалось загрузить устройства.");
        } finally {
            if (showLoader) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadData();
        }, 0);

        return () => window.clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const locationsBySpace = useMemo(
        () =>
            locations.filter((location) =>
                spaceId ? location.spaceId === spaceId : true,
            ),
        [locations, spaceId],
    );

    const handleCreateDevice = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextLocationId =
            selectedLocationId || locationsBySpace[0]?.locationId || 0;

        if (!name.trim() || !spaceId || !nextLocationId) {
            setStatus("Заполните название, пространство и комнату.");
            return;
        }

        setIsSubmitting(true);

        try {
            await server.registerDevice({
                name: name.trim(),
                type,
                spaceId,
                locationId: nextLocationId,
            });
            setName("");
            setType("Lamp");
            setStatus("Устройство добавлено.");
            await loadData(false);
        } catch {
            setStatus("Не удалось добавить устройство.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="devices-page">
            <header className="devices-page__header">
                <button
                    className="devices-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft />
                </button>

                <h1 className="devices-page__title">устройства</h1>

                <div className="devices-page__placeholder" />
            </header>

            <form
                className="devices-page__form"
                onSubmit={(event) => void handleCreateDevice(event)}
            >
                <input
                    className="devices-page__input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Название устройства"
                    disabled={isSubmitting}
                />

                <select
                    className="devices-page__input"
                    value={type}
                    onChange={(event) => setType(event.target.value as DeviceType)}
                    disabled={isSubmitting}
                >
                    {server.deviceTypes.map((deviceType) => (
                        <option key={deviceType} value={deviceType}>
                            {deviceType}
                        </option>
                    ))}
                </select>

                <div className="devices-page__form-row">
                    <select
                        className="devices-page__input"
                        value={spaceId}
                        onChange={(event) => setSpaceId(Number(event.target.value))}
                        disabled={isSubmitting}
                    >
                        {spaces.map((space) => (
                            <option key={space.spaceId} value={space.spaceId}>
                                {space.spaceName}
                            </option>
                        ))}
                    </select>

                    <select
                        className="devices-page__input"
                        value={selectedLocationId}
                        onChange={(event) =>
                            setSelectedLocationId(Number(event.target.value))
                        }
                        disabled={isSubmitting}
                    >
                        {locationsBySpace.map((location) => (
                            <option
                                key={location.locationId}
                                value={location.locationId}
                            >
                                {location.locationName}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="devices-page__add-button"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "добавляем..." : "+ добавить устройство"}
                </button>
            </form>

            {status && <p className="devices-page__status">{status}</p>}

            <section className="devices-page__content">
                {isLoading && (
                    <p className="devices-page__loading">загружаем устройства...</p>
                )}

                {!isLoading && visibleDevices.map((device) => (
                    <button
                        key={device.deviceId}
                        className="devices-page__room-card"
                        onClick={() => navigate(`/device/${device.deviceId}`)}
                    >
                        <div className="devices-page__room-info">
                            <h2 className="devices-page__room-title">
                                {device.deviceName}
                            </h2>

                            <span className="devices-page__room-devices">
                                {device.deviceType} · {device.status}
                            </span>
                        </div>

                        <div className="devices-page__room-arrow">Открыть</div>
                    </button>
                ))}

                {!isLoading && !visibleDevices.length && (
                    <p className="devices-page__empty">Устройств пока нет.</p>
                )}
            </section>
        </main>
    );
};
