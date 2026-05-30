import { useFetch } from "../../shared/lib/useFetch";
import { fetchFields } from "../../shared/api/fields";
import MapSidebar from "../../components/MapSidebar";
import InteractiveMap from "../../components/InteractiveMap";

export default function MapPage() {
  const { data: fields, loading, error } = useFetch(fetchFields);

  return (
    <div className="flex h-full min-h-0 flex-col-reverse md:flex-row">
      <MapSidebar fields={fields} loading={loading} error={error} />
      <InteractiveMap fields={fields} loading={loading} error={error} />
    </div>
  );
}
