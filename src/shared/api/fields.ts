import { apiClient } from "./client";
import type { Field } from "../../entities/field/types";

export const fetchFields = () => apiClient.get<Field[]>("/fields");
