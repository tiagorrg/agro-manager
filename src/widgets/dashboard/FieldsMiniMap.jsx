import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../shared/lib/useFetch";
import { fetchFields } from "../../shared/api/fields";
import { getCropColor, CROP_COLORS } from "../../shared/config/crops";
import "leaflet/dist/leaflet.css";

// Подгоняет bounds карты под все полигоны
function FitBounds({ fields }) {
  const map = useMap();

  useEffect(() => {
    if (!fields?.length) return;
    const allPoints = fields.flatMap((f) =>
      f.coordinates.coordinates[0].map(([lng, lat]) => [lat, lng])
    );
    if (allPoints.length) map.fitBounds(allPoints, { padding: [16, 16] });
  }, [fields, map]);

  return null;
}

function MapLegend() {
  const entries = Object.entries(CROP_COLORS);
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
      {entries.map(([crop, color]) => (
        <li key={crop} className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
          {crop}
        </li>
      ))}
    </ul>
  );
}

export default function FieldsMiniMap() {
  const { data: fields, loading, error } = useFetch(fetchFields);
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Поля хозяйства</h3>
        <button
          onClick={() => navigate("/map")}
          className="text-xs text-green-primary font-medium hover:underline"
        >
          Открыть детальную карту →
        </button>
      </div>

      {/* Карта */}
      <div className="relative h-64 mx-5">
        {loading && (
          <div className="absolute inset-0 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-gray-400 text-sm">
            Загрузка карты...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-red-50 rounded-xl flex items-center justify-center text-red-400 text-sm">
            Ошибка загрузки
          </div>
        )}
        {fields && (
          <MapContainer
            center={[45.06, 38.92]}
            zoom={12}
            scrollWheelZoom={false}
            zoomControl={false}
            dragging={false}
            doubleClickZoom={false}
            className="h-full w-full rounded-xl"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <FitBounds fields={fields} />
            {fields.map((field) => {
              const color = getCropColor(field.currentCrop.name);
              // GeoJSON: [lng, lat] → Leaflet: [lat, lng]
              const positions = field.coordinates.coordinates[0].map(
                ([lng, lat]) => [lat, lng]
              );
              return (
                <Polygon
                  key={field.id}
                  positions={positions}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.4,
                    weight: 2,
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
      </div>

      {/* Легенда */}
      <div className="px-5 py-3 border-t border-gray-50">
        <MapLegend />
      </div>
    </section>
  );
}
