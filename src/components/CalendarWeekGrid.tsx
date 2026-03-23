import type { CalendarOperation } from "../shared/api/operations";
import type { OperationType } from "../entities/operation/types";

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const TYPE_STYLES: Record<OperationType, { bg: string; text: string; dot: string }> = {
  "Посев":               { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  "Обработка":           { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "Уборка":              { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "ВнесениеУдобрений":  { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface Props {
  weekStart: Date;
  operations: CalendarOperation[];
  loading: boolean;
  error: string | null;
}

export default function CalendarWeekGrid({ weekStart, operations, loading, error }: Props) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64 text-gray-400 text-sm">
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 flex items-center justify-center h-64 text-red-400 text-sm">
        Ошибка загрузки операций
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Шапка: названия дней + числа */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={i}
              className={`flex flex-col items-center py-3 gap-1 ${i < 6 ? "border-r border-gray-100" : ""}`}
            >
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {DAY_NAMES[i]}
              </span>
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isToday ? "bg-green-primary text-white" : "text-gray-700"
                }`}
              >
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Тело: карточки операций */}
      <div className="grid grid-cols-7 min-h-[420px]">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const dayOps = operations.filter((op) => {
            const opDate = new Date(op.date + "T00:00:00");
            return isSameDay(opDate, day);
          });

          return (
            <div
              key={i}
              className={`p-2 flex flex-col gap-1.5 ${i < 6 ? "border-r border-gray-100" : ""} ${
                isToday ? "bg-green-50/40" : ""
              }`}
            >
              {dayOps.map((op) => {
                const style = TYPE_STYLES[op.type];
                return (
                  <div
                    key={op.id}
                    className={`${style.bg} ${style.text} rounded-md px-2 py-1.5 text-xs cursor-default select-none`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                      <span className="font-medium truncate">{op.type}</span>
                    </div>
                    {op.field && (
                      <p className="text-[10px] opacity-70 mt-0.5 truncate pl-3">
                        {op.field.name}
                      </p>
                    )}
                    <p className="text-[10px] opacity-60 mt-0.5 pl-3">
                      {op.status === "Факт" ? "✓ Факт" : "○ План"}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
