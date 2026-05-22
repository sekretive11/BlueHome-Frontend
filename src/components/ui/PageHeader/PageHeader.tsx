import type { ReactNode } from "react";
import "./PageHeader.style.scss";

type PageHeaderProps = {
    title: string;
    leftSlot?: ReactNode;
    rightSlot?: ReactNode;
    className?: string;
};

export const PageHeader = ({
    title,
    leftSlot,
    rightSlot,
    className = "",
}: PageHeaderProps) => (
    <header className={`page-header ${className}`.trim()}>
        {leftSlot ?? <div className="page-header__placeholder" />}

        <h1 className="page-header__title">{title}</h1>

        {rightSlot ?? <div className="page-header__placeholder" />}
    </header>
);
