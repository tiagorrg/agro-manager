import type { FieldDetail } from "../entities/field/types";
import type { Operation, OperationType } from "../entities/operation/types";

interface Props {
  field: FieldDetail;
}

type StageStatus = "done" | "overdue" | "planned" | "missing";

interface SeasonStage {
  type: OperationType;
  title: string;
  shortTitle: string;
}

interface StageState extends SeasonStage {
  status: StageStatus;
  operation: Operation | null;
  caption: string;
}

const STAGES: SeasonStage[] = [
  { type: "Посев", title: "Посев", shortTitle: "Посев" },
  { type: "Обработка", title: "Обработка", shortTitle: "Обработка" },
  { type: "ВнесениеУдобрений", title: "Внесение удобрений", shortTitle: "Удобрения" },
  { type: "Уборка", title: "Уборка", shortTitle: "Уборка" },
];

const STATUS_VIEW: Record<StageStatus, { label: string; tone: string; dot: string }> = {
  done: {
    label: "Выполнено",
    tone: "bg-green-50 text-green-700 border-green-100",
    dot: "bg-green-500",
  },
  overdue: {
    label: "Просрочено",
    tone: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
  },
  planned: {
    label: "Запланировано",
    tone: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  missing: {
    label: "Не запланировано",
    tone: "bg-gray-50 text-gray-500 border-gray-100",
    dot: "bg-gray-300",
  },
};

function getOperationTime(operation: Operation): number {
  return new Date(`${operation.date}T00:00:00`).getTime();
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("ru", {
    day: "2-digit",
    month: "short",
  });
}

function isDone(operation: Operation): boolean {
  return operation.status === "Факт" || operation.calendarStatus === "Выполнено";
}

function isPlanned(operation: Operation): boolean {
  return operation.status === "План" || operation.calendarStatus === "Запланировано";
}

function getStageState(stage: SeasonStage, operations: Operation[], today: number): StageState {
  const stageOperations = operations
    .filter((operation) => operation.type === stage.type)
    .sort((a, b) => getOperationTime(a) - getOperationTime(b));

  const done = stageOperations.filter(isDone);
  if (done.length > 0) {
    const operation = done[done.length - 1];
    return {
      ...stage,
      status: "done",
      operation,
      caption: `Выполнено ${formatDate(operation.date)}`,
    };
  }

  const overdue = stageOperations.filter(
    (operation) => isPlanned(operation) && getOperationTime(operation) < today,
  );
  if (overdue.length > 0) {
    const operation = overdue[0];
    return {
      ...stage,
      status: "overdue",
      operation,
      caption: `Нужно перенести с ${formatDate(operation.date)}`,
    };
  }

  const planned = stageOperations.find(
    (operation) => isPlanned(operation) && getOperationTime(operation) >= today,
  );
  if (planned) {
    return {
      ...stage,
      status: "planned",
      operation: planned,
      caption: `План на ${formatDate(planned.date)}`,
    };
  }

  return {
    ...stage,
    status: "missing",
    operation: null,
    caption: "Нет операции в плане сезона",
  };
}

export default function FieldSeasonPlan({ field }: Props) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = now.getTime();
  const currentYear = now.getFullYear();
  const seasonOperations = field.operations.filter(
    (operation) => new Date(`${operation.date}T00:00:00`).getFullYear() === currentYear,
  );
  const stages = STAGES.map((stage) => getStageState(stage, seasonOperations, today));
  const doneCount = stages.filter((stage) => stage.status === "done").length;
  const overdueCount = stages.filter((stage) => stage.status === "overdue").length;
  const missingCount = stages.filter((stage) => stage.status === "missing").length;
  const progress = Math.round((doneCount / stages.length) * 100);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">План сезона</h2>
          <p className="text-xs text-gray-400 mt-1">
            Ключевые этапы работ на {currentYear} год
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-2xl font-bold text-gray-800">{progress}%</p>
          <p className="text-xs text-gray-400">прогресс этапов</p>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stages.map((stage) => {
          const view = STATUS_VIEW[stage.status];
          return (
            <div key={stage.type} className="rounded-xl bg-gray-50 p-3 min-h-[96px]">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${view.dot}`} />
                  <p className="text-sm font-semibold leading-snug text-gray-800">{stage.title}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${view.tone}`}>
                  {view.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{stage.caption}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs text-gray-500">
          Выполнено: <strong className="text-gray-700">{doneCount}</strong> из {stages.length}
        </span>
        {overdueCount > 0 && (
          <span className="text-xs text-red-600">
            Просрочено: <strong>{overdueCount}</strong>
          </span>
        )}
        {missingCount > 0 && (
          <span className="text-xs text-gray-500">
            Не запланировано: <strong>{missingCount}</strong>
          </span>
        )}
      </div>
    </section>
  );
}
