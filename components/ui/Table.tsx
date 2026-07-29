import type { ReactNode, TableHTMLAttributes } from "react";
import { classNames } from "@/lib/class-names";

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  caption: string;
  children: ReactNode;
};

export function Table({ caption, children, className, ...props }: TableProps) {
  return (
    <div className="ui-table-wrap">
      <table className={classNames("ui-table", className)} {...props}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}
