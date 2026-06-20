import { useState } from "react";
import type {
  DocumentTemplate,
  DocumentTemplateType,
  DocumentTokenDefinition,
} from "../entities/document/types";
import {
  GENERATION_MODE_LABELS,
  TOKEN_SECTION_LABELS,
  TEMPLATE_TYPE_LABELS,
} from "../pages/Documents/docx";

interface DocumentTemplatesPanelProps {
  templates: DocumentTemplate[];
  tokenCatalogByType: Record<DocumentTemplateType, DocumentTokenDefinition[]>;
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
  onDelete: (id: string) => Promise<void>;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={[
        "h-4 w-4 text-gray-400 transition-transform duration-200",
        isOpen ? "rotate-180" : "",
      ].join(" ")}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function TokenList({
  tokens,
  tone,
  emptyLabel,
}: {
  tokens: string[];
  tone: "neutral" | "danger";
  emptyLabel: string;
}) {
  if (tokens.length === 0) {
    return <span className="text-xs text-gray-400">{emptyLabel}</span>;
  }

  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      {tokens.map((token) => (
        <span
          key={token}
          className={[
            "break-all px-2 py-1 rounded-full text-[11px] font-medium border",
            tone === "danger"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-gray-50 text-gray-600 border-gray-200",
          ].join(" ")}
        >
          [{token}]
        </span>
      ))}
    </div>
  );
}

export default function DocumentTemplatesPanel({
  templates,
  tokenCatalogByType,
  isLoading,
  error,
  deletingId,
  onDelete,
}: DocumentTemplatesPanelProps) {
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isTemplatesListOpen, setIsTemplatesListOpen] = useState(false);

  const tokenGroups = (Object.entries(tokenCatalogByType) as Array<
    [DocumentTemplateType, DocumentTokenDefinition[]]
  >).map(([type, entries]) => {
    const groups = entries.reduce<Record<string, DocumentTokenDefinition[]>>((acc, entry) => {
      const key = entry.section;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {});

    return { type, groups };
  });

  const canCollapseTemplatesList = !isLoading && !error && templates.length > 0;
  const shouldShowTemplatesList = !canCollapseTemplatesList || isTemplatesListOpen;
  const totalTokenCount = tokenGroups.reduce(
    (count, group) =>
      count +
      Object.values(group.groups).reduce((innerCount, entries) => innerCount + entries.length, 0),
    0,
  );

  return (
    <section className="min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Шаблоны</h2>
          <p className="text-sm text-gray-400 mt-1">
            Список загруженных DOCX-шаблонов и их валидация.
          </p>
        </div>
        {!isLoading && (
          <span className="text-sm text-gray-400 shrink-0">{templates.length} шт.</span>
        )}
      </div>

      <div className="min-w-0 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
        <button
          type="button"
          onClick={() => setIsCheatSheetOpen((previous) => !previous)}
          aria-expanded={isCheatSheetOpen}
          aria-controls="document-token-cheat-sheet"
          className="w-full text-left flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-900">Шпаргалка по маркерам</p>
            <p className="mt-1 text-xs text-amber-900/80">
              Источник правды приходит с backend вместе с описаниями каждого маркера.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-medium text-amber-900/80">
              {totalTokenCount} маркеров
            </span>
            <ChevronIcon isOpen={isCheatSheetOpen} />
          </div>
        </button>

        {isCheatSheetOpen && (
          <div id="document-token-cheat-sheet" className="mt-3 grid gap-3 xl:grid-cols-2">
            {tokenGroups.map(({ type, groups }) => (
              <div key={type} className="min-w-0 rounded-xl bg-white/80 border border-amber-100 p-3">
                <p className="text-xs font-semibold text-gray-700">{TEMPLATE_TYPE_LABELS[type]}</p>
                <div className="mt-3 grid gap-3">
                  {Object.entries(groups).map(([section, entries]) => (
                    <div key={section} className="min-w-0 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                        {TOKEN_SECTION_LABELS[section as keyof typeof TOKEN_SECTION_LABELS]}
                      </p>
                      <ul className="mt-2 grid gap-2">
                        {entries.map((entry) => (
                          <li key={`${type}-${entry.token}`} className="break-words text-xs text-gray-600 leading-5">
                            <span className="break-all font-mono text-[11px] text-gray-800">[{entry.token}]</span>
                            {" — "}
                            {entry.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
        <button
          type="button"
          onClick={() => {
            if (canCollapseTemplatesList) {
              setIsTemplatesListOpen((previous) => !previous);
            }
          }}
          aria-expanded={shouldShowTemplatesList}
          aria-controls="document-templates-list"
          className="w-full text-left flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">Загруженные шаблоны</p>
            <p className="mt-1 text-xs text-gray-500">
              Здесь остаются проверка токенов, ошибки валидации и режимы генерации.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs font-medium text-gray-500">
              {isLoading ? "Загружаем..." : `${templates.length} шт.`}
            </span>
            {canCollapseTemplatesList && <ChevronIcon isOpen={isTemplatesListOpen} />}
          </div>
        </button>

        {shouldShowTemplatesList && (
          <div id="document-templates-list" className="mt-4">
            {isLoading && (
              <div className="grid gap-3">
                {[1, 2].map((index) => (
                  <div key={index} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                Не удалось загрузить шаблоны: {error}
              </div>
            )}

            {!isLoading && !error && templates.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center text-sm text-gray-400">
                Пока нет шаблонов. Загрузите первый DOCX-файл, чтобы включить генерацию документов.
              </div>
            )}

            {!isLoading && !error && templates.length > 0 && (
              <div className="grid gap-4">
                {templates.map((template) => (
                  <article
                    key={template.id}
                    className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-800 truncate">
                            {template.name}
                          </h3>
                          <span
                            className={[
                              "px-2 py-1 rounded-full text-[11px] font-semibold border",
                              template.isValid
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-600 border-red-100",
                            ].join(" ")}
                          >
                            {template.isValid ? "Готов к использованию" : "Нужна правка"}
                          </span>
                        </div>
                        <p className="mt-1 break-words text-sm text-gray-500">{template.fileName}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void onDelete(template.id)}
                        disabled={deletingId === template.id}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingId === template.id ? "Удаляем..." : "Удалить"}
                      </button>
                    </div>

                    <dl className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Тип</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-700">
                          {TEMPLATE_TYPE_LABELS[template.type]}
                        </dd>
                      </div>
                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Режимы</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-700">
                          {template.supportedModes.map((mode) => GENERATION_MODE_LABELS[mode]).join(", ")}
                        </dd>
                      </div>
                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Items-блок</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-700">
                          {template.hasItemsBlock ? "Есть" : "Нет"}
                        </dd>
                      </div>
                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Обновлён</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-700">
                          {formatDateTime(template.updatedAt)}
                        </dd>
                      </div>
                    </dl>

                    <div className="grid min-w-0 gap-4 xl:grid-cols-[1.4fr_1fr]">
                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3 flex flex-col gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Найденные маркеры
                        </p>
                        <TokenList
                          tokens={template.detectedTokens}
                          tone="neutral"
                          emptyLabel="Маркеры не найдены"
                        />
                      </div>

                      <div className="min-w-0 rounded-xl bg-gray-50/60 border border-gray-100 p-3 flex flex-col gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Неизвестные маркеры
                          </p>
                          <div className="mt-2">
                            <TokenList
                              tokens={template.unknownTokens}
                              tone="danger"
                              emptyLabel="Все маркеры распознаны"
                            />
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Ошибки валидации
                          </p>
                          {template.validationErrors.length === 0 ? (
                            <p className="mt-2 text-xs text-gray-400">Критичных ошибок нет</p>
                          ) : (
                            <ul className="mt-2 grid gap-2">
                              {template.validationErrors.map((errorText) => (
                                <li
                                  key={errorText}
                                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600"
                                >
                                  {errorText}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
