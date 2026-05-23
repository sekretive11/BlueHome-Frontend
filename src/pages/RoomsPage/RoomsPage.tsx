import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./RoomsPage.style.scss";
import { useNavigate } from "react-router-dom";
import { server } from "../../api";
import {
    ActionButton,
    EntityCard,
    IconButton,
    Page,
    PageHeader,
    SelectField,
    StatusMessage,
    TextField,
} from "../../components";
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
        <Page className="rooms-page">
            <PageHeader
                title="комнаты"
                leftSlot={
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </IconButton>
                }
            />

            {!isLoading && <form
                className="rooms-page__form"
                onSubmit={(event) => void handleCreateRoom(event)}
            >
                <TextField
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Название комнаты"
                    disabled={isSubmitting}
                />

                <SelectField
                    value={spaceId}
                    onChange={(event) => setSpaceId(Number(event.target.value))}
                    disabled={isSubmitting}
                >
                    {spaces.map((space) => (
                        <option key={space.spaceId} value={space.spaceId}>
                            {space.spaceName}
                        </option>
                    ))}
                </SelectField>

                <ActionButton
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "добавляем..." : "+ добавить комнату"}
                </ActionButton>
            </form>}

            {status && <StatusMessage>{status}</StatusMessage>}

            <section className="rooms-page__content">
                {isLoading && (
                    <StatusMessage variant="loading">
                        загружаем комнаты...
                    </StatusMessage>
                )}

                {!isLoading &&
                    rooms.map((room) => (
                        <EntityCard
                            key={room.locationId}
                            title={room.locationName}
                            subtitle={`устройств: ${getDevicesCount(room.locationId)}`}
                            rightSlot={<ArrowRight />}
                            onClick={() => void handleOpenRoom(room.locationId)}
                        />
                    ))}

                {!isLoading && !rooms.length && (
                    <StatusMessage>Комнат пока нет.</StatusMessage>
                )}
            </section>
        </Page>
    );
};
