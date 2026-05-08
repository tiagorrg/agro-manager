import type { FieldDetail } from "../entities/field/types";
import type { Operation } from "../entities/operation/types";

interface Props {
  field: FieldDetail;
}

const TYPE_LABELS: Record<string, string> = {
  Посев: "Посев",
  Обработка: "Обработка",
  Уборка: "Уборка",
  ВнесениеУдобрений: "Внесение удобрений",
};

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("ru", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatOperation(operation: Operation | null): string {
  if (!operation) return "Нет данных";
  return `${TYPE_LABELS[operation.type] ?? operation.type} · ${formatDate(operation.date)}`;
}

function getOperationTime(operation: Operation | null): number {
  if (!operation) return 0;
  return new Date(`${operation.date}T00:00:00`).getTime();
}

function isDone(operation: Operation): boolean {
  return operation.status === "Факт" || operation.calendarStatus === "Выполнено";
}

function isPlanned(operation: Operation): boolean {
  return operation.status === "План" || operation.calendarStatus === "Запланировано";
}

function getSeasonStatus(
  field: FieldDetail,
  nextOperation: Operation | null,
  overdueCount: number,
): {
  label: string;
  tone: string;
  description: string;
} {
  const inProgressCount = field.operations.filter((op) => op.calendarStatus === "В процессе").length;
  const hasHarvest = field.operations.some((op) => op.type === "Уборка" && isDone(op));

  if (inProgressCount > 0) {
    return {
      label: "В работе",
      tone: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Есть операции, которые сейчас отмечены как выполняемые.",
    };
  }

  if (overdueCount > 0) {
    return {
      label: "План просрочен",
      tone: "bg-red-50 text-red-700 border-red-100",
      description: `${overdueCount} плановых операций требуют переноса или закрытия.`,
    };
  }

  if (nextOperation) {
    return {
      label: "Запланирован",
      tone: "bg-amber-50 text-amber-700 border-amber-100",
      description: "Следующая операция уже стоит в плане сезона.",
    };
  }

  if (hasHarvest) {
    return {
      label: "Сезон закрыт",
      tone: "bg-green-50 text-green-700 border-green-100",
      description: "В истории есть фактическая уборка, новых плановых работ нет.",
    };
  }

  return {
    label: "Нужен план",
    tone: "bg-red-50 text-red-700 border-red-100",
    description: "Для поля нет ближайшей плановой операции.",
  };
}

export default function FieldSeasonSummary({ field }: Props) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const today = now.getTime();
  const sortedOperations = field.operations
    .slice()
    .sort((a, b) => getOperationTime(a) - getOperationTime(b));

  const doneOperations = sortedOperations.filter(isDone);
  const futureOperations = sortedOperations.filter((op) => getOperationTime(op) > today);
  const overdueCount = sortedOperations.filter((op) => isPlanned(op) && getOperationTime(op) < today).length;

  const lastOperation = doneOperations[doneOperations.length - 1] ?? null;
  const nextOperation =
    futureOperations.find(isPlanned) ??
    futureOperations[0] ??
    null;

  const averageYield =
    field.harvests.length > 0
      ? field.harvests.reduce((sum, harvest) => sum + harvest.yield, 0) / field.harvests.length
      : null;
  const bestYield =
    field.harvests.length > 0
      ? Math.max(...field.harvests.map((harvest) => harvest.yield))
      : null;
  const latestHarvest = field.harvests
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const latestYieldGap =
    latestHarvest && bestYield !== null ? latestHarvest.yield - bestYield : null;
  const seasonStatus = getSeasonStatus(field, nextOperation, overdueCount);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Паспорт сезона</h2>
          <p className="text-xs text-gray-400 mt-1">
            Короткая сводка по текущему состоянию поля
          </p>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${seasonStatus.tone}`}>
          {seasonStatus.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3 min-h-[86px]">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
            Последняя операция
          </p>
          <p className="text-sm font-semibold text-gray-800">{formatOperation(lastOperation)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {lastOperation?.calendarStatus ?? lastOperation?.status ?? "История пока пустая"}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 min-h-[86px]">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
            Следующая операция
          </p>
          <p className="text-sm font-semibold text-gray-800">{formatOperation(nextOperation)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {nextOperation ? "Ближайшая запланированная работа" : "Нужно добавить план"}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 min-h-[86px]">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
            Средняя урожайность
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {averageYield === null ? "Нет данных" : `${averageYield.toFixed(1)} ц/га`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {field.harvests.length > 0 ? `${field.harvests.length} сезонов в истории` : "Нет урожайных сезонов"}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3 min-h-[86px]">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">
            Отклонение от лучшего года
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {latestYieldGap === null
              ? "Нет данных"
              : latestYieldGap === 0
                ? "Лучший результат"
                : `${latestYieldGap.toFixed(1)} ц/га`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {latestHarvest ? `Последний урожай: ${formatDate(latestHarvest.date)}` : "Нет фактической уборки"}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">{seasonStatus.description}</p>
    </section>
  );
}
