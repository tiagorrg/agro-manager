import { apiClient } from "./client";

export interface CropDistribution {
  crop: string;
  area: number;
  percentage: number;
}

export interface RecentOperation {
  id: string;
  fieldId: string;
  fieldName: string | null;
  date: string;
  type: string;
  status: "Факт" | "План";
}

export interface YieldByYear {
  year: number;
  totalGross: number;
}

export interface DashboardData {
  totalArea: number;
  areaTrend: number;
  activeFields: number;
  harvestForecast: number;
  harvestTrend: number | null;
  completedOpsPercent: number;
  completedOps: number;
  totalOps: number;
  cropsDistribution: CropDistribution[];
  recentOperations: RecentOperation[];
  yieldByYear: YieldByYear[];
}

export const fetchDashboard = () => apiClient.get<DashboardData>("/dashboard");
