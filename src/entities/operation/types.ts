export type OperationType = "Посев" | "Обработка" | "Уборка" | "ВнесениеУдобрений";
export type OperationStatus = "План" | "Факт";

export interface Operation {
  id: number;
  fieldId: number;
  type: OperationType;
  status: OperationStatus;
  date: string;           // ISO date
  description?: string;
  equipmentId?: number;
  plannedYield?: number;  // ц/га — только для агронома
}
