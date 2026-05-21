import { useNavigate } from "react-router-dom";
import "./DevicePage.style.scss";

const deviceInfo = [
    {
        id: 1,
        label: "тип",
        value: "умная лампа",
    },
    {
        id: 2,
        label: "статус",
        value: "online",
    },
    {
        id: 3,
        label: "яркость",
        value: "65%",
    },
];

export const DevicePage = () => {
    const navigate = useNavigate();

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
                    Основная лампа
                </h2>

                <span className="device-info-page__device-subtitle">
                    Philips Hue
                </span>
            </section>

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

            <section className="device-info-page__actions">
                <button className="device-info-page__danger-button">
                    удалить устройство
                </button>
            </section>
        </main>
    );
};
