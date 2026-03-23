import { apiClient } from "./client";
import type { OperationType, OperationStatus } from "../../entities/operation/types";

export interface CalendarOperation {
  id: string;
  fieldId: string;
  date: string;
  type: OperationType;
  status: OperationStatus;
  field: { id: string; name: string; area: number } | null;
  crop: { id: string; name: string } | null;
}

export const fetchOperations = (): Promise<CalendarOperation[]> =>
  apiClient.get<CalendarOperation[]>("/operations");
