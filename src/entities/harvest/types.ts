export interface Harvest {
  id: string;
  fieldId: string;
  date: string;               // ISO date (дата уборки)
  cropId: string;
  grossHarvest: number;       // ц (валовый сбор)
  yield: number;              // ц/га (урожайность)
  grainQuality: string | null;
}
