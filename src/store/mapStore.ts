import { create } from "zustand";
import { fetchFieldDetail } from "../shared/api/fields";
import type { Field, FieldDetail } from "../entities/field/types";

interface MapStore {
  selectedFieldId: string | null;
  selectedDetail: FieldDetail | null;
  selectField: (field: Field) => void;
  clearSelection: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedFieldId: null,
  selectedDetail: null,

  selectField: (field: Field) => {
    set({ selectedFieldId: field.id, selectedDetail: null });
    fetchFieldDetail(field.id)
      .then((detail) => set({ selectedDetail: detail }))
      .catch(() => {});
  },

  clearSelection: () => set({ selectedFieldId: null, selectedDetail: null }),
}));
