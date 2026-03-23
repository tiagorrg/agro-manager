import { apiClient } from "./client";
import type { OperationType, OperationStatus } from "../../entities/operation/types";

export type CalendarStatus = "Запланировано" | "В процессе" | "Выполнено";

export interface CalendarOperation {
  id: string;
  fieldId: string;
  date: string;
  timeStart?: string;
  timeEnd?: string;
  type: OperationType;
  status: OperationStatus;
  calendarStatus: CalendarStatus;
  field: { id: string; name: string; area: number } | null;
  crop: { id: string; name: string } | null;
}

export const fetchOperations = (): Promise<CalendarOperation[]> =>
  apiClient.get<CalendarOperation[]>("/operations");

export const patchOperationStatus = (id: string, calendarStatus: CalendarStatus): Promise<CalendarOperation> =>
  apiClient.patch<CalendarOperation>(`/operations/${id}/status`, { calendarStatus });
