import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./EntityCard.style.scss";

type EntityCardProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    title: string;
    subtitle?: string;
    rightSlot?: ReactNode;
    active?: boolean;
};

export const EntityCard = ({
    className = "",
    title,
    subtitle,
    rightSlot,
    active = false,
    type = "button",
    ...props
}: EntityCardProps) => (
    <button
        className={`entity-card ${active ? "entity-card--active" : ""} ${className}`.trim()}
        type={type}
        {...props}
    >
        <div className="entity-card__info">
            <h2 className="entity-card__title">{title}</h2>

            {subtitle && <span className="entity-card__subtitle">{subtitle}</span>}
        </div>

        {rightSlot && <div className="entity-card__right">{rightSlot}</div>}
    </button>
);
