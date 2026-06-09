# Чеклист скриншотов для слайдов AgroScope

## Подготовка
- Поднять backend: `cd /Users/semen/Documents/Универ/Diplom/agro-manager/backend && npm install && npm run start`
- Поднять frontend: `cd /Users/semen/Documents/Универ/Diplom/agro-manager && npm install && npm start`
- Доступ к приложению: `http://localhost:3000`
- Если используете автоматический снятие через Playwright, заранее установить:
  - `npm install -D playwright`
  - `npx playwright install chromium`

## Рекомендуемые скриншоты для презентации

### Блок 1. Вход и дашборд
- `01-login.png` — `http://localhost:3000/login`
- `02-dashboard-guest.png` — `http://localhost:3000/dashboard` под входом гостя
- `03-dashboard-metrics.png` — тот же экран с акцентом на метриках

### Блок 2. Карта и поля
- `04-map-guest.png` — `http://localhost:3000/map` под гостем
- `05-fields.png` — `http://localhost:3000/fields`
- `06-field-detail.png` — `http://localhost:3000/fields/field1`

### Блок 3. Планирование и операции
- `07-calendar.png` — `http://localhost:3000/calendar`
- `08-calendar-admin-new-task.png` — календарь под `agronomist` после нажатия `Новая задача`
- `09-operations.png` — `http://localhost:3000/operations`

### Блок 4. Отчеты и документы
- `10-reports.png` — `http://localhost:3000/reports`
- `11-documents-empty.png` — `http://localhost:3000/documents` (по умолчанию)
- `12-field-edit.png` — `http://localhost:3000/fields/field1` с открытой модалкой редактирования (роль agronomist)

## Автоматический capture
- Скрипт: `scripts/capture-agroscope-screenshots.js`
- Запуск: `node scripts/capture-agroscope-screenshots.js`
- Артефакты: `docs/presentation/screenshots/guest/*.png` и `docs/presentation/screenshots/agronomist/*.png`

## Ручная альтернатива (без Playwright)
- Сделайте скриншоты экрана приложения из браузера в одном размере окна (например, 1600x960), чтобы все кадры были в одной пропорции.
- Удобно: сначала войти как гостем и сделать кадры блока 1–2, затем войти как агрономист и снять кадры блока 3–4.
