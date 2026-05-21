import { useNavigate } from "react-router-dom";
import "./SpacePage.style.scss";

const mockSpaces = [
    {
        id: 1,
        title: "Дом",
        rooms: 5,
        active: true,
    },
    {
        id: 2,
        title: "Тестовое пространство",
        rooms: 2,
        active: false,
    },
    {
        id: 3,
        title: "Офис",
        rooms: 8,
        active: false,
    },
];

export const SpacePage = () => {
    const navigate = useNavigate();

    return (
        <main className="spaces-page">
            <header className="spaces-page__header">
                <button
                    className="spaces-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1 className="spaces-page__title">пространства</h1>

                <div className="spaces-page__placeholder" />
            </header>

            <section className="spaces-page__content">
                {mockSpaces.map((space) => (
                    <button
                        key={space.id}
                        className={`spaces-page__space-card ${space.active ? "spaces-page__space-card--active" : ""}`}
                    >
                        <div className="spaces-page__space-info">
                            <h2 className="spaces-page__space-title">
                                {space.title}
                            </h2>

                            <span className="spaces-page__space-rooms">
                                комнат: {space.rooms}
                            </span>
                        </div>

                        {space.active && (
                            <div className="spaces-page__active-badge">
                                active
                            </div>
                        )}
                    </button>
                ))}
            </section>

            <button className="spaces-page__add-button">
                + добавить пространство
            </button>
        </main>
    );
};
