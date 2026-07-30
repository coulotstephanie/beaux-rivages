import type { HTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
  rounded?: boolean;
};

export function Skeleton({
  width,
  height,
  rounded = false,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={classNames("ui-skeleton", rounded && "ui-skeleton--rounded", className)}
      style={{ width, height, ...style }}
      aria-hidden="true"
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="ui-page-skeleton" role="status" aria-label="Chargement">
      <Skeleton width="35%" height="1rem" />
      <Skeleton width="70%" height="4rem" />
      <Skeleton width="100%" height="18rem" />
      <div>
        <Skeleton height="10rem" />
        <Skeleton height="10rem" />
        <Skeleton height="10rem" />
      </div>
    </div>
  );
}
