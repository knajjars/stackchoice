import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export const cn = (
  ...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]
) => {
  return twMerge(clsx(inputs));
};
