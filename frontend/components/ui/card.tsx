import React from 'react';

export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md">{children}</div>
);

export const CardContent = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>{children}</div>
);
