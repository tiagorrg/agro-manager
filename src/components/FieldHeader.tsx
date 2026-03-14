import { getCropColor } from "../shared/config/crops";
import type { FieldDetail } from "../entities/field/types";

interface Props {
  field: FieldDetail;
}

export default function FieldHeader({ field }: Props) {
  const color = getCropColor(field.currentCrop.name);
  return (
    <div className="flex items-start gap-3 mb-6">
      <span
        className="w-1.5 self-stretch rounded-full shrink-0 mt-1"
        style={{ backgroundColor: color }}
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{field.name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {field.currentCrop.name} · {field.area} га
          {field.cadastralNumber && ` · ${field.cadastralNumber}`}
        </p>
      </div>
    </div>
  );
}
