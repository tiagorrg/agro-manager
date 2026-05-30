import { useState } from "react";
import type { CalendarOperation, CalendarStatus } from "../shared/api/operations";
import type { OperationType } from "../entities/operation/types";
import RescheduleModal from "./RescheduleModal";

const TYPE_STYLES: Record<OperationType, { bg: string; text: string; border: string }> = {
  "Посев":              { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  "Обработка":          { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"  },
  "Уборка":             { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
  "ВнесениеУдобрений": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200"},
};

const STATUS_CONFIG: Record<CalendarStatus, { label: string; badge: string; icon: string }> = {
  "Запланировано": { label: "Запланировано", badge: "bg-yellow-50 text-yellow-700 border border-yellow-200", icon: "⚠" },
  "В процессе":   { label: "В процессе",    badge: "bg-blue-50 text-blue-700 border border-blue-200",       icon: "🔄" },
  "Выполнено":    { label: "Выполнено",      badge: "bg-green-50 text-green-700 border border-green-200",    icon: "✓" },
};

const HOURS = Array.from({ length: 11 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

const DAYS_RU = ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"];
const MONTHS_RU = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

function formatDayTitle(date: Date): string {
  return `${date.getDate()} ${MONTHS_RU[date.getMonth()]}, ${DAYS_RU[date.getDay()]}`;
}

function parseHour(time?: string): number {
  if (!time) return -1;
  return parseInt(time.split(":")[0], 10);
}

interface OperationCardProps {
  op: CalendarOperation;
  canEdit: boolean;
  onStatusChange: (id: string, status: CalendarStatus) => void;
  onReschedule: (id: string, date: string, timeStart?: string, timeEnd?: string) => void;
}

function OperationCard({ op, canEdit, onStatusChange, onReschedule }: OperationCardProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const typeStyle = TYPE_STYLES[op.type];
  const statusCfg = STATUS_CONFIG[op.calendarStatus];

  return (
    <>
    {rescheduleOpen && (
      <RescheduleModal
        op={op}
        onClose={() => setRescheduleOpen(false)}
        onConfirm={(id, date, timeStart, timeEnd) => {
          onReschedule(id, date, timeStart, timeEnd);
          setRescheduleOpen(false);
        }}
      />
    )}
    <div className={`rounded-xl border ${typeStyle.border} ${typeStyle.bg} p-3 flex flex-col gap-2`}>
      {/* Шапка карточки */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5 min-w-0">
          {op.timeStart && op.timeEnd && (
            <span className="text-xs font-mono text-gray-500">
              {op.timeStart} – {op.timeEnd}
            </span>
          )}
          <span className={`text-sm font-semibold ${typeStyle.text}`}>{op.type}</span>
          {op.field && (
            <span className="text-xs text-gray-500 truncate">{op.field.name} · {op.field.area} га</span>
          )}
        </div>
        <span className={`shrink-0 self-start text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusCfg.badge}`}>
          {statusCfg.icon} {statusCfg.label}
        </span>
      </div>

      {/* Кнопки действий */}
      {canEdit && op.calendarStatus !== "Выполнено" && (
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          {op.calendarStatus === "Запланировано" && (
            <button
              onClick={() => onStatusChange(op.id, "В процессе")}
              className="flex-1 text-xs font-medium py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Начать
            </button>
          )}
          {op.calendarStatus === "В процессе" && (
            <button
              onClick={() => onStatusChange(op.id, "Выполнено")}
              className="flex-1 text-xs font-medium py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Завершить
            </button>
          )}
          <button
            onClick={() => setRescheduleOpen(true)}
            className="flex-1 text-xs font-medium py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Перенести
          </button>
        </div>
      )}
    </div>
    </>
  );
}

interface Props {
  day: Date;
  operations: CalendarOperation[];
  canEdit: boolean;
  onStatusChange: (id: string, status: CalendarStatus) => void;
  onReschedule: (id: string, date: string, timeStart?: string, timeEnd?: string) => void;
  onClose: () => void;
}

export default function CalendarDayPanel({ day, operations, canEdit, onStatusChange, onReschedule, onClose }: Props) {
  // Разбиваем по слотам — группируем по часу начала
  const slotMap = new Map<number, CalendarOperation[]>();
  const noTime: CalendarOperation[] = [];

  operations.forEach((op) => {
    const hour = parseHour(op.timeStart);
    if (hour === -1) {
      noTime.push(op);
    } else {
      const list = slotMap.get(hour) ?? [];
      list.push(op);
      slotMap.set(hour, list);
    }
  });

  const hasOps = operations.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Заголовок панели */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800 capitalize">
          {formatDayTitle(day)}
        </h3>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors text-base"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 max-h-[360px] overflow-y-auto sm:max-h-[420px]">
        {!hasOps && (
          <p className="text-center text-sm text-gray-400 py-8">
            Задач на этот день нет
          </p>
        )}

        {/* Временные слоты */}
        {HOURS.map((hourLabel) => {
          const hour = parseInt(hourLabel, 10);
          const ops = slotMap.get(hour);
          if (!ops) {
            return (
              <div key={hourLabel} className="flex items-start gap-3 min-h-[36px]">
                <span className="text-[11px] font-mono text-gray-300 w-11 shrink-0 pt-2">{hourLabel}</span>
                <div className="flex-1 border-t border-gray-50 mt-3" />
              </div>
            );
          }
          return (
            <div key={hourLabel} className="flex items-start gap-3">
              <span className="text-[11px] font-mono text-gray-400 w-11 shrink-0 pt-3">{hourLabel}</span>
              <div className="flex-1 flex flex-col gap-1.5 pb-1">
                {ops.map((op) => (
                  <OperationCard key={op.id} op={op} canEdit={canEdit} onStatusChange={onStatusChange} onReschedule={onReschedule} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Операции без времени */}
        {noTime.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-mono text-gray-300 w-11 shrink-0">—</span>
              <span className="text-[11px] text-gray-400">Без времени</span>
            </div>
            {noTime.map((op) => (
              <div key={op.id} className="flex items-start gap-3">
                <span className="w-11 shrink-0" />
                <div className="flex-1">
                  <OperationCard op={op} canEdit={canEdit} onStatusChange={onStatusChange} onReschedule={onReschedule} />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
