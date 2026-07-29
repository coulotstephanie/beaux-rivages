import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, id, invalid = false, label, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ");
    const isInvalid = invalid || Boolean(error);

    const field = (
      <input
        ref={ref}
        id={inputId}
        className={classNames("ui-input", isInvalid && "ui-input--invalid", className)}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      />
    );

    if (!label && !hint && !error) {
      return field;
    }

    return (
      <span className="ui-field">
        {label && <label htmlFor={inputId}>{label}</label>}
        {field}
        {hint && (
          <span id={hintId} className="ui-field__hint">
            {hint}
          </span>
        )}
        {error && (
          <span id={errorId} className="ui-field__error" role="alert">
            {error}
          </span>
        )}
      </span>
    );
  },
);

Input.displayName = "Input";
