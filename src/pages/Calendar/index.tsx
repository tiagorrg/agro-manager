import { useState, useEffect } from "react";
import { fetchOperations, type CalendarOperation } from "../../shared/api/operations";
import CalendarHeader from "../../components/CalendarHeader";
import CalendarWeekGrid from "../../components/CalendarWeekGrid";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CalendarPage() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [operations, setOperations] = useState<CalendarOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const goToToday = () => setWeekStart(getWeekStart(new Date()));

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

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        weekStart={weekStart}
        onToday={goToToday}
        onPrev={goToPrev}
        onNext={goToNext}
      />
      <CalendarWeekGrid
        weekStart={weekStart}
        operations={operations}
        loading={loading}
        error={error}
      />
    </div>
  );
}
