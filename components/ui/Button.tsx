import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { classNames } from "@/lib/class-names";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
};

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", className, ariaLabel } = props;
  const classes = classNames("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className);

  if ("href" in props && props.href) {
    const {
      href,
      ariaLabel: _ariaLabel,
      children: _children,
      className: _className,
      size: _size,
      variant: _variant,
      ...anchorProps
    } = props;
    void _ariaLabel;
    void _children;
    void _className;
    void _size;
    void _variant;
    const isExternal = /^https?:\/\//.test(href);
    const isNativeAnchor =
      isExternal || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:");

    if (isNativeAnchor) {
      return (
        <a
          {...anchorProps}
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target={isExternal ? "_blank" : anchorProps.target}
          rel={isExternal ? "noopener noreferrer" : anchorProps.rel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link {...anchorProps} href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    ariaLabel: _ariaLabel,
    children: _children,
    className: _className,
    size: _size,
    variant: _variant,
    ...buttonProps
  } = props as NativeButtonProps;
  void _ariaLabel;
  void _children;
  void _className;
  void _size;
  void _variant;
  return (
    <button {...buttonProps} type={type} className={classes} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
