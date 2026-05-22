import { Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActionButton, Page } from "../../components";
import "./NotFound.style.scss";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Page className="not-found-page">
            <section className="not-found-page__content">
                <div className="not-found-page__icon">
                    <SearchX size={56} />
                </div>

                <h2 className="not-found-page__heading">страница не найдена</h2>

                <p className="not-found-page__text">
                    Такой комнаты, устройства или раздела здесь нет.
                </p>
            </section>

            <ActionButton onClick={() => navigate("/home")}>
                <Home size={20} />
                на главную
            </ActionButton>
        </Page>
    );
};
