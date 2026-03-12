export type EquipmentType = "Трактор" | "Комбайн" | "Опрыскиватель";

export interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  model: string;
}
