import { apiClient } from "./client";
import type { Field, FieldDetail } from "../../entities/field/types";

export const fetchFields = () => apiClient.get<Field[]>("/fields");
export const fetchFieldDetail = (id: string) => apiClient.get<FieldDetail>(`/fields/${id}`);
