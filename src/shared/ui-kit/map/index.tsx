import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { Field } from "../../../entities/field/types";

type LatLngTuple = [number, number];

/** Подгоняет bounds карты под все переданные поля */
export function FitBounds({ fields }: { fields: Field[] }) {
  const map = useMap();
  useEffect(() => {
    if (!fields?.length) return;
    const all = fields.flatMap((f) =>
      f.coordinates.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngTuple)
    );
    if (all.length) map.fitBounds(all, { padding: [16, 16] });
  }, [fields, map]);
  return null;
}

/** Плавно перелетает к переданным bounds */
export function FlyToField({ target }: { target: LatLngTuple[] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyToBounds(target, { padding: [60, 60], maxZoom: 15, duration: 0.8 });
  }, [target, map]);
  return null;
}
