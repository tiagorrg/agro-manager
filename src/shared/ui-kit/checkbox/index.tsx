import clsx from "clsx";
import React from "react";

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  indicatorClassName?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  indicatorClassName,
  checked,
  disabled,
  ...props
}) => {
  return (
    <span className={clsx("relative inline-flex h-4 w-4 shrink-0 items-center justify-center", className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden="true"
        className={clsx(
          "flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-green-500/30 peer-focus-visible:ring-offset-1",
          "peer-checked:border-green-primary peer-checked:bg-green-primary",
          "peer-disabled:bg-gray-50 peer-disabled:border-gray-200",
          indicatorClassName
        )}
      >
        <span
          className={clsx("h-1.5 w-1.5 rounded-full bg-white transition-opacity", checked ? "opacity-100" : "opacity-0")}
        />
      </span>
    </span>
  );
};
