import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.style.scss";

export const HomePage = () => {
    const [enabled, setEnabled] = useState(true);
    const [brightness, setBrightness] = useState(65);
    const navigate = useNavigate();

    const lampStyle = useMemo(() => {
        const opacity = enabled ? 0.45 + brightness / 180 : 0.2;

        const glow = enabled ? brightness : 0;

        return {
            opacity,
            filter: enabled
                ? `
          drop-shadow(0 0 ${glow / 2}px rgba(255,215,106,0.9))
          brightness(${0.7 + brightness / 100})
        `
                : "grayscale(0.5)",
        };
    }, [enabled, brightness]);

    return (
        <main className="home-page">
            <header className="home-page__header">
                <button
                    className="home-page__icon-button"
                    onClick={() => navigate("/profile")}
                >
                    👤
                </button>

                <button
                    className="home-page__space-button"
                    onClick={() => navigate("/spaces")}
                >
                    пространство 1
                </button>

                <button
                    className="home-page__icon-button"
                    onClick={() => navigate("/rooms")}
                >
                    ☰
                </button>
            </header>

            <section className="home-page__content">
                <div
                    className={`home-page__lamp-wrapper ${enabled ? "home-page__lamp-wrapper--active" : ""}`}
                    style={{
                        boxShadow: enabled
                            ? `0 0 ${brightness}px rgba(255, 215, 106, 0.35)`
                            : "none",
                    }}
                >
                    <div
                        className={`home-page__lamp ${enabled ? "home-page__lamp--enabled" : "home-page__lamp--disabled"}`}
                        style={lampStyle}
                        onClick={() => navigate("/device")}
                    >
                        💡
                    </div>
                </div>

                <div className="home-page__slider-block">
                    <div className="home-page__slider-header">
                        <span className="home-page__slider-title">яркость</span>

                        <span className="home-page__slider-value">
                            {brightness}%
                        </span>
                    </div>

                    <input
                        disabled={!enabled}
                        className="home-page__slider"
                        type="range"
                        min="0"
                        max="99"
                        value={brightness}
                        onChange={(event) => {
                            setBrightness(Number(event.target.value));
                        }}
                        style={{
                            background: enabled
                                ? `linear-gradient(
                                    to right,
                                    var(--primary) ${brightness}%,
                                    var(--border) ${brightness}%
                                )`
                                : `linear-gradient(
                                    to right,
                                    #C8CCD6 ${brightness}%,
                                    var(--border) ${brightness}%
                                )`,
                        }}
                    />
                </div>

                <div className="home-page__toggle">
                    <div
                        className={`home-page__toggle-slider ${enabled ? "home-page__toggle-slider--enabled" : ""}`}
                    />

                    <button
                        className="home-page__toggle-option"
                        onClick={() => setEnabled(true)}
                    >
                        ВКЛ
                    </button>

                    <button
                        className="home-page__toggle-option"
                        onClick={() => setEnabled(false)}
                    >
                        ВЫКЛ
                    </button>
                </div>
            </section>
        </main>
    );
};
