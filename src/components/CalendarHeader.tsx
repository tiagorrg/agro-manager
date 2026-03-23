const MONTHS_RU = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  if (weekStart.getMonth() === end.getMonth()) {
    return `${weekStart.getDate()}–${endDay} ${MONTHS_RU[end.getMonth()]} ${endYear}`;
  }
  return `${weekStart.getDate()} ${MONTHS_RU[weekStart.getMonth()]} – ${endDay} ${MONTHS_RU[end.getMonth()]} ${endYear}`;
}

interface Props {
  weekStart: Date;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNewTask: () => void;
}

export default function CalendarHeader({ weekStart, onToday, onPrev, onNext, onNewTask }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Предыдущая неделя"
        >
          ←
        </button>
        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Следующая неделя"
        >
          →
        </button>
        <button
          onClick={onToday}
          className="px-3 h-8 text-sm font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Сегодня
        </button>
        <span className="text-sm font-semibold text-gray-800 ml-2">
          {formatWeekRange(weekStart)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-3 h-8 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md">
          Неделя
        </button>
        <button
          onClick={onNewTask}
          className="px-3 h-8 text-sm font-medium text-white bg-green-primary rounded-md hover:bg-green-700 transition-colors flex items-center gap-1.5"
        >
          <span className="text-base leading-none">+</span> Новая задача
        </button>
      </div>
    </div>
  );
}
