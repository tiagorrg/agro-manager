# Архитектура проекта

## Стек
React 19, TypeScript, React Router v7, Zustand, Leaflet + React Leaflet, Tailwind CSS.

## Структура src/

```
pages/       — тонкая оболочка страницы
components/  — узкоспециализированные компоненты страниц
widgets/     — самодостаточные виджеты (не трогать без запроса)
shared/
  ui-kit/    — UI примитивы: Button, Input, иконки (не трогать без запроса)
  api/       — функции запросов к API
  lib/       — утилиты (useFetch, geo, и др.)
  config/    — конфигурация (crops, и др.)
entities/    — типы доменных сущностей (Field, Operation, и др.)
store/       — Zustand-сторы
features/    — фичи (auth, и др.)
```

## Правила

### pages/
- Владеют роутингом: `useParams`, `useNavigate`
- Владеют fetch данных страницы: `useFetch` → пробрасывают через props
- Компонуют несколько компонентов в layout
- Импортируют только из `components/` и `widgets/`
- Никакой монолитной логики — только оркестрация

### components/
- Каждый компонент делает **одно**: `MapSidebar`, `InteractiveMap`, `FieldHeader`, `FieldMetrics`, `OperationsTable`
- Получают данные через props или из store
- Сами не делают fetch, если соседний компонент нуждается в тех же данных
- Используются напрямую в pages/

### widgets/
- Самодостаточны, могут делать fetch сами
- Примеры: `FieldsMiniMap`, `WeatherWidget`, `MetricCard`, `CropPieChart`
- **Не изменять** без явного запроса

### shared/ui-kit/
- Только атомарные UI-примитивы без бизнес-логики
- **Не изменять** без явного запроса

### store/
- Zustand для состояния, которое разделяют компоненты-соседи на одной странице
- Пример: `mapStore` — `selectedFieldId` / `selectedDetail` между `MapSidebar` ↔ `InteractiveMap`

## Правило разбиения
- Компонент делает больше одного — **разбей**
- Страница не оркестрирует — **что-то не так**
- Новый файл нужен, только если у него есть своя узкая ответственность

---

## Текущая архитектура (март 2026)

### Стек

| Слой | Технологии |
|---|---|
| Frontend | React 19, TypeScript 5, React Router 7, Zustand 5, Tailwind CSS 3 |
| Карта | Leaflet 1.9 + react-leaflet 5 |
| Backend | Node.js + Express 5, CommonJS, in-memory data |
| Внешние API | Open-Meteo (погода, без ключа) |
| Сборка | Create React App (webpack 5) |

### Маршруты

```
/login              — публичный
/dashboard          — защищённый, дашборд с виджетами
/map                — защищённый, fullBleed layout, Leaflet-карта
/fields/:id         — защищённый, детали поля
/calendar           — заглушка
```

### Backend API

```
GET /fields             — список полей
GET /fields/:id         — поле + операции + урожаи
GET /dashboard          — агрегированные метрики фермы
GET /operations         — список операций (фильтры: ?fieldId, ?type, ?status)
GET /operations/:id     — операция с enriched-данными
GET /harvests           — список урожаев
GET /health             — { status: "ok" }
```

### Ключевые решения

- **Нет БД** — данные хранятся в JS-объектах (`backend/src/data/`). Это допустимо для дипломного проекта.
- **Аутентификация** — хардкод (`guest/guest`, `agronomist/agronomist`), сессия в `sessionStorage`.
- **Состояние карты** — Zustand (`mapStore`): `selectedFieldId` + `selectedDetail` разделяются между `MapSidebar` и `InteractiveMap`.
- **Погода** — виджет сам вычисляет центроид полей и вызывает Open-Meteo.

---

## Известные ограничения и принципы разработки

### Критические паттерны — соблюдать

**`useFetch` запускается один раз** — хук принимает `fetcher` но не перезапускается при его изменении (пустой dep array, eslint-disable). Не использовать `useFetch` там, где fetcher зависит от пропсов или параметров URL — вместо этого вызывать fetcher напрямую в `useEffect` с нужными зависимостями.

**`mapStore.selectedDetail: null`** имеет двойной смысл: и "не выбрано", и "грузится". Проверять `selectedFieldId` первым:
```typescript
// Правильно:
if (!selectedFieldId) → ничего не выбрано
if (selectedFieldId && !selectedDetail) → грузится
if (selectedDetail) → готово
```

**Ошибки в `mapStore.selectField`** проглатываются (`.catch(() => {})`). Если добавляешь обработку ошибок в сторе — добавь поле `detailError: string | null`.

### Что не трогать без явной задачи

- `shared/ui-kit/` — атомарные примитивы
- `widgets/` — самодостаточные виджеты с собственным fetch
- `shared/lib/useFetch.ts` — смена dep array сломает все страницы

### Backend

- Нет middleware для 404 — при обращении к несуществующему ресурсу контроллер вернёт `undefined` без статуса. Добавлять явный `res.status(404).json(...)` при отсутствии данных.
- CORS полностью открыт (`app.use(cors())`). Для production ограничить origins.
- Типизации нет — JSDoc или миграция на TypeScript при расширении.

### Нет Error Boundary

В приложении нет React Error Boundary. Любая JS-ошибка в дереве обрушит весь UI. При добавлении сложной логики оборачивать в `<ErrorBoundary>`.

---

## Критические файлы — всегда читать перед изменениями

Эти файлы используются широко. Изменение в одном влечёт каскадные эффекты — **прочитай перед тем, как трогать**.

| Файл | Почему критический | Кто зависит |
|---|---|---|
| `src/shared/api/client.ts` | Все API-запросы идут через него | Все `shared/api/*.ts` |
| `src/shared/lib/useFetch.ts` | Каждая страница использует этот хук; пустой dep array — меняя сигнатуру, сломаешь всё | `Dashboard`, `Map`, `FieldDetail`, `Login` |
| `src/store/mapStore.ts` | Синхронизирует sidebar ↔ карту; содержит async fetch без отмены | `MapSidebar`, `InteractiveMap` |
| `src/entities/field/types.ts` | Базовый тип `Field` / `FieldDetail` — используется везде | Все компоненты, store, api |
| `src/features/auth/index.tsx` | Auth context + хардкод credentials; используется в трёх местах | `app/router`, `widgets/navbar`, `components/LoginForm` |
| `src/app/router.tsx` | Все маршруты + `ProtectedRoute`; ошибка здесь блокирует весь доступ | Всё приложение |
| `backend/src/data/fields.js` | Источник правды для всех backend-контроллеров | `fieldsController`, `operationsController`, `harvestsController`, `dashboardController` |

### Правило

После того как ты закончил изменения по конкретной задачи пишешь:
1. Команды для индекса и коммита:
```bash
git add <измененные файлы>
git commit -m "Короткое описание изменений по-русски"
```
2. Если изменение влияет на архитектуру, правила разработки, запуск, структуру файлов или проектные ограничения — дополни `AGENTS.md` и `DOCUMENTATION.md` в том же коммите.
3. В репозитории есть локальный `post-commit` hook: `.git/hooks/post-commit` запускает версионируемый скрипт `scripts/git-hooks/post-commit`. После каждого коммита он проверяет, попали ли `AGENTS.md` и `DOCUMENTATION.md` в последний коммит, и подсказывает команды для `git commit --amend --no-edit`, если документация не обновлена.

Перед изменением любого файла из таблицы:
1. Прочитай сам файл
2. Прочитай всех его потребителей (колонка "Кто зависит")
3. Убедись, что изменение не ломает контракт (типы, сигнатуры функций)
