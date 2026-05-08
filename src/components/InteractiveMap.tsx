import { useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { useNavigate } from "react-router-dom";
import { getCropColor } from "../shared/config/crops";
import { getPolygonMeta } from "../shared/lib/geo";
import { FitBounds } from "../shared/ui-kit/map";
import { useMapStore } from "../store/mapStore";
import type { Field } from "../entities/field/types";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

interface Props {
  fields: Field[] | null;
  loading: boolean;
  error: string | null;
}

interface FieldPopupContentProps {
  field: Field;
}

function FieldPopupContent({ field }: FieldPopupContentProps) {
  const navigate = useNavigate();
  const selectedFieldId = useMapStore((s) => s.selectedFieldId);
  const selectedDetail = useMapStore((s) => s.selectedDetail);

  const detail = field.id === selectedFieldId ? selectedDetail : null;
  const lastOp =
    detail?.operations
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;

  return (
    <div className="min-w-[190px]">
      <p className="font-semibold text-gray-800 text-sm leading-tight">{field.name}</p>
      <div className="mt-2 space-y-1 text-xs text-gray-500">
        <p><span className="text-gray-400">Культура: </span>{field.currentCrop.name}</p>
        <p><span className="text-gray-400">Площадь: </span>{field.area} га</p>
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

export default function InteractiveMap({ fields, loading, error }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const selectedFieldId = useMapStore((s) => s.selectedFieldId);
  const selectField = useMapStore((s) => s.selectField);

  // Вычисляем начальный центр из данных полей вместо хардкода
  const initialCenter = useMemo((): [number, number] => {
    if (!fields?.length) return [46.26, 39.52];
    const allPoints = fields.flatMap((f) => f.coordinates.coordinates[0]);
    const lat = allPoints.reduce((s, [, y]) => s + y, 0) / allPoints.length;
    const lng = allPoints.reduce((s, [x]) => s + x, 0) / allPoints.length;
    return [lat, lng];
  }, [fields]);

  // Animate map to selected field
  useEffect(() => {
    if (!selectedFieldId || !fields) return;
    const field = fields.find((f) => f.id === selectedFieldId);
    if (!field) return;
    const map = mapRef.current;
    if (!map) return;
    const { bounds } = getPolygonMeta(field.coordinates.coordinates);
    map.stop();
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 0.4 });
  }, [selectedFieldId, fields]);

  return (
    <div className="flex-1 relative">
      {fields && (
        <MapContainer
          ref={mapRef}
          center={initialCenter}
          zoom={13}
          className="h-full w-full"
          zoomControl={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds fields={fields} />
          {fields.map((field) => {
            const color = getCropColor(field.currentCrop.name);
            const isSelected = field.id === selectedFieldId;
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
                eventHandlers={{ click: () => selectField(field) }}
              >
                <Popup autoPan={false}>
                  <FieldPopupContent field={field} />
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
  );
}
