import { useNavigate } from "react-router-dom";
import "./ProfilePage.style.scss";

const profileStats = [
    {
        id: 1,
        label: "пространств",
        value: 3,
    },
    {
        id: 2,
        label: "комнат",
        value: 8,
    },
    {
        id: 3,
        label: "устройств",
        value: 24,
    },
];

export const ProfilePage = () => {
    const navigate = useNavigate();

    return (
        <main className="profile-page">
            <header className="profile-page__header">
                <button
                    className="profile-page__back-button"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1 className="profile-page__title">профиль</h1>

                <div className="profile-page__placeholder" />
            </header>

            <section className="profile-page__user-card">
                <div className="profile-page__avatar">👤</div>

                <h2 className="profile-page__name">Дмитрий</h2>

                <span className="profile-page__email">dmitry@example.com</span>
            </section>

            <section className="profile-page__stats">
                {profileStats.map((stat) => (
                    <div key={stat.id} className="profile-page__stat-card">
                        <span className="profile-page__stat-value">
                            {stat.value}
                        </span>

                        <span className="profile-page__stat-label">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </section>

            <section className="profile-page__actions">
                <button className="profile-page__action-button">
                    настройки
                </button>

                <button className="profile-page__action-button">
                    уведомления
                </button>

                <button className="profile-page__logout-button">
                    выйти из аккаунта
                </button>
            </section>
        </main>
    );
};
