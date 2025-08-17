import React from "react";

interface InputPropsWithLabel
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
}

interface InputPropsWithoutLabel
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: never;
  error?: string;
  helperText?: string;
}

type InputProps = InputPropsWithLabel | InputPropsWithoutLabel;

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const classNames = `
    block w-full rounded-md border-0 py-1.5 min-h-[37px] px-3 text-gray-900 shadow-sm ring-1 ring-inset
    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6
    ${
      error
        ? "ring-red-300 focus:ring-red-600"
        : "ring-gray-300 focus:ring-indigo-600"
    }
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={classNames}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
