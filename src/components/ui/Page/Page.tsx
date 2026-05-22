import type { ComponentPropsWithoutRef } from "react";
import "./Page.style.scss";

type PageProps = ComponentPropsWithoutRef<"main">;

export const Page = ({ className = "", children, ...props }: PageProps) => (
    <main className={`page ${className}`.trim()} {...props}>
        {children}
    </main>
);
