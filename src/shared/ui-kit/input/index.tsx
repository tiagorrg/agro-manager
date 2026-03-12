import clsx from "clsx";
import React from "react";

type InputVariants = "primary";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  size?: "md";
  variant?: InputVariants;
};

export const Input: React.FC<InputProps> = ({
  size = "md",
  variant = "primary",
  className,
  ...props
}) => {
  const base =
    "w-full border rounded-lg focus:outline-none focus:ring-2 focus:border-green-primary focus:ring-green-primary";

  const sizes = {
    md: "px-3 py-2 text-sm",
  };

  const variants = {
    primary: "border-gray-300",
  } as const;

  return (
    <input
      className={clsx(base, sizes[size as keyof typeof sizes], variants[variant as keyof typeof variants], className)}
      {...props}
    />
  );
};

