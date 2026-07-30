import type { HTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "danger";
};

export function Alert({ title, children, variant = "info", className, ...props }: AlertProps) {
  return (
    <div
      className={classNames("ui-alert", `ui-alert--${variant}`, className)}
      role={variant === "danger" ? "alert" : "status"}
      {...props}
    >
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
