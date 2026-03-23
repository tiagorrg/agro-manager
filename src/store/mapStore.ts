import { create } from "zustand";
import { fetchFieldDetail } from "../shared/api/fields";
import type { Field, FieldDetail } from "../entities/field/types";

interface MapStore {
  selectedFieldId: string | null;
  selectedDetail: FieldDetail | null;
  selectField: (field: Field) => void;
  clearSelection: () => void;
}

// Счётчик для отмены устаревших запросов при быстром переключении полей
let activeRequestId = 0;

export const useMapStore = create<MapStore>((set) => ({
  selectedFieldId: null,
  selectedDetail: null,

  selectField: (field: Field) => {
    const requestId = ++activeRequestId;
    set({ selectedFieldId: field.id, selectedDetail: null });
    fetchFieldDetail(field.id)
      .then((detail) => {
        if (requestId === activeRequestId) set({ selectedDetail: detail });
      })
      .catch(() => {});
  },

  clearSelection: () => {
    ++activeRequestId; // отменяет любой активный запрос
    set({ selectedFieldId: null, selectedDetail: null });
  },
}));
