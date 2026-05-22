import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import "./FormField.style.scss";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    icon?: ReactNode;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement>;

export const TextField = ({ className = "", icon, ...props }: TextFieldProps) => {
    if (icon) {
        return (
            <span className={`form-field form-field--with-icon ${className}`.trim()}>
                {icon}
                <input className="form-field__control" {...props} />
            </span>
        );
    }

    return <input className={`form-field ${className}`.trim()} {...props} />;
};

export const SelectField = ({
    className = "",
    children,
    ...props
}: SelectFieldProps) => (
    <select className={`form-field ${className}`.trim()} {...props}>
        {children}
    </select>
);
