import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./SpacePage.style.scss";
import { ArrowLeft } from "lucide-react";
import { server } from "../../api";
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
        <main className="spaces-page">
            <header className="spaces-page__header">
                <button
                    className="spaces-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft />
                </button>

                <h1 className="spaces-page__title">пространства</h1>

                <div className="spaces-page__placeholder" />
            </header>

            <form
                className="spaces-page__form"
                onSubmit={(event) => void handleCreateSpace(event)}
            >
                <input
                    className="spaces-page__input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Название пространства"
                    disabled={isSubmitting}
                />

                <input
                    className="spaces-page__input"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    placeholder="Тип пространства"
                    disabled={isSubmitting}
                />

                <button
                    className="spaces-page__add-button"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "добавляем..." : "+ добавить пространство"}
                </button>
            </form>

            {status && <p className="spaces-page__status">{status}</p>}

            <section className="spaces-page__content">
                {isLoading && (
                    <p className="spaces-page__loading">загружаем пространства...</p>
                )}

                {!isLoading && spaces.map((space) => (
                    <button
                        key={space.spaceId}
                        className={`spaces-page__space-card ${space.spaceId === activeSpaceId ? "spaces-page__space-card--active" : ""}`}
                        onClick={() => void handleSelectSpace(space.spaceId)}
                    >
                        <div className="spaces-page__space-info">
                            <h2 className="spaces-page__space-title">
                                {space.spaceName}
                            </h2>

                            <span className="spaces-page__space-rooms">
                                комнат: {roomsBySpace[space.spaceId] ?? 0}
                            </span>
                        </div>

                        {space.spaceId === activeSpaceId && (
                            <div className="spaces-page__active-badge">
                                active
                            </div>
                        )}
                    </button>
                ))}

                {!isLoading && !spaces.length && (
                    <p className="spaces-page__empty">Пространств пока нет.</p>
                )}
            </section>
        </main>
    );
};
