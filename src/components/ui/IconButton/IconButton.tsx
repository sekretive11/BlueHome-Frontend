import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconButton.style.scss";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
};

export const IconButton = ({
    className = "",
    children,
    type = "button",
    ...props
}: IconButtonProps) => (
    <button className={`icon-button ${className}`.trim()} type={type} {...props}>
        {children}
    </button>
);
