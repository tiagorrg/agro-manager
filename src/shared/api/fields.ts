import { apiClient } from "./client";
import type { Field, FieldDetail } from "../../entities/field/types";

// Кэш списка полей — данные статичны, повторные вызовы fetchFields() не делают лишних запросов
let fieldsCache: Promise<Field[]> | null = null;

export const fetchFields = (): Promise<Field[]> => {
  if (!fieldsCache) {
    fieldsCache = apiClient.get<Field[]>("/fields").catch((err) => {
      fieldsCache = null; // сбрасываем кэш при ошибке, чтобы следующий вызов повторил запрос
      throw err;
    });
  }
  return fieldsCache;
};

export const fetchFieldDetail = (id: string) => apiClient.get<FieldDetail>(`/fields/${id}`);
