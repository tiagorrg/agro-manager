import type { Harvest } from "../entities/harvest/types";

interface Props {
  harvests: Harvest[];
}

const BAR_AREA_H = 120; // px — высота зоны столбцов

export default function FieldYieldChart({ harvests }: Props) {
  if (harvests.length === 0) {
    return (
      <p className="text-xs text-gray-400 text-center py-6">Нет данных по урожаям</p>
    );
  }

  const sorted = harvests
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  const maxYield = Math.max(...sorted.map((h) => h.yield));
  const axisMax = Math.ceil(maxYield / 10) * 10 || 10;
  const ticks = [axisMax, axisMax * 0.75, axisMax * 0.5, axisMax * 0.25, 0];

  return (
    <div className="flex gap-3">
      {/* Y-ось */}
      <div
        className="flex flex-col justify-between items-end shrink-0"
        style={{ height: BAR_AREA_H }}
      >
        {ticks.map((t) => (
          <span key={t} className="text-[10px] text-gray-300 font-mono leading-none">
            {Math.round(t)}
          </span>
        ))}
      </div>

      {/* Правая часть: значения + зона столбцов + года */}
      <div className="flex-1 flex flex-col gap-1.5">
        {/* Значения над столбцами */}
        <div className="flex gap-2">
          {sorted.map((h) => {
            const isMax = h.yield === maxYield;
            return (
              <div key={h.id} className="flex-1 text-center">
                <span
                  className={`text-[11px] font-bold leading-none ${
                    isMax ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {h.yield}
                </span>
              </div>
            );
          })}
        </div>

        {/* Зона столбцов */}
        <div
          className="flex items-end gap-2 relative"
          style={{ height: BAR_AREA_H }}
        >
          {/* Горизонтальные линии сетки */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {ticks.map((t) => (
              <div key={t} className="w-full border-t border-gray-100" />
            ))}
          </div>

          {/* Столбцы — высота в пикселях */}
          {sorted.map((h) => {
            const barPx = Math.round((h.yield / axisMax) * BAR_AREA_H);
            const isMax = h.yield === maxYield;
            return (
              <div
                key={h.id}
                className="flex-1 z-10 group cursor-default"
                style={{ height: barPx }}
              >
                <div
                  className={`w-full h-full rounded-t-lg transition-colors ${
                    isMax
                      ? "bg-green-500"
                      : "bg-green-300 group-hover:bg-green-400"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-ось — года */}
        <div className="flex gap-2 border-t border-gray-200 pt-1">
          {sorted.map((h) => (
            <div key={h.id} className="flex-1 text-center">
              <span className="text-[10px] text-gray-400 font-mono">
                {h.date.slice(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
