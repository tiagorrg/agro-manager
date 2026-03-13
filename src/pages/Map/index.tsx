import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import { useFetch } from "../../shared/lib/useFetch";
import { fetchFields } from "../../shared/api/fields";
import { getCropColor } from "../../shared/config/crops";
import { getPolygonMeta } from "../../shared/lib/geo";
import { FitBounds, FlyToField } from "../../shared/ui-kit/map";
import type { Field } from "../../entities/field/types";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

interface FieldCardProps {
  field: Field;
  isSelected: boolean;
  onClick: () => void;
}

/** Карточка поля в сайдбаре */
function FieldCard({ field, isSelected, onClick }: FieldCardProps) {
  const color = getCropColor(field.currentCrop.name);
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full text-left px-3 py-3 rounded-xl transition-colors flex items-start gap-3 ${
          isSelected
            ? "bg-green-50 ring-1 ring-green-primary"
            : "hover:bg-gray-50"
        }`}
      >
        {/* Цветная полоска культуры */}
        <span
          className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${isSelected ? "text-green-primary" : "text-gray-800"}`}>
            {field.name}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{field.currentCrop.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{field.area} га</p>
        </div>
        {isSelected && (
          <span className="ml-auto text-green-primary text-lg leading-none shrink-0">›</span>
        )}
      </button>
    </li>
  );
}

export default function MapPage() {
  const { data: fields, loading, error } = useFetch(fetchFields);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<LatLngTuple[] | null>(null);

  const handleSelectField = useCallback((field: Field) => {
    const { bounds } = getPolygonMeta(field.coordinates.coordinates);
    setSelectedId(field.id);
    setFlyTarget(bounds);
  }, []);

  const totalArea = fields
    ? fields.reduce((s, f) => s + f.area, 0).toLocaleString("ru")
    : "—";

  return (
    <div className="flex h-full">
      {/* ── Сайдбар ── */}
      <aside className="w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Поля хозяйства</h2>
          {fields && (
            <p className="text-xs text-gray-400 mt-0.5">
              {fields.length} пол. · {totalArea} га
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading && (
            <div className="space-y-2 p-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
          {error && (
            <p className="text-xs text-red-400 p-3">Ошибка загрузки полей</p>
          )}
          {fields && (
            <ul className="space-y-1">
              {fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  isSelected={selectedId === field.id}
                  onClick={() => handleSelectField(field)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Легенда внизу */}
        {fields && (
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">
              Культуры
            </p>
            <ul className="space-y-1">
              {[...new Map(fields.map((f) => [f.currentCrop.name, f.currentCrop])).values()].map(
                (crop) => (
                  <li key={crop.name} className="flex items-center gap-2 text-xs text-gray-600">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: getCropColor(crop.name) }}
                    />
                    {crop.name}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </aside>

      {/* ── Карта ── */}
      <div className="flex-1 relative">
        {fields && (
          <MapContainer
            center={[46.26, 39.52]}
            zoom={13}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <FitBounds fields={fields} />
            <FlyToField target={flyTarget} />

            {fields.map((field) => {
              const color = getCropColor(field.currentCrop.name);
              const isSelected = field.id === selectedId;
              const positions = field.coordinates.coordinates[0].map(
                ([lng, lat]) => [lat, lng] as LatLngTuple
              );
              return (
                <Polygon
                  key={field.id}
                  positions={positions}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.65 : 0.35,
                    weight: isSelected ? 3 : 2,
                    opacity: isSelected ? 1 : 0.7,
                  }}
                  eventHandlers={{
                    click: () => handleSelectField(field),
                  }}
                >
                  <Tooltip sticky>
                    <span className="font-medium">{field.name}</span>
                    <br />
                    {field.currentCrop.name} · {field.area} га
                  </Tooltip>
                </Polygon>
              );
            })}
          </MapContainer>
        )}

        {loading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Загрузка карты...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center text-red-400 text-sm">
            Ошибка загрузки карты
          </div>
        )}
      </div>
    </div>
  );
}
