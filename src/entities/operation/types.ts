export type OperationType = "Посев" | "Обработка" | "Уборка" | "ВнесениеУдобрений";
export type OperationStatus = "План" | "Факт";

export interface Operation {
  id: string;
  fieldId: string;
  type: OperationType;
  status: OperationStatus;
  date: string;           // ISO date
  timeStart?: string;
  timeEnd?: string;
  description?: string;
  cropId?: string;
  equipmentId?: string;
  calendarStatus?: string;
}
