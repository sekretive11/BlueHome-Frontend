import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { server } from "../../api";
import { ActionButton, Page, TextField } from "../../components";
import "./AuthPage.style.scss";

export const AuthPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await server.login({ email, password });
            navigate("/home");
        } catch {
            setError("Не удалось войти. Проверьте почту и пароль.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Page className="auth-page">
            <section className="auth-page__hero">
                <div className="auth-page__icon">
                    <ShieldCheck size={42} />
                </div>

                <h1 className="auth-page__title">вход</h1>

                <p className="auth-page__subtitle">
                    Управляйте домом после авторизации
                </p>
            </section>

            <form className="auth-page__form" onSubmit={handleSubmit}>
                <label className="auth-page__field">
                    <span className="auth-page__label">почта</span>

                    <TextField
                        icon={<Mail size={20} />}
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        required
                    />
                </label>

                <label className="auth-page__field">
                    <span className="auth-page__label">пароль</span>

                    <TextField
                        icon={<Lock size={20} />}
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Введите пароль"
                        autoComplete="current-password"
                        disabled={isLoading}
                        required
                    />
                </label>

                <ActionButton type="submit" disabled={isLoading}>
                    {isLoading ? "входим..." : "войти"}
                </ActionButton>
                
                {error && <p className="auth-page__error">{error}</p>}
            </form>
        </Page>
    );
};
