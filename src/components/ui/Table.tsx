import React from "react";

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: EmptyStateProps;
  sort?: SortConfig;
  onSortChange?: (sort: SortConfig) => void;
  getRowKey: (item: T) => string;
}

function LoadingState() {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="p-8 text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

interface SortableHeaderProps {
  field: string;
  currentSort?: SortConfig;
  onSortChange?: (sort: SortConfig) => void;
  children: React.ReactNode;
}

function SortableHeader({
  field,
  currentSort,
  onSortChange,
  children,
}: SortableHeaderProps) {
  const handleClick = () => {
    if (!onSortChange) return;

    if (currentSort?.field === field) {
      const newDirection = currentSort.direction === "asc" ? "desc" : "asc";

      onSortChange({ field, direction: newDirection });
      return;
    }

    onSortChange({ field, direction: "asc" });
  };

  const isActive = currentSort?.field === field;
  const isAsc = isActive && currentSort?.direction === "asc";
  const isDesc = isActive && currentSort?.direction === "desc";

  const getSortDirection = () => {
    if (!isActive) return "none";
    return currentSort?.direction === "asc" ? "ascending" : "descending";
  };

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
      onClick={handleClick}
      scope="col"
      aria-sort={getSortDirection()}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-center justify-between group">
        <span>{children}</span>
        <div className="flex flex-col ml-1">
          <svg
            className={`w-3 h-3 ${
              isAsc
                ? "text-indigo-600"
                : "text-gray-300 group-hover:text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            className={`w-3 h-3 ${
              isDesc
                ? "text-indigo-600"
                : "text-gray-300 group-hover:text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </th>
  );
}

function StaticHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
        className || ""
      }`}
      scope="col"
    >
      {children}
    </th>
  );
}

export default function Table<T>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyState,
  sort,
  onSortChange,
  getRowKey,
}: TableProps<T>) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (data.length === 0 && emptyState) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="max-h-96 overflow-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          role="table"
          aria-label="Data table"
        >
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) =>
                column.sortable ? (
                  <SortableHeader
                    key={String(column.key)}
                    field={String(column.key)}
                    currentSort={sort}
                    onSortChange={onSortChange}
                  >
                    {column.header}
                  </SortableHeader>
                ) : (
                  <StaticHeader
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.header}
                  </StaticHeader>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`transition-colors ${
                  onRowClick
                    ? "hover:bg-gray-50 cursor-pointer"
                    : "hover:bg-gray-50"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.className || ""
                    }`}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
