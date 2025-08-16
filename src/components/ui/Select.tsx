import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectPropsWithLabel
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

interface SelectPropsWithoutLabel
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: never;
  options: Option[];
  error?: string;
  helperText?: string;
}

type SelectProps = SelectPropsWithLabel | SelectPropsWithoutLabel;

export default function Select({
  label,
  options,
  error,
  helperText,
  className = "",
  id,
  ...props
}: SelectProps) {
  const classNames = `
    block w-full rounded-md border-0 py-1.5 min-h-[37px] px-3 text-gray-900 shadow-sm ring-1 ring-inset
    focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 bg-white
    ${
      error
        ? "ring-red-300 focus:ring-red-600"
        : "ring-gray-300 focus:ring-blue-600"
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
      <select
        id={id}
        className={classNames}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
