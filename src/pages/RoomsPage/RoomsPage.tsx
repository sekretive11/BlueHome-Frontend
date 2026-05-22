import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./RoomsPage.style.scss";
import { useNavigate } from "react-router-dom";
import { server } from "../../api";
import type { DeviceListItem, LocationItem, SpaceItem } from "../../api/server";

export const RoomsPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<LocationItem[]>([]);
    const [spaces, setSpaces] = useState<SpaceItem[]>([]);
    const [devices, setDevices] = useState<DeviceListItem[]>([]);
    const [name, setName] = useState("");
    const [spaceId, setSpaceId] = useState(0);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async (showLoader = true) => {
        setStatus("");

        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const [nextRooms, nextSpaces, nextDevices] = await Promise.all([
                server.getLocations(),
                server.getSpaces(),
                server.getDevices(),
            ]);

            setRooms(nextRooms);
            setSpaces(nextSpaces);
            setDevices(nextDevices);
            setSpaceId((current) => current || nextSpaces[0]?.spaceId || 0);
        } catch {
            setStatus("Не удалось загрузить комнаты.");
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
    }, []);

    const getDevicesCount = (locationId: number) =>
        devices.filter((device) => device.locationId === locationId).length;

    const handleOpenRoom = async (locationId: number) => {
        try {
            await server.getLocation(locationId);
            navigate(`/devices?locationId=${locationId}`);
        } catch {
            setStatus("Комната не найдена.");
        }
    };

    const handleCreateRoom = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim() || !spaceId) {
            setStatus("Заполните название и пространство.");
            return;
        }

        setIsSubmitting(true);

        try {
            await server.createLocation({
                name: name.trim(),
                spaceId,
            });
            setName("");
            setStatus("Комната добавлена.");
            await loadData(false);
        } catch {
            setStatus("Не удалось добавить комнату.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="rooms-page">
            <header className="rooms-page__header">
                <button
                    className="rooms-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft />
                </button>

                <h1 className="rooms-page__title">комнаты</h1>

                <div className="rooms-page__placeholder" />
            </header>

            <form
                className="rooms-page__form"
                onSubmit={(event) => void handleCreateRoom(event)}
            >
                <input
                    className="rooms-page__input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Название комнаты"
                    disabled={isSubmitting}
                />

                <select
                    className="rooms-page__input"
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

                <button
                    className="rooms-page__add-button"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "добавляем..." : "+ добавить комнату"}
                </button>
            </form>

            {status && <p className="rooms-page__status">{status}</p>}

            <section className="rooms-page__content">
                {isLoading && (
                    <p className="rooms-page__loading">загружаем комнаты...</p>
                )}

                {!isLoading && rooms.map((room) => (
                    <button
                        key={room.locationId}
                        className="rooms-page__room-card"
                        onClick={() => void handleOpenRoom(room.locationId)}
                    >
                        <div className="rooms-page__room-info">
                            <h2 className="rooms-page__room-title">
                                {room.locationName}
                            </h2>

                            <span className="rooms-page__room-devices">
                                устройств: {getDevicesCount(room.locationId)}
                            </span>
                        </div>

                        <div className="rooms-page__room-arrow">
                            <ArrowRight />
                        </div>
                    </button>
                ))}

                {!isLoading && !rooms.length && (
                    <p className="rooms-page__empty">Комнат пока нет.</p>
                )}
            </section>
        </main>
    );
};
