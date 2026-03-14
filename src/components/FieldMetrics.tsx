import MetricCard from "../widgets/dashboard/MetricCard";
import { IconArea, IconHarvest, IconOps, IconFields } from "../shared/ui-kit/icons";
import type { FieldDetail } from "../entities/field/types";

interface Props {
  field: FieldDetail;
}

export default function FieldMetrics({ field }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <MetricCard label="Площадь" value={String(field.area)} unit="га" icon={<IconArea />} />
      <MetricCard label="Культура" value={field.currentCrop.name} unit="текущий сезон" icon={<IconHarvest />} />
      <MetricCard label="Операций" value={String(field.operations.length)} unit="всего" icon={<IconOps />} />
      <MetricCard label="Урожаев" value={String(field.harvests.length)} unit="сезонов" icon={<IconFields />} />
    </div>
  );
}
