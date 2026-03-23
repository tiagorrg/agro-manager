import { apiClient } from "./client";

export interface FieldStat {
  id: string;
  name: string;
  area: number;
  crop: string;
  total: number;
  completed: number;
}

export interface ReportsData {
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  yieldByYear: Record<string, number>;
  byField: FieldStat[];
  totals: { operations: number; fields: number; totalArea: number };
}

export const fetchReports = (): Promise<ReportsData> =>
  apiClient.get<ReportsData>("/reports");
