import { getPolygonMeta } from "./geo";

type Coords = [number, number][][];

describe("getPolygonMeta", () => {
  const square: Coords = [
    [
      [39.0, 46.0],
      [39.2, 46.0],
      [39.2, 46.2],
      [39.0, 46.2],
    ],
  ];

  it("вычисляет центроид прямоугольника", () => {
    const { centroid } = getPolygonMeta(square);
    expect(centroid[0]).toBeCloseTo(46.1); // lat
    expect(centroid[1]).toBeCloseTo(39.1); // lng
  });

  it("возвращает bounds в порядке [lat, lng] (Leaflet)", () => {
    const { bounds } = getPolygonMeta(square);
    expect(bounds[0]).toEqual([46.0, 39.0]);
    expect(bounds[1]).toEqual([46.0, 39.2]);
  });

  it("количество bounds совпадает с количеством точек полигона", () => {
    const { bounds } = getPolygonMeta(square);
    expect(bounds).toHaveLength(square[0].length);
  });

  it("центроид единственной точки равен ей самой", () => {
    const point: Coords = [[[10.5, 55.3]]];
    const { centroid } = getPolygonMeta(point);
    expect(centroid[0]).toBeCloseTo(55.3);
    expect(centroid[1]).toBeCloseTo(10.5);
  });
});
