import React from "react";

export function FieldSet({ children }: { children: React.ReactNode }) {
  return <fieldset className="border-none p-0 m-0">{children}</fieldset>;
}

export function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

export function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-gray-800 mb-1">
      {children}
    </label>
  );
}

export function FieldDescription({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-gray-500 mt-0.5">{children}</span>;
}
