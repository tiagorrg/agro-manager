type LatLngTuple = [number, number];

/** Вычисляет центроид и bounds полигона из GeoJSON-координат */
export function getPolygonMeta(coordinates: [number, number][][]): {
  centroid: LatLngTuple;
  bounds: LatLngTuple[];
} {
  const points = coordinates[0];
  const lats = points.map(([, lat]) => lat);
  const lngs = points.map(([lng]) => lng);
  const centroid: LatLngTuple = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];
  const bounds: LatLngTuple[] = points.map(([lng, lat]) => [lat, lng]);
  return { centroid, bounds };
}
