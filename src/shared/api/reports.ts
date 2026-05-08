import { apiClient } from "./client";

export interface FieldStat {
  id: string;
  name: string;
  area: number;
  crop: string;
  total: number;
  completed: number;
}

export type ReportScope = "farm" | "field";

export interface ReportFilters {
  scope: ReportScope;
  fieldId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface ReportField {
  id: string;
  name: string;
  area: number;
  crop: string;
}

export interface ReportsData {
  scope: ReportScope;
  filters: { fieldId: string; dateFrom: string; dateTo: string };
  selectedField: ReportField | null;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
  yieldByYear: Record<string, number>;
  byField: FieldStat[];
  insights: string[];
  totals: { operations: number; fields: number; totalArea: number };
}

export const fetchReports = (filters?: ReportFilters): Promise<ReportsData> => {
  const params = new URLSearchParams();
  if (filters?.scope) params.set("scope", filters.scope);
  if (filters?.fieldId) params.set("fieldId", filters.fieldId);
  if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.set("dateTo", filters.dateTo);

  const query = params.toString();
  return apiClient.get<ReportsData>(query ? `/reports?${query}` : "/reports");
};
