import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./ActionButton.style.scss";

type ActionButtonVariant = "primary" | "secondary" | "danger";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ActionButtonVariant;
    fullWidth?: boolean;
};

export const ActionButton = ({
    className = "",
    children,
    variant = "primary",
    fullWidth = true,
    type = "button",
    ...props
}: ActionButtonProps) => {
    const widthClass = fullWidth ? "action-button--full" : "";

    return (
        <button
            className={`action-button action-button--${variant} ${widthClass} ${className}`.trim()}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};
