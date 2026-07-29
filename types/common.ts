export type Identifier = string;
export type ISODate = string;
export type ISODateTime = string;

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export type SelectOption<Value extends string = string> = {
  label: string;
  value: Value;
  disabled?: boolean;
};
