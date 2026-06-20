import type { CalendarOperation, CalendarStatus } from "../shared/api/operations";
import type { OperationType } from "../entities/operation/types";

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const TYPE_STYLES: Record<OperationType, { bg: string; text: string; dot: string }> = {
  "Посев":              { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  "Обработка":          { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "Уборка":             { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "ВнесениеУдобрений": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

const STATUS_DOT: Record<CalendarStatus, string> = {
  "Запланировано": "border-2 border-yellow-400 bg-white",
  "В процессе":   "bg-blue-500 animate-pulse",
  "Выполнено":    "bg-green-500",
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
  selectedDay: Date | null;
  loading: boolean;
  error: string | null;
  onDayClick: (day: Date) => void;
}

export default function CalendarWeekGrid({
  weekStart,
  operations,
  selectedDay,
  loading,
  error,
  onDayClick,
}: Props) {
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
      {/* Мобильный список дней */}
      <div className="divide-y divide-gray-100 sm:hidden">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const dayOps = operations.filter((op) =>
            isSameDay(new Date(op.date + "T00:00:00"), day)
          );

          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick(day)}
              className={`w-full px-3 py-3 text-left transition-colors ${
                isSelected ? "bg-green-50" : isToday ? "bg-green-50/40" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? "bg-green-primary text-white"
                        : isSelected
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{DAY_NAMES[i]}</p>
                    <p className="text-xs text-gray-400">
                      {day.toLocaleDateString("ru", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {dayOps.length}
                </span>
              </div>

              {dayOps.length > 0 ? (
                <div className="mt-3 flex flex-col gap-2">
                  {dayOps.map((op) => {
                    const style = TYPE_STYLES[op.type];
                    const statusDot = STATUS_DOT[op.calendarStatus];
                    return (
                      <div
                        key={op.id}
                        className={`${style.bg} ${style.text} rounded-lg px-3 py-2`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot}`} />
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                            {op.type}
                          </span>
                          <span className="font-mono text-xs opacity-60">
                            {op.timeStart ?? "—"}
                          </span>
                        </div>
                        {op.field && (
                          <p className="mt-1 truncate pl-5 text-xs opacity-75">
                            {op.field.name}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 pl-10 text-xs text-gray-300">Нет операций</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Шапка: кликабельные заголовки колонок */}
      <div className="hidden grid-cols-7 border-b border-gray-100 sm:grid">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          return (
            <button
              key={i}
              onClick={() => onDayClick(day)}
              className={`flex flex-col items-center py-2 gap-1 transition-colors sm:py-3 ${
                i < 6 ? "border-r border-gray-100" : ""
              } ${isSelected ? "bg-green-50" : "hover:bg-gray-50"}`}
            >
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {DAY_NAMES[i]}
              </span>
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold transition-colors sm:w-7 sm:h-7 sm:text-sm ${
                  isToday
                    ? "bg-green-primary text-white"
                    : isSelected
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700"
                }`}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Тело: карточки операций */}
      <div className="hidden min-h-[320px] grid-cols-7 sm:grid">
        {days.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const dayOps = operations.filter((op) =>
            isSameDay(new Date(op.date + "T00:00:00"), day)
          );

          return (
            <div
              key={i}
              onClick={() => onDayClick(day)}
              className={`p-1 flex flex-col gap-1 cursor-pointer transition-colors sm:p-2 sm:gap-1.5 ${
                i < 6 ? "border-r border-gray-100" : ""
              } ${isSelected ? "bg-green-50/60" : isToday ? "bg-green-50/40" : "hover:bg-gray-50/60"}`}
            >
              {dayOps.map((op) => {
                const style = TYPE_STYLES[op.type];
                const statusDot = STATUS_DOT[op.calendarStatus];
                return (
                  <div
                    key={op.id}
                    className={`${style.bg} ${style.text} rounded-md px-1 py-1 text-[10px] select-none sm:px-2 sm:py-1.5 sm:text-xs`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
                      <span className="font-medium truncate">{op.type}</span>
                    </div>
                    {op.field && (
                      <p className="text-[10px] opacity-70 mt-0.5 truncate pl-3.5">
                        {op.field.name}
                      </p>
                    )}
                    {op.timeStart && (
                      <p className="text-[10px] opacity-50 mt-0.5 font-mono pl-3.5">
                        {op.timeStart}
                      </p>
                    )}
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
