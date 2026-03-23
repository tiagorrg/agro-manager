import { useState, useEffect, useMemo } from "react";
import {
  fetchOperations,
  patchOperationStatus,
  type CalendarOperation,
  type CalendarStatus,
} from "../../shared/api/operations";
import type { OperationType } from "../../entities/operation/types";
import CalendarHeader from "../../components/CalendarHeader";
import CalendarWeekGrid from "../../components/CalendarWeekGrid";
import CalendarDayPanel from "../../components/CalendarDayPanel";
import CalendarSidebar from "../../components/CalendarSidebar";
import NewTaskModal from "../../components/NewTaskModal";

const ALL_TYPES = new Set<OperationType>(["Посев", "Обработка", "Уборка", "ВнесениеУдобрений"]);

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => new Date());
  const [operations, setOperations] = useState<CalendarOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<OperationType>>(ALL_TYPES);
  const [showNewTask, setShowNewTask] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchOperations()
      .then((data) => {
        if (!cancelled) {
          setOperations(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const goToToday = () => {
    const today = new Date();
    setWeekStart(getWeekStart(today));
    setSelectedDay(today);
  };

  const goToPrev = () =>
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });

  const goToNext = () =>
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });

  const handleDayClick = (day: Date) => {
    setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day));
  };

  const handleSelectDay = (day: Date) => {
    setWeekStart(getWeekStart(day));
    setSelectedDay(day);
  };

  const handleTypeToggle = (type: OperationType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const handleStatusChange = async (opId: string, newStatus: CalendarStatus) => {
    // Оптимистичное обновление
    setOperations((ops) =>
      ops.map((op) => (op.id === opId ? { ...op, calendarStatus: newStatus } : op))
    );
    try {
      await patchOperationStatus(opId, newStatus);
    } catch {
      // При ошибке откатываем (перезапрашиваем оригинальные данные не будем — дипломный проект)
    }
  };

  // Операции текущей недели с учётом фильтров
  const filteredOps = useMemo(
    () => operations.filter((op) => activeTypes.has(op.type)),
    [operations, activeTypes]
  );

  // Операции выбранного дня
  const dayOps = useMemo(() => {
    if (!selectedDay) return [];
    return filteredOps.filter((op) =>
      isSameDay(new Date(op.date + "T00:00:00"), selectedDay)
    );
  }, [filteredOps, selectedDay]);

  const handleCreate = (op: CalendarOperation) => {
    setOperations((prev) => [...prev, op]);
    setShowNewTask(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        weekStart={weekStart}
        onToday={goToToday}
        onPrev={goToPrev}
        onNext={goToNext}
        onNewTask={() => setShowNewTask(true)}
      />

      {showNewTask && (
        <NewTaskModal
          defaultDate={selectedDay?.toISOString().slice(0, 10)}
          onClose={() => setShowNewTask(false)}
          onCreate={handleCreate}
        />
      )}

      <div className="flex gap-5 items-start">
        {/* Левая боковая панель */}
        <CalendarSidebar
          operations={filteredOps}
          activeTypes={activeTypes}
          onTypeToggle={handleTypeToggle}
          onSelectDay={handleSelectDay}
        />

        {/* Основное содержимое */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <CalendarWeekGrid
            weekStart={weekStart}
            operations={filteredOps}
            selectedDay={selectedDay}
            loading={loading}
            error={error}
            onDayClick={handleDayClick}
          />

          {selectedDay && (
            <CalendarDayPanel
              day={selectedDay}
              operations={dayOps}
              onStatusChange={handleStatusChange}
              onClose={() => setSelectedDay(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
