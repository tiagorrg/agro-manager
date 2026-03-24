import { useState, useEffect } from "react";
import { fetchOperations, type CalendarOperation } from "../shared/api/operations";

function tomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function TaskToast() {
  const [tasks, setTasks] = useState<CalendarOperation[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchOperations()
      .then((ops) => {
        const tomorrow = tomorrowStr();
        setTasks(ops.filter((op) => op.date === tomorrow && op.calendarStatus === "Запланировано"));
      })
      .catch(() => {});
  }, []);

  if (dismissed || tasks.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">Задачи на завтра</p>
          <p className="text-xs text-gray-500 mt-0.5">{tasks.length} запланировано</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 text-base leading-none mt-0.5"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
      <ul className="flex flex-col gap-1.5">
        {tasks.slice(0, 4).map((op) => (
          <li key={op.id} className="flex items-center gap-2 text-xs text-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
            <span className="truncate">
              {op.type}{op.field ? ` — ${op.field.name}` : ""}
              {op.timeStart ? ` · ${op.timeStart}` : ""}
            </span>
          </li>
        ))}
        {tasks.length > 4 && (
          <li className="text-xs text-gray-400 pl-3.5">+{tasks.length - 4} ещё</li>
        )}
      </ul>
    </div>
  );
}
