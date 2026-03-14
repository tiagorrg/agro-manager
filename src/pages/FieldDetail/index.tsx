import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../shared/lib/useFetch";
import { fetchFieldDetail } from "../../shared/api/fields";
import FieldHeader from "../../components/FieldHeader";
import FieldMetrics from "../../components/FieldMetrics";
import OperationsTable from "../../components/OperationsTable";

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: field, loading, error } = useFetch(() => fetchFieldDetail(id!));

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
      >
        ← Назад
      </button>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-56 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-sm">Не удалось загрузить данные поля</div>
      )}

      {field && (
        <>
          <FieldHeader field={field} />
          <FieldMetrics field={field} />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Операции</h2>
            <OperationsTable operations={field.operations} />
          </div>
        </>
      )}
    </div>
  );
}
