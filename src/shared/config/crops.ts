/** Цвета культур для карты и легенды */
export const CROP_COLORS: Record<string, string> = {
  "Пшеница озимая": "#eab308",
  "Подсолнечник":   "#f97316",
  "Кукуруза":       "#22c55e",
  "Ячмень яровой":  "#a78bfa",
};

export const DEFAULT_CROP_COLOR = "#94a3b8";

export function getCropColor(cropName: string): string {
  return CROP_COLORS[cropName] ?? DEFAULT_CROP_COLOR;
}
