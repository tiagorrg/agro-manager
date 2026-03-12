export interface FieldCoordinates {
  type: "Polygon";
  coordinates: [number, number][][];
}

export interface CurrentCrop {
  id: string;
  name: string;
}

export interface Field {
  id: string;
  name: string;
  area: number;          // га
  cadastralNumber?: string;
  currentCrop: CurrentCrop;
  coordinates: FieldCoordinates;
}

export interface FieldDetail extends Field {
  operations: import("../operation/types").Operation[];
  harvests: import("../harvest/types").Harvest[];
}
