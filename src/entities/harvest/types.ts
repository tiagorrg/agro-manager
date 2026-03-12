export interface Harvest {
  id: number;
  fieldId: number;
  year: number;
  crop: string;
  yieldPerHa: number;    // ц/га
  totalYield: number;    // ц
}
