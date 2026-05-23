import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.style.scss";
import { ArrowLeft, User } from "lucide-react";
import { server } from "../../api";
import {
    ActionButton,
    IconButton,
    Page,
    PageHeader,
    StatusMessage,
} from "../../components";
import type { User as UserType } from "../../api/server";
import { ROLE } from "../../constants";

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);
    const [spacesCount, setSpacesCount] = useState(0);
    const [roomsCount, setRoomsCount] = useState(0);
    const [devicesCount, setDevicesCount] = useState(0);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const profileStats = useMemo(
        () => [
            {
                id: 1,
                label: "пространств",
                value: spacesCount,
            },
            {
                id: 2,
                label: "комнат",
                value: roomsCount,
            },
            {
                id: 3,
                label: "устройств",
                value: devicesCount,
            },
        ],
        [devicesCount, roomsCount, spacesCount],
    );

    const loadProfile = async () => {
        setStatus("");
        setIsLoading(true);

        try {
            const [nextUser, spaces, rooms, devices] = await Promise.all([
                server.getMe(),
                server.getSpaces(),
                server.getLocations(),
                server.getDevices(),
            ]);

            setUser(nextUser);
            setSpacesCount(spaces.length);
            setRoomsCount(rooms.length);
            setDevicesCount(devices.length);
        } catch {
            setStatus("Не удалось загрузить профиль.");
        } finally {
            setIsLoading(false);
        }
    };

    console.log(user);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadProfile();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    const handleLogout = () => {
        server.removeAccessToken();
        sessionStorage.removeItem("currentSpace");
        sessionStorage.removeItem("currentLocation");
        sessionStorage.removeItem("currentDevice");

        navigate("/auth", { replace: true });
    };

    return (
        <Page className="profile-page">
            <PageHeader
                title="профиль"
                leftSlot={
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </IconButton>
                }
            />
            <section className="profile-page__user-card">
                <div className="profile-page__avatar">
                    <User size={50} />
                </div>

                <h2 className="profile-page__name">
                    {isLoading
                        ? "загрузка..."
                        : (user?.username ?? "Пользователь")}
                </h2>

                <span className="profile-page__email">
                    {isLoading
                        ? "получаем данные"
                        : (user?.email ?? "email не найден")}
                </span>
            </section>
            {status && <StatusMessage>{status}</StatusMessage>}
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
            {isLoading ? (
                <StatusMessage variant="loading">
                    загружаем профиль...
                </StatusMessage>
            ) : (
                <section className="profile-page__actions">
                    <ActionButton variant="secondary">
                        роль:{" "}
                        {user
                            ? (ROLE[user.roleId as keyof typeof ROLE] ?? "—")
                            : "—"}
                    </ActionButton>

                    <ActionButton variant="danger" onClick={handleLogout}>
                        выйти из аккаунта
                    </ActionButton>
                </section>
            )}
        </Page>
    );
};
