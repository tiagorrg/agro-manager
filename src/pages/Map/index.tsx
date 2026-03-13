import { useRef, useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../shared/lib/useFetch";
import { fetchFields, fetchFieldDetail } from "../../shared/api/fields";
import { getCropColor } from "../../shared/config/crops";
import { getPolygonMeta } from "../../shared/lib/geo";
import { FitBounds } from "../../shared/ui-kit/map";
import type { Field, FieldDetail } from "../../entities/field/types";
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

interface FieldPopupProps {
  field: Field;
  detail: FieldDetail | null;
}

/** Содержимое popup на карте */
function FieldPopupContent({ field, detail }: FieldPopupProps) {
  const navigate = useNavigate();
  const lastOp = detail?.operations
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;

  return (
    <div className="min-w-[190px]">
      <p className="font-semibold text-gray-800 text-sm leading-tight">{field.name}</p>
      <div className="mt-2 space-y-1 text-xs text-gray-500">
        <p>
          <span className="text-gray-400">Культура: </span>
          {field.currentCrop.name}
        </p>
        <p>
          <span className="text-gray-400">Площадь: </span>
          {field.area} га
        </p>
        <p>
          <span className="text-gray-400">Последняя операция: </span>
          {!detail ? (
            <span className="text-gray-300">загрузка...</span>
          ) : lastOp ? (
            `${lastOp.type} · ${new Date(lastOp.date).toLocaleDateString("ru")}`
          ) : "—"}
        </p>
      </div>
      <button
        onClick={() => navigate(`/fields/${field.id}`)}
        className="mt-3 w-full text-center text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg py-1.5 transition-colors"
      >
        Подробнее →
      </button>
    </div>
  );
}

export default function MapPage() {
  const { data: fields, loading, error } = useFetch(fetchFields);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<FieldDetail | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const handleSelectField = useCallback((field: Field) => {
    const { bounds } = getPolygonMeta(field.coordinates.coordinates);
    setSelectedId(field.id);
    setSelectedDetail(null);
    const map = mapRef.current;
    if (map) {
      map.stop();
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 0.4 });
    }
    fetchFieldDetail(field.id).then(setSelectedDetail).catch(() => {});
  }, []);

  useEffect(() => {
    if (!fields?.length) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const currentIndex = fields.findIndex((f) => f.id === selectedId);
      let nextIndex: number;
      if (currentIndex === -1) {
        nextIndex = e.key === "ArrowDown" ? 0 : fields.length - 1;
      } else {
        nextIndex = e.key === "ArrowDown"
          ? (currentIndex + 1) % fields.length
          : (currentIndex - 1 + fields.length) % fields.length;
      }
      handleSelectField(fields[nextIndex]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fields, selectedId, handleSelectField]);

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
          {fields && (
            <p className="text-[10px] text-gray-300 mt-1.5 flex items-center gap-1">
              <kbd className="inline-flex items-center justify-center w-4 h-4 rounded border border-gray-200 text-[9px] font-mono text-gray-400 bg-gray-50">↑</kbd>
              <kbd className="inline-flex items-center justify-center w-4 h-4 rounded border border-gray-200 text-[9px] font-mono text-gray-400 bg-gray-50">↓</kbd>
              переключение между полями
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
            ref={mapRef}
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
                  <Popup autoPan={false}>
                    <FieldPopupContent
                      field={field}
                      detail={isSelected ? selectedDetail : null}
                    />
                  </Popup>
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
