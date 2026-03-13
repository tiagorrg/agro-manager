import { useState } from "react";
import { getCropColor } from "../../shared/config/crops";

const SIZE = 160;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 54;
const STROKE_WIDTH = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

function DonutChart({ data, total, onHover }) {
  let cumulative = 0;

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {/* Фоновое кольцо */}
      <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE_WIDTH} />

      <g style={{ transform: `rotate(-90deg)`, transformOrigin: `${CX}px ${CY}px` }}>
        {data.map((entry) => {
          const pct = entry.area / total;
          const segLen = Math.max(pct * CIRCUMFERENCE - GAP, 0);
          const dashArray = `${segLen} ${CIRCUMFERENCE}`;
          const dashOffset = -(cumulative * CIRCUMFERENCE);
          cumulative += pct;

          return (
            <circle
              key={entry.crop}
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke={getCropColor(entry.crop)}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={() => onHover(entry)}
              onMouseLeave={() => onHover(null)}
            />
          );
        })}
      </g>
    </svg>
  );
}

export default function CropPieChart({ data }) {
  const [hovered, setHovered] = useState(null);
  if (!data?.length) return null;

  const total = data.reduce((s, d) => s + d.area, 0);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Распределение культур</h3>

      {/* Диаграмма с центральной подписью */}
      <div className="flex justify-center relative">
        <DonutChart data={data} total={total} onHover={setHovered} />
        {/* Центральная подпись */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          {hovered ? (
            <>
              <span className="text-base font-bold text-gray-800 leading-none">
                {hovered.percentage}%
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 text-center max-w-[60px] leading-tight">
                {hovered.crop}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-gray-800 leading-none">
                {total.toLocaleString("ru")}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">га</span>
            </>
          )}
        </div>
      </div>

      {/* Легенда */}
      <ul className="mt-3 space-y-2">
        {data.map((entry) => (
          <li
            key={entry.crop}
            className="flex items-center justify-between text-xs text-gray-600"
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: getCropColor(entry.crop) }}
              />
              <span className="truncate">{entry.crop}</span>
            </span>
            <span className="text-gray-400 ml-3 shrink-0">{entry.percentage}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
