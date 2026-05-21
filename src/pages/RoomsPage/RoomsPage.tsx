import "./RoomsPage.style.scss";
import { useNavigate } from "react-router-dom";

const mockRooms = [
    {
        id: 1,
        title: "Гостиная",
        devices: 4,
    },
    {
        id: 2,
        title: "Спальня",
        devices: 2,
    },
    {
        id: 3,
        title: "Кухня",
        devices: 6,
    },
];

export const RoomsPage = () => {
    const navigate = useNavigate();

    return (
        <main className="rooms-page">
            <header className="rooms-page__header">
                <button
                    className="rooms-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1 className="rooms-page__title">комнаты</h1>

                <div className="rooms-page__placeholder" />
            </header>

            <section className="rooms-page__content">
                {mockRooms.map((room) => (
                    <button key={room.id} className="rooms-page__room-card">
                        <div className="rooms-page__room-info">
                            <h2 className="rooms-page__room-title">
                                {room.title}
                            </h2>

                            <span className="rooms-page__room-devices">
                                устройств: {room.devices}
                            </span>
                        </div>

                        <div className="rooms-page__room-arrow">→</div>
                    </button>
                ))}
            </section>

            <button className="rooms-page__add-button">
                + добавить комнату
            </button>
        </main>
    );
};
