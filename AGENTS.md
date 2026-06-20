# Agro Manager — AGENTS.md

Короткий роутер для Codex в `/Users/semen/Documents/Универ/Diplom/agro-manager`.

## Базовые правила

- Отвечай пользователю по-русски, если он не попросил другой язык.
- Сначала определяй, какой слой затронут: `frontend`, `backend` или оба.
- Не редактируй `.agents/`, `.cursor/` и чужие project-config директории без явной просьбы.
- Для нетривиальных задач предпочитай локальные skills из `.codex/skills/`, а не раздувай логику в ответе.

## Локальные skills проекта

- `agro-subagent-handoff`
  Используй, когда задача не trivial: есть несколько слоёв, discovery, review, QA, риск регрессии или смысл разложить работу на bounded streams.

- `agro-frontend-guard`
  Используй, когда меняется frontend-архитектура, page/component/store/data-flow, маршруты, карта, auth или общие frontend-контракты.

- `agro-backend-contracts`
  Используй, когда меняется backend data/model/controller/route, API-контракты или связка `backend -> shared/api -> frontend`.

- `agro-app-audit`
  Используй, когда пользователь просит аудит, QA, поиск багов, UX-проблем, архитектурных рисков или ручное тестирование приложения.

- `agro-feature-ideation`
  Используй, когда пользователь просит придумать, сравнить, выбрать или обосновать новую фичу для дипломного agro-manager.

## Контекст проекта

- Frontend: React 19, TypeScript 5, React Router 7, Zustand 5, Tailwind CSS 3, Leaflet
- Backend: Node.js + Express 5, CommonJS
- Данные: in-memory файлы в `backend/src/data`
- Сборка: Create React App
- Документы: MVP-модуль `/documents` с DOCX-шаблонами, генерацией через `docxtemplater` и хранением файлов в `uploads/templates`
- Публичная демо-сборка: GitHub Pages через `REACT_APP_DEMO=true`, данные и DOCX-шаблоны работают на frontend без Express API

## Что важно помнить

- `src/shared/lib/useFetch.ts` не перезапускается от изменения `fetcher`; не менять его поведение без прямой задачи.
- `src/shared/demo/` — статический demo-слой для GitHub Pages. Он должен повторять формы ответов Express API и хранить изменяемые данные в `localStorage`.
- В `src/store/mapStore.ts` `selectedDetail === null` может означать и "ничего не выбрано", и "идёт загрузка"; сначала проверяй `selectedFieldId`.
- `widgets/` и `shared/ui-kit/` не трогай без явной причины.
- Контракт документов проходит по цепочке `backend/src/services/documents -> backend/src/controllers/documentsController.js -> src/shared/api/documents.ts -> src/pages/Documents`.
- Backend документов принимает DOCX-шаблоны как `templateContentBase64` в JSON; лимит `express.json` на сервере уже повышен под этот сценарий.
- В demo-режиме `/documents` использует клиентский `docxtemplater` и сохраняет шаблоны в `localStorage`; backend-режим оставлен без изменений.
- Если меняешь архитектурные правила, маршруты, API-контракты или ограничения проекта, обнови `AGENTS.md` и при необходимости `DOCUMENTATION.md`.

## После изменений

В финале всегда давай команды:

```bash
git add <измененные файлы>
git commit -m "Короткое описание изменений по-русски"
```
