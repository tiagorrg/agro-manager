import type { Operation } from "../../../entities/operation/types";

interface OperationsTableProps {
  operations: Operation[];
}

export function OperationsTable({ operations }: OperationsTableProps) {
  if (operations.length === 0) {
    return <p className="text-xs text-gray-400">Нет данных</p>;
  }

  const sorted = operations
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ul className="divide-y divide-gray-50">
      {sorted.map((op) => (
        <li key={op.id} className="flex items-center justify-between py-2.5 text-sm">
          <div>
            <span className="font-medium text-gray-700">{op.type}</span>
            {op.description && (
              <span className="text-gray-400 text-xs ml-2">{op.description}</span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                op.status === "Факт"
                  ? "bg-green-50 text-green-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {op.status}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(op.date).toLocaleDateString("ru")}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
