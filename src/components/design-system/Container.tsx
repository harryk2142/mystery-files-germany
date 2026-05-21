import type { ComponentChildren } from "preact";
import styles from "./Container.module.css";

type Variant = "s" | "m" | "l";

type ContainerProps = {
    children?: ComponentChildren;
    variant?: Variant;
    class?: string;
};

export function Container({
    children,
    variant = "m",
    class: className,
}: ContainerProps) {
    const variantClass = variant !== "m" ? styles[variant] : "";
    return (
        <div class={`${styles.container} ${variantClass} ${className ?? ""}`}>
            {children}
        </div>
    );
}
