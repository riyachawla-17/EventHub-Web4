import React from "react";

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="border p-2 rounded w-full" />
);
