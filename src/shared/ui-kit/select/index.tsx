import clsx from "clsx";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
};

export const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange,
  id,
  disabled = false,
  placeholder = "Выберите",
  className,
  buttonClassName,
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) setOpen(true);
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleButtonKeyDown}
        className={clsx(
          "w-full min-h-9 rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-sm transition-colors",
          "flex items-center justify-between gap-2",
          "focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500",
          "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
          open && "border-green-500 ring-2 ring-green-500/20",
          buttonClassName
        )}
      >
        <span className={clsx("truncate", !selectedOption && "text-gray-400")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={clsx(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180 text-green-primary"
          )}
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={selectId}
          className="absolute left-0 z-30 mt-1 max-h-60 min-w-full w-max max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-green-100 bg-white p-1.5 shadow-xl shadow-green-950/10"
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={clsx(
                  "group relative flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  selected
                    ? "bg-green-50 text-green-primary"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  option.disabled && "cursor-not-allowed text-gray-300 hover:bg-white"
                )}
              >
                <span
                  aria-hidden="true"
                  className={clsx(
                    "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                    selected ? "bg-green-primary" : "bg-transparent group-hover:bg-gray-300"
                  )}
                />
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
