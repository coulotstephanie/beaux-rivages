import { forwardRef, type TextareaHTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={classNames("ui-textarea", invalid && "ui-textarea--invalid", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
