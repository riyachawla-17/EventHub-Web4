import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default";
}

export const Button = ({ variant = "default", ...props }: ButtonProps) => (
  <button
    {...props}
    className={`p-2 rounded ${variant === "outline" ? "border" : "bg-blue-500 text-white"}`}
  />
);
