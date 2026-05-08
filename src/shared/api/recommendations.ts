import { apiClient } from "./client";

export type RecommendationSeverity = "high" | "medium" | "low" | "info";
export type RecommendationKind = "overdue" | "stale" | "no_plan" | "upcoming";

export interface RecommendationItem {
  id: string;
  severity: RecommendationSeverity;
  kind: RecommendationKind;
  title: string;
  description: string;
  fieldId: string | null;
  fieldName: string | null;
  operationId: string | null;
  date: string | null;
  actionLabel: string;
  actionHref: string;
}

export interface RecommendationsData {
  generatedAt: string;
  summary: Record<RecommendationSeverity, number> & { total: number };
  items: RecommendationItem[];
}

export const fetchRecommendations = () =>
  apiClient.get<RecommendationsData>("/recommendations");
