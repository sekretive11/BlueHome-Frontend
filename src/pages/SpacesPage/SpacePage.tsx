import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./SpacePage.style.scss";
import { ArrowLeft } from "lucide-react";
import { server } from "../../api";
import {
    ActionButton,
    EntityCard,
    IconButton,
    Page,
    PageHeader,
    StatusMessage,
    TextField,
} from "../../components";
import type { LocationItem, SpaceItem } from "../../api/server";

export const SpacePage = () => {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState<SpaceItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [activeSpaceId, setActiveSpaceId] = useState(0);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async (showLoader = true) => {
        setStatus("");

        if (showLoader) {
            setIsLoading(true);
        }

        try {
            const [nextSpaces, nextLocations] = await Promise.all([
                server.getSpaces(),
                server.getLocations(),
            ]);

            setSpaces(nextSpaces);
            setLocations(nextLocations);
            setActiveSpaceId((current) => current || nextSpaces[0]?.spaceId || 0);
        } catch {
            setStatus("Не удалось загрузить пространства.");
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

    const roomsBySpace = useMemo(
        () =>
            locations.reduce<Record<number, number>>((acc, location) => {
                acc[location.spaceId] = (acc[location.spaceId] ?? 0) + 1;

                return acc;
            }, {}),
        [locations],
    );

    const handleSelectSpace = async (spaceId: number) => {
        try {
            const space = await server.getSpace(spaceId);
            setActiveSpaceId(space.spaceId);
            setStatus(`Выбрано: ${space.spaceName}`);
        } catch {
            setStatus("Пространство не найдено.");
        }
    };

    const handleCreateSpace = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!name.trim() || !type.trim()) {
            setStatus("Заполните название и тип пространства.");
            return;
        }

        setIsSubmitting(true);

        try {
            const space = await server.createSpace({
                name: name.trim(),
                type: type.trim(),
            });

            setName("");
            setType("");
            setActiveSpaceId(space.id);
            setStatus("Пространство добавлено.");
            await loadData(false);
        } catch {
            setStatus("Не удалось добавить пространство.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page className="spaces-page">
            <PageHeader
                title="пространства"
                leftSlot={
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </IconButton>
                }
            />

            <form
                className="spaces-page__form"
                onSubmit={(event) => void handleCreateSpace(event)}
            >
                <TextField
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Название пространства"
                    disabled={isSubmitting}
                />

                <TextField
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    placeholder="Тип пространства"
                    disabled={isSubmitting}
                />

                <ActionButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "добавляем..." : "+ добавить пространство"}
                </ActionButton>
            </form>

            {status && <StatusMessage>{status}</StatusMessage>}

            <section className="spaces-page__content">
                {isLoading && (
                    <StatusMessage variant="loading">
                        загружаем пространства...
                    </StatusMessage>
                )}

                {!isLoading && spaces.map((space) => (
                    <EntityCard
                        key={space.spaceId}
                        title={space.spaceName}
                        subtitle={`комнат: ${roomsBySpace[space.spaceId] ?? 0}`}
                        active={space.spaceId === activeSpaceId}
                        rightSlot={
                            space.spaceId === activeSpaceId ? (
                                <span className="spaces-page__active-badge">
                                    active
                                </span>
                            ) : undefined
                        }
                        onClick={() => void handleSelectSpace(space.spaceId)}
                    />
                ))}

                {!isLoading && !spaces.length && (
                    <StatusMessage>Пространств пока нет.</StatusMessage>
                )}
            </section>
        </Page>
    );
};
