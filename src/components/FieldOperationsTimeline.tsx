import type { Operation, OperationType } from "../entities/operation/types";

interface Props {
  operations: Operation[];
}

const TYPE_COLORS: Record<OperationType, { dot: string; text: string }> = {
  "Посев":              { dot: "bg-green-500",  text: "text-green-700"  },
  "Обработка":          { dot: "bg-blue-500",   text: "text-blue-700"   },
  "Уборка":             { dot: "bg-amber-500",  text: "text-amber-700"  },
  "ВнесениеУдобрений": { dot: "bg-purple-500", text: "text-purple-700" },
};

const TYPE_LABELS: Record<OperationType, string> = {
  "Посев":              "Посев",
  "Обработка":          "Обработка",
  "Уборка":             "Уборка",
  "ВнесениеУдобрений": "Внесение удобрений",
};

const MONTHS_RU = [
  "янв","фев","мар","апр","май","июн",
  "июл","авг","сен","окт","ноя","дек",
];

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}

export default function FieldOperationsTimeline({ operations }: Props) {
  if (operations.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-6">Нет операций</p>;
  }

  const sorted = operations
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 220 }}>
      {sorted.map((op, idx) => {
        const colors = TYPE_COLORS[op.type];
        const isLast = idx === sorted.length - 1;
        return (
          <div key={op.id} className="flex gap-3">
            {/* Линия */}
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${colors.dot}`} />
              {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
            </div>

            {/* Контент */}
            <div className={`flex-1 flex items-start justify-between gap-2 min-w-0 ${!isLast ? "pb-3" : ""}`}>
              <div className="min-w-0">
                <span className={`text-xs font-semibold ${colors.text}`}>
                  {TYPE_LABELS[op.type]}
                </span>
                {op.timeStart && op.timeEnd && (
                  <span className="text-[10px] text-gray-400 ml-1.5 font-mono">
                    {op.timeStart}–{op.timeEnd}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    op.status === "Факт"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {op.status}
                </span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {formatDate(op.date)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
