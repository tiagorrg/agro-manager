import { useState } from "react";
import type { CalendarOperation } from "../shared/api/operations";

interface Props {
  op: CalendarOperation;
  onClose: () => void;
  onConfirm: (id: string, date: string, timeStart?: string, timeEnd?: string) => void;
}

export default function RescheduleModal({ op, onClose, onConfirm }: Props) {
  const [date, setDate] = useState(op.date);
  const [timeStart, setTimeStart] = useState(op.timeStart ?? "");
  const [timeEnd, setTimeEnd] = useState(op.timeEnd ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(op.id, date, timeStart || undefined, timeEnd || undefined);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Перенести задачу</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors text-lg leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          {op.type} · {op.field?.name ?? op.fieldId}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Новая дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Начало</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Конец</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-primary rounded-lg hover:bg-green-700 transition-colors"
            >
              Перенести
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
