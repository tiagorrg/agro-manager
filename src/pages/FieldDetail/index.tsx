import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFieldDetail } from "../../shared/api/fields";
import FieldHeader from "../../components/FieldHeader";
import FieldMetrics from "../../components/FieldMetrics";
import OperationsTable from "../../components/OperationsTable";
import FieldEditModal from "../../components/FieldEditModal";
import type { FieldDetail } from "../../entities/field/types";
import type { Field } from "../../entities/field/types";

export default function FieldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<FieldDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setField(null);
    fetchFieldDetail(id)
      .then((data) => { if (!cancelled) { setField(data); setLoading(false); } })
      .catch((err: Error) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [id]);

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

      {field && editOpen && (
        <FieldEditModal
          field={field}
          onClose={() => setEditOpen(false)}
          onSave={(updated: Field) => {
            setField((prev) => prev ? { ...prev, ...updated } : prev);
            setEditOpen(false);
          }}
        />
      )}

      {field && (
        <>
          <FieldHeader field={field} onEdit={() => setEditOpen(true)} />
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
