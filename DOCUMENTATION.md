# AgroScope — Документация проекта

> Дипломный проект. Веб-система управления сельскохозяйственными угодьями.
> Документ актуален по состоянию на **май 2026**.

---

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Технологический стек](#2-технологический-стек)
3. [Архитектура и структура файлов](#3-архитектура-и-структура-файлов)
4. [Аутентификация и роли](#4-аутентификация-и-роли)
5. [Фронтенд](#5-фронтенд)
   - 5.1 [Слой app](#51-слой-app)
   - 5.2 [Страница Login](#52-страница-login)
   - 5.3 [Страница Dashboard](#53-страница-dashboard)
   - 5.4 [Страница Map](#54-страница-map)
   - 5.5 [Страница Calendar (заглушка)](#55-страница-calendar-заглушка)
   - 5.6 [Виджеты](#56-виджеты)
   - 5.7 [Shared-слой](#57-shared-слой)
   - 5.8 [Entities — типы данных](#58-entities--типы-данных)
6. [Бэкенд](#6-бэкенд)
   - 6.1 [Точка входа и middleware](#61-точка-входа-и-middleware)
   - 6.2 [Маршруты (routes)](#62-маршруты-routes)
   - 6.3 [Контроллеры](#63-контроллеры)
   - 6.4 [Слой данных (data)](#64-слой-данных-data)
7. [API — справочник эндпоинтов](#7-api--справочник-эндпоинтов)
8. [Внешние API](#8-внешние-api)
9. [Цветовая схема культур](#9-цветовая-схема-культур)
10. [Запуск проекта](#10-запуск-проекта)
11. [Что реализовано / Что предстоит](#11-что-реализовано--что-предстоит)

---

## 1. Обзор проекта

**AgroScope** — веб-приложение для агрономов и руководителей хозяйств. Позволяет:

- Просматривать поля на интерактивной карте с реальными координатами (Leaflet + OpenStreetMap)
- Отслеживать ключевые метрики хозяйства (площадь, урожай, выполненность работ)
- Смотреть прогноз погоды на 7 дней для координат полей (Open-Meteo, без ключа)
- Анализировать распределение культур (donut-диаграмма на чистом SVG)
- Разграничивать доступ: гость (только просмотр) vs агроном (редактирование)

Проект состоит из двух независимых частей:
- `agro-manager/` — React-приложение (фронтенд)
- `agro-manager/backend/` — Express.js REST API (бэкенд)

---

## 2. Технологический стек

### Фронтенд

| Технология | Версия | Назначение |
|---|---|---|
| React | 19.2.1 | UI-фреймворк |
| TypeScript | 5.9.3 | Типизация (shared, entities) |
| React Router DOM | 7.13.1 | Клиентский роутинг |
| Tailwind CSS | 3.4.17 | Утилитарные стили |
| Leaflet | 1.9.4 | Картографическая библиотека |
| react-leaflet | 5.0.0 | React-обёртка над Leaflet |
| Open-Meteo API | — | Погода (бесплатно, без ключа) |

### Бэкенд

| Технология | Версия | Назначение |
|---|---|---|
| Node.js | LTS | Среда выполнения |
| Express | 5.2.1 | HTTP-сервер и роутинг |
| cors | 2.8.6 | CORS для запросов с фронта |

### Инструментарий

- **Create React App** — сборщик (webpack 5 под капотом)
- **PostCSS + autoprefixer** — обработка CSS
- **ESLint** — линтинг
- **sessionStorage** — хранение сессии пользователя
- **Git hook `post-commit`** — напоминание об обновлении `AGENTS.md` и `DOCUMENTATION.md` после каждого коммита

---

## 3. Архитектура и структура файлов

Фронтенд следует методологии **FSD (Feature-Sliced Design)**:

```
agro-manager/
├── AGENTS.md                     # правила архитектуры и работы для Codex
├── DOCUMENTATION.md              # этот файл
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── scripts/
│   └── git-hooks/
│       └── post-commit           # проверка обновления документации после коммита
│
├── backend/                      # Express.js API
│   ├── package.json
│   └── src/
│       ├── index.js              # точка входа, порт 3001
│       ├── routes/
│       │   ├── dashboard.js
│       │   ├── fields.js
│       │   ├── operations.js
│       │   └── harvests.js
│       ├── controllers/
│       │   ├── dashboardController.js
│       │   ├── fieldsController.js
│       │   ├── operationsController.js
│       │   └── harvestsController.js
│       └── data/                 # in-memory данные
│           ├── fields.js
│           ├── crops.js
│           ├── operations.js
│           ├── harvests.js
│           └── equipment.js
│
└── src/                          # React-приложение
    ├── index.js                  # ReactDOM.createRoot
    ├── App.js                    # BrowserRouter → Providers → Router
    │
    ├── app/                      # инициализация приложения
    │   ├── layout.jsx            # глобальная обёртка (Navbar + main)
    │   ├── providers.jsx         # AuthProvider
    │   └── router.jsx            # Routes + ProtectedRoute
    │
    ├── pages/
    │   ├── Login/index.jsx
    │   ├── Dashboard/index.jsx
    │   └── Map/index.jsx
    │
    ├── widgets/
    │   ├── navbar/index.jsx
    │   └── dashboard/
    │       ├── MetricCard.jsx
    │       ├── FieldsMiniMap.jsx
    │       ├── WeatherWidget.jsx
    │       └── CropPieChart.jsx
    │
    ├── features/
    │   └── auth/index.tsx        # AuthContext, useAuth, AuthProvider
    │
    ├── entities/                 # TypeScript-типы доменных объектов
    │   ├── field/types.ts
    │   ├── equipment/types.ts
    │   ├── harvest/types.ts
    │   └── operation/types.ts
    │
    └── shared/
        ├── api/
        │   ├── client.ts         # fetch-обёртка
        │   ├── dashboard.ts
        │   ├── fields.ts
        │   └── weather.ts        # Open-Meteo
        ├── config/
        │   ├── index.ts          # API_URL
        │   └── crops.ts          # CROP_COLORS, getCropColor()
        ├── lib/
        │   ├── useFetch.ts       # хук с отменой
        │   └── weatherCodes.ts   # WMO-коды → текст + иконка
        └── ui-kit/
            ├── button/index.tsx
            └── input/index.tsx
```

---

## 4. Аутентификация и роли

### Реализация

Файл: `src/features/auth/index.tsx`

Контекст `AuthContext` оборачивает всё приложение через `AuthProvider`. Состояние пользователя хранится в **sessionStorage** под ключом `agro_user` и восстанавливается при перезагрузке страницы.

### Пользователи (захардкожены)

| Логин | Пароль | Роль | Имя |
|---|---|---|---|
| `guest` | `guest` | `guest` | Гость |
| `agronomist` | `agronomist` | `agronomist` | Агроном |

### Тип User

```ts
type UserRole = "guest" | "agronomist";

interface User {
  login: string;
  role: UserRole;
  name: string;
}
```

### Хук useAuth

```ts
const { user, login, logout } = useAuth();
// login(loginVal, password): boolean — возвращает false если не найден
// logout(): void — очищает sessionStorage, редирект на /login
```

### Защищённые маршруты

`ProtectedRoute` в `src/app/router.jsx` проверяет `user !== null`. Если пользователь не авторизован — `<Navigate to="/login" replace />`.

---

## 5. Фронтенд

### 5.1 Слой app

#### `src/App.js`

Корневой компонент. Структура:
```
BrowserRouter
  └── Providers (AuthProvider)
        └── Router (Routes)
```

#### `src/app/router.jsx`

Определяет все маршруты приложения:

| Путь | Компонент | Доступ |
|---|---|---|
| `/login` | `<LoginPage>` | Публичный |
| `/dashboard` | `<DashboardPage>` | Защищённый |
| `/map` | `<MapPage>` | Защищённый |
| `/calendar` | заглушка | Защищённый |
| `*` | `<Navigate>` | → `/dashboard` или `/login` |

#### `src/app/layout.jsx`

Глобальная обёртка: `Navbar` сверху + `<main>` снизу.

Поддерживает два варианта:
- `variant="default"` — контейнер `max-w-7xl` с горизонтальными отступами (Dashboard)
- `variant="fullBleed"` — `flex-1 flex overflow-hidden` без ограничения ширины (Map)

---

### 5.2 Страница Login

**Файл:** `src/pages/Login/index.jsx`

#### Функциональные блоки

**Форма входа**
- Контролируемые инпуты: логин + пароль
- `noValidate` на форме — кастомная валидация
- `htmlFor`/`id` на каждом поле
- Имитация задержки сети 400 мс перед `login()`
- `role="alert"` на блоке ошибки (семантика)
- После успешного входа — `navigate("/dashboard")`

**Подсказка с тестовыми учётными данными**
- Блок `<aside>` с перечнем логин/пароль
- Рендерится только в development-режиме нет (всегда виден — для диплома)

---

### 5.3 Страница Dashboard

**Файл:** `src/pages/Dashboard/index.jsx`

Данные загружаются через `useFetch(fetchDashboard)`.

#### Макет

```
┌──────────────────────────┬──────────────┐
│  Левая колонка (flex-1)  │  Правая      │
│                          │  колонка     │
│  FieldsMiniMap           │  (320px)     │
│  WeatherWidget           │              │
│  [last ops placeholder]  │  MetricCard  │
│                          │  MetricCard  │
│                          │  MetricCard  │
│                          │  MetricCard  │
│                          │              │
│                          │  CropPieChart│
└──────────────────────────┴──────────────┘
```

#### Метрики (правая колонка)

| Карточка | API-поле | Единица | Тренд |
|---|---|---|---|
| Общая площадь | `totalArea` | га | `areaTrend` % |
| Активных полей | `activeFields` | поля | — |
| Прогноз урожая | `harvestForecast` | т | `harvestTrend` % |
| Выполнено работ | `completedOpsPercent` | % | — |

Все числовые значения защищены от `undefined`: `(data.totalArea ?? 0).toLocaleString("ru")`.

#### Состояния загрузки

- Пока `loading === true` — рендерится `MetricsSkeleton` (4 анимированных плашки)
- Пока `error !== null` — рендерится блок с текстом ошибки

---

### 5.4 Страница Map

**Файл:** `src/pages/Map/index.jsx`

#### Макет

```
┌──────────────┬────────────────────────────┐
│   Сайдбар    │                            │
│   (288px)    │   Leaflet MapContainer     │
│              │   (flex-1, fullBleed)      │
│  [поиск]     │                            │
│              │   Полигоны полей           │
│  Поле №1     │   Тултипы с названием      │
│  Поле №2     │   Легенда (bottom-left)    │
│  Поле №3     │                            │
│              │                            │
│  Итого: N га │                            │
└──────────────┴────────────────────────────┘
```

#### Функциональные блоки

**Список полей (сайдбар)**
- Данные из `fetchFields()` через `useFetch`
- Карточка поля: название, культура (цветная бейджа), площадь га
- Поиск по названию (фильтр на клиенте)
- Клик на карточку → выделяет поле, вызывает `FlyToField`

**Интерактивная карта**
- `MapContainer` с `scrollWheelZoom`, `zoomControl`, `dragging` (полная интерактивность)
- `TileLayer` — OpenStreetMap
- `Polygon` на каждое поле, цвет из `getCropColor(field.currentCrop.name)`
- `Tooltip` с именем поля (sticky)
- `FitBounds` — при первой загрузке подгоняет viewport под все поля

**FlyToField**
- `useMap()` hook
- `map.flyToBounds(bounds, { padding: [40,40], maxZoom: 15, duration: 1 })`
- Срабатывает при изменении `selectedFieldId`

**getPolygonMeta(coordinates)**
- Вычисляет centroid (среднее lat/lng) и bounds (min/max)
- Используется для fly-to и для передачи координат в WeatherWidget

**Легенда культур**
- Позиционирована `absolute bottom-6 left-[304px]`
- Цветные квадраты + название культуры
- Строится из уникальных культур загруженных полей

---

### 5.5 Страница Calendar (заглушка)

Маршрут `/calendar` пока возвращает `<div>Календарь — в разработке</div>`. Предназначена для планирования агротехнических операций по датам.

---

### 5.6 Виджеты

#### `widgets/navbar/index.jsx`

Sticky-шапка (`sticky top-0 z-50 bg-white shadow-sm`).

- **Логотип** — SVG-иконка + текст "AgroScope"
- **Навигация** — `NavLink` с активным состоянием (зелёный фон)
- **Пользователь** — имя + бейдж роли (Агроном / Гость) + кнопка выхода

Ссылки:

| Метка | Путь |
|---|---|
| Дашборд | `/dashboard` |
| Карта | `/map` |
| Календарь | `/calendar` |

---

#### `widgets/dashboard/MetricCard.jsx`

**Props:**

| Prop | Тип | Описание |
|---|---|---|
| `label` | string | Подпись карточки |
| `value` | string | Основное значение |
| `unit` | string | Единица измерения |
| `trend` | number \| null | % изменение (+ зелёный, - красный) |
| `icon` | ReactNode | SVG-иконка |

Тренд рендерится как `↑X% к прошлому году` (emerald) или `↓X%` (red). При `trend === null` блок тренда скрыт.

---

#### `widgets/dashboard/FieldsMiniMap.jsx`

Встроенная карта-превью на дашборде.

- Неинтерактивна: `scrollWheelZoom={false}`, `zoomControl={false}`, `dragging={false}`
- Высота 256px, скруглённые углы
- `FitBounds` подгоняет viewport под все поля при монтировании
- Полигон каждого поля залит цветом культуры (`fillOpacity: 0.4`)
- Легенда культур внутри карточки
- Кнопка "Открыть детальную карту" → `navigate("/map")`

**Важно — конвертация координат:**
GeoJSON хранит координаты как `[lng, lat]`, Leaflet ожидает `[lat, lng]`:
```js
coordinates[0].map(([lng, lat]) => [lat, lng])
```

---

#### `widgets/dashboard/WeatherWidget.jsx`

Блок текущей погоды и прогноза на 7 дней.

**Источник данных:** Open-Meteo API (бесплатно, без ключа).
**Координаты:** вычисляются как centroid из координат всех полей.

**Двухэтапная загрузка:**
1. Сначала загружаются поля (`fetchFields`) → вычисляется centroid
2. Затем по centroid запрашивается погода (`fetchWeather`)

**Отображаемые данные:**

*Текущая погода:*
- Температура (°C)
- Иконка + описание (WMO-код → текст)
- Скорость ветра (км/ч)
- Влажность (%)
- Осадки (мм)

*Прогноз (7 дней):*
- День недели + дата
- Иконка погоды
- Макс./мин. температура
- Полоска осадков (высота пропорциональна сумме мм, max 16px)

**Часовой пояс:** `Europe/Moscow`

---

#### `widgets/dashboard/CropPieChart.jsx`

Donut-диаграмма распределения культур. Реализована на **чистом SVG** (без сторонних библиотек).

**Props:**

| Prop | Тип | Описание |
|---|---|---|
| `data` | `{ crop, area, percentage }[]` | Данные из `/dashboard` |

**Техническая реализация:**

Каждый сегмент — `<circle>` с `strokeDasharray` + `strokeDashoffset`:
```
strokeDasharray  = "segLen circumference"
strokeDashoffset = -(cumulativeLen)
```
Группа повёрнута на `-90deg` чтобы первый сегмент начинался сверху.

**Интерактивность:**
- `onMouseEnter` / `onMouseLeave` на каждом `<circle>`
- В центре donut отображается: при ховере — процент культуры, иначе — общая площадь
- Цвета из `getCropColor(cropName)`

**Легенда под диаграммой:**
- Цветной квадрат + название культуры + площадь га + процент

---

### 5.7 Shared-слой

#### `shared/api/client.ts`

Универсальный HTTP-клиент на основе `fetch`:

```ts
apiClient.get<T>(path): Promise<T>
apiClient.post<T>(path, body): Promise<T>
apiClient.put<T>(path, body): Promise<T>
apiClient.delete<T>(path): Promise<T>
```

Базовый URL берётся из `shared/config/index.ts` → `API_URL`.
При статусе не-2xx выбрасывает `Error` с текстом ответа.

---

#### `shared/api/dashboard.ts`

```ts
interface DashboardData {
  totalArea: number;
  areaTrend: number;
  activeFields: number;
  harvestForecast: number;
  harvestTrend: number | null;
  completedOpsPercent: number;
  completedOps: number;
  totalOps: number;
  cropsDistribution: { crop: string; area: number; percentage: number }[];
  recentOperations: { id, fieldId, fieldName, date, type, status }[];
  yieldByYear: { year: number; totalGross: number }[];
}

fetchDashboard(): Promise<DashboardData>
```

---

#### `shared/api/fields.ts`

```ts
fetchFields(): Promise<Field[]>
```

---

#### `shared/api/weather.ts`

Запрашивает Open-Meteo API. Параметры: `lat`, `lng`, `days = 7`.

```ts
interface CurrentWeather {
  temperature: number;      // °C
  weatherCode: number;      // WMO
  windSpeed: number;        // км/ч
  humidity: number;         // %
  precipitation: number;    // мм
}

interface DailyForecast {
  date: string;             // "2026-03-13"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windSpeedMax: number;
}

interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
}

fetchWeather(lat, lng, days?): Promise<WeatherData>
```

---

#### `shared/config/crops.ts`

Единый источник правды для цветов культур. Используется на карте, в мини-карте и в диаграмме.

```ts
getCropColor(cropName: string): string
```

---

#### `shared/lib/useFetch.ts`

```ts
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(fetcher: () => Promise<T>): FetchState<T>
```

Внутри использует флаг `cancelled` для предотвращения обновления состояния после размонтирования компонента.

---

#### `shared/lib/weatherCodes.ts`

Маппинг WMO-кодов погоды → `{ label: string, icon: string }`.

```ts
getWeatherInfo(code: number): { label: string; icon: string }
formatWeekday(dateStr: string): string   // "2026-03-13" → "Чт"
formatShortDate(dateStr: string): string // "2026-03-13" → "13 мар"
```

---

#### `shared/ui-kit`

**Button** (`button/index.tsx`):

| Prop | Варианты |
|---|---|
| `variant` | `primary` (зелёный фон, белый текст), `secondary` |
| `size` | `md` (h-8 px-4) |

**Input** (`input/index.tsx`):
- `variant: "primary"` — border-gray-300, focus ring-2 зелёный
- Принимает все стандартные HTMLInputElement props

---

### 5.8 Entities — типы данных

#### `entities/field/types.ts`

```ts
interface FieldCoordinates {
  type: "Polygon";
  coordinates: [number, number][][]; // GeoJSON: [[lng, lat], ...]
}

interface CurrentCrop {
  id: string;
  name: string;
}

interface Field {
  id: string;
  name: string;
  area: number;             // га
  cadastralNumber?: string;
  currentCrop: CurrentCrop;
  coordinates: FieldCoordinates;
}

interface FieldDetail extends Field {
  operations: Operation[];
  harvests: Harvest[];
}
```

#### `entities/operation/types.ts`

```ts
type OperationType = "Посев" | "Обработка" | "Уборка" | "ВнесениеУдобрений";
type OperationStatus = "План" | "Факт";

interface Operation {
  id: string;
  fieldId: string;
  type: OperationType;
  status: OperationStatus;
  date: string;             // ISO 8601
  description?: string;
  equipmentId?: string;
  plannedYield?: number;    // ц/га
}
```

#### `entities/harvest/types.ts`

```ts
interface Harvest {
  id: string;
  fieldId: string;
  year: number;
  crop: string;
  yieldPerHa: number;   // ц/га
  totalYield: number;   // ц
}
```

#### `entities/equipment/types.ts`

```ts
type EquipmentType = "Трактор" | "Комбайн" | "Опрыскиватель";

interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  model: string;
}
```

---

## 6. Бэкенд

### 6.1 Точка входа и middleware

**Файл:** `backend/src/index.js`

- **Порт:** `process.env.PORT ?? 3001`
- **Middleware:** `cors()`, `express.json()`
- **Health check:** `GET /health` → `{ status: 'ok' }`

```
Маршруты:
  /fields      → fieldsRouter
  /operations  → operationsRouter
  /harvests    → harvestsRouter
  /dashboard   → dashboardRouter
```

---

### 6.2 Маршруты (routes)

| Файл | Метод | Путь | Контроллер |
|---|---|---|---|
| `routes/fields.js` | GET | `/fields` | `fieldsController.getAll` |
| `routes/fields.js` | GET | `/fields/:id` | `fieldsController.getById` |
| `routes/operations.js` | GET | `/operations` | `operationsController.getAll` |
| `routes/operations.js` | GET | `/operations/:id` | `operationsController.getById` |
| `routes/harvests.js` | GET | `/harvests` | `harvestsController.getAll` |
| `routes/dashboard.js` | GET | `/dashboard` | `dashboardController.getSummary` |

---

### 6.3 Контроллеры

#### `fieldsController.js`

**getAll** — возвращает массив всех полей из `data/fields.js`.

**getById** — ищет поле по `id`, обогащает связанными операциями и урожаями:
```json
{
  "id": "field1",
  "name": "Поле №1",
  "operations": [...],
  "harvests": [...]
}
```
При отсутствии: `404 { error: 'Поле не найдено' }`.

---

#### `operationsController.js`

**getAll** — поддерживает query-параметры:
- `?fieldId=X` — фильтр по полю
- `?type=Посев` — фильтр по типу
- `?status=Факт` — фильтр по статусу

Каждая операция обогащается объектами `field`, `crop`, `equipment` по ID.

**getById** — возвращает обогащённую операцию или `404`.

---

#### `harvestsController.js`

**getAll** — поддерживает `?fieldId=X`. Каждый урожай обогащается полем и культурой.

---

#### `dashboardController.js`

**getSummary** — главный агрегирующий эндпоинт. Вычисляет:

| Поле | Логика |
|---|---|
| `totalArea` | Сумма `field.area` по всем полям |
| `areaTrend` | Статическое `5.0` (демо) |
| `activeFields` | `fields.length` |
| `cropsDistribution` | Группировка по культуре → `{ crop, area, percentage }[]` |
| `recentOperations` | Последние 5 по дате убыв., с `fieldName` |
| `yieldByYear` | `{ year, totalGross }[]` из таблицы урожаев |
| `harvestForecast` | `totalGross` последнего года |
| `harvestTrend` | `(lastYear - prevYear) / prevYear * 100` |
| `completedOps` | `operations.filter(op => op.status === 'Факт').length` |
| `completedOpsPercent` | `(completedOps / totalOps) * 100` |

---

### 6.4 Слой данных (data)

Все данные хранятся **в памяти** (CommonJS-массивы). База данных не подключена.

#### `data/fields.js` — Поля

| ID | Название | Площадь | Культура | Координаты |
|---|---|---|---|---|
| field1 | Поле №1 | 120.5 га | Пшеница озимая | 46.26°N, 39.51–39.54°E |
| field2 | Поле №2 | 85.0 га | Подсолнечник | 46.26–46.27°N, 39.52°E |
| field3 | Поле №3 | 95.0 га | Кукуруза | 46.24–46.26°N, 39.50–39.53°E |

Координаты — реальные, взяты с geojson.io / pkk.rosreestr.gov.ru.
Формат: GeoJSON Polygon `{ type: "Polygon", coordinates: [[[lng, lat], ...]] }`.

#### `data/crops.js` — Культуры

| ID | Название | Вегетация | Норм. урожай |
|---|---|---|---|
| crp1 | Пшеница озимая | 270 дн. | 48 ц/га |
| crp2 | Подсолнечник | 120 дн. | 28 ц/га |
| crp3 | Кукуруза | 150 дн. | 65 ц/га |
| crp4 | Ячмень яровой | 90 дн. | 38 ц/га |

#### `data/operations.js` — Операции (13 записей)

Охватывают 3 поля, типы: `Посев`, `Обработка`, `Уборка`, `ВнесениеУдобрений`.
Статусы: `Факт` (выполнено) и `План` (запланировано).

#### `data/harvests.js` — Урожаи (10 записей, 2022–2025)

Исторические данные по полям 1–3. Содержат: год, культуру, `yieldPerHa` (ц/га), `totalGross` (т), класс (для зерновых).

#### `data/equipment.js` — Техника (5 единиц)

| ID | Наименование | Тип | Модель |
|---|---|---|---|
| eq1 | Кировец К-744 | Трактор | К-744Р3 |
| eq2 | Ростсельмаш Torum | Комбайн | Torum 785 |
| eq3 | Amazone UX | Опрыскиватель | UX 11200 |
| eq4 | Lemken Diamant | Плуг | Diamant 11 |
| eq5 | John Deere 8R | Трактор | 8R 410 |

---

## 7. API — справочник эндпоинтов

Базовый URL: `http://localhost:3001`

### GET /health
```json
{ "status": "ok" }
```

### GET /fields
Возвращает массив всех полей с координатами и текущей культурой.

### GET /fields/:id
Возвращает поле + связанные операции и урожаи. `404` если не найдено.

### GET /operations
Query-параметры: `fieldId`, `type`, `status`. Возвращает обогащённые операции.

### GET /harvests
Query-параметры: `fieldId`. Возвращает обогащённые урожаи.

### GET /dashboard
Возвращает агрегированные метрики для дашборда:
```jsonc
{
  "totalArea": 300.5,
  "areaTrend": 5.0,
  "activeFields": 3,
  "harvestForecast": 201.9,    // т, за последний год
  "harvestTrend": -5.2,        // % к предыдущему году
  "completedOps": 9,
  "completedOpsPercent": 69.2,
  "totalOps": 13,
  "cropsDistribution": [
    { "crop": "Пшеница озимая", "area": 120.5, "percentage": 40.1 },
    ...
  ],
  "recentOperations": [...],   // последние 5
  "yieldByYear": [
    { "year": 2022, "totalGross": 168.2 },
    ...
  ]
}
```

---

## 8. Внешние API

### Open-Meteo

Используется в `shared/api/weather.ts` и `widgets/dashboard/WeatherWidget.jsx`.

- **URL:** `https://api.open-meteo.com/v1/forecast`
- **Ключ API:** не требуется
- **Запрашиваемые параметры:**
  - `current`: temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m, precipitation
  - `daily`: weather_code, temperature_2m_max, temperature_2m_min, precipitation_sum, wind_speed_10m_max
- **Часовой пояс:** `Europe/Moscow`
- **Горизонт прогноза:** 7 дней (после первого дня — сегодня пропускается)

---

## 9. Цветовая схема культур

Единый источник: `src/shared/config/crops.ts`

| Культура | HEX | Tailwind-аналог |
|---|---|---|
| Пшеница озимая | `#eab308` | yellow-500 |
| Подсолнечник | `#f97316` | orange-500 |
| Кукуруза | `#22c55e` | green-500 |
| Ячмень яровой | `#a78bfa` | violet-400 |
| (прочие) | `#94a3b8` | slate-400 |

Используется в: `FieldsMiniMap`, `MapPage`, `CropPieChart`.

---

## 10. Запуск проекта

### Бэкенд

```bash
cd agro-manager/backend
npm start
# Сервер запустится на http://localhost:3001
```

### Фронтенд

```bash
cd agro-manager
npm start
# Откроется http://localhost:3000
```

### Переменные окружения (опционально)

Создай `.env` в корне `agro-manager/`:
```
REACT_APP_API_URL=http://localhost:3001
```

По умолчанию это значение захардкожено в `shared/config/index.ts`.

---

### Сопровождение документации

После изменения архитектуры, правил разработки, запуска, структуры файлов или известных ограничений нужно обновлять оба файла:

- `AGENTS.md` — краткие правила для дальнейшей разработки и работы Codex
- `DOCUMENTATION.md` — подробная проектная документация

Для контроля добавлен версионируемый скрипт `scripts/git-hooks/post-commit`. Локальный hook `.git/hooks/post-commit` запускает этот скрипт после каждого коммита.

Hook проверяет список файлов в последнем коммите (`HEAD`). Если `AGENTS.md` или `DOCUMENTATION.md` не попали в коммит, он выводит предупреждение и команды:

```bash
git add AGENTS.md DOCUMENTATION.md
git commit --amend --no-edit
```

`post-commit` не отменяет уже созданный коммит, а сразу напоминает дополнить документацию и добавить изменения через `amend`.
