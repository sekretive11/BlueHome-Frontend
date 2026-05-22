import type { ReactNode } from "react";
import "./StatusMessage.style.scss";

type StatusMessageVariant = "info" | "error" | "loading";

type StatusMessageProps = {
    children: ReactNode;
    variant?: StatusMessageVariant;
    className?: string;
};

export const StatusMessage = ({
    children,
    variant = "info",
    className = "",
}: StatusMessageProps) => (
    <p className={`status-message status-message--${variant} ${className}`.trim()}>
        {children}
    </p>
);
