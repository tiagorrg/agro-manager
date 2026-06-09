# AgroScope Defense Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать финальную презентацию защиты AgroScope в формате `.pptx` со скриншотами реального интерфейса и готовым текстом выступления.

**Architecture:** Работа делится на три независимых артефактных потока: исследование референса и настройка презентационного workspace, съёмка реальных экранов через встроенный браузер, затем сборка редактируемой презентации через artifact-tool с последующей проверкой и экспортом. Содержательная часть опирается на утверждённый дизайн-спек и текущую документацию проекта.

**Tech Stack:** Codex in-app browser, Node REPL browser runtime, artifact-tool presentation JSX, Node.js scripts из `Presentations`, локальный React/Express проект AgroScope.

---

### Task 1: Подготовить презентационный workspace и референсы

**Files:**
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/profile-plan.txt`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/source-notes.txt`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/reference-audit.txt`
- Modify: `/Users/semen/Documents/Универ/Diplom/Примеры/ИТ2101_Асоян_Л_К_Презентация_ПРИМЕР.pptx` (только чтение)

- [ ] **Step 1: Проверить runtime презентаций**

Run:
```bash
node "/Users/semen/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/check_presentation_runtime.mjs" \
  --workspace "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense"
```

Expected: JSON с `hasExportPptx: true`.

- [ ] **Step 2: Разобрать примерную презентацию как визуальный референс**

Run:
```bash
node "/Users/semen/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/inspect_template_deck.mjs" \
  --workspace "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense" \
  --pptx "/Users/semen/Documents/Универ/Diplom/Примеры/ИТ2101_Асоян_Л_К_Презентация_ПРИМЕР.pptx"
```

Expected: сгенерированы PNG и manifest по исходному примеру.

- [ ] **Step 3: Зафиксировать профиль и ограничения**

Write:
```text
task mode: create
primary deck-profile: product-platform
secondary profile gates: engineering-platform
required proof objects:
- product workflow map
- interface-led capability proof
- architecture linkage
- roadmap / future state
source requirements:
- local app screenshots from localhost:3002
- stack and architecture from DOCUMENTATION.md
- existing presentation notes from docs/presentation/agroscope_presentations_pack.md
```

- [ ] **Step 4: Сохранить аудит референса и источников**

Write short notes covering:
```text
- what to borrow from the example deck: rhythm, academic framing, slide economy
- what to improve: more modern product visual system, better screenshot hierarchy
- what not to copy: generic student-template feel, dense text blocks
```

- [ ] **Step 5: Commit**

```bash
git add outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/profile-plan.txt \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/source-notes.txt \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/reference-audit.txt
git commit -m "Подготовить workspace для презентации AgroScope"
```

### Task 2: Снять финальные скриншоты приложения

**Files:**
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/assets/screenshots/*.png`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/source-notes.txt`

- [ ] **Step 1: Открыть браузерную сессию и проверить текущую вкладку**

Use browser runtime to bind the selected in-app tab and name the session `🌿 AgroScope presentation`.

- [ ] **Step 2: Авторизоваться гостем и снять обзорные экраны**

Capture:
```text
- login screen
- dashboard
- map
```

Expected: PNG в едином viewport и без случайных раскрытых элементов.

- [ ] **Step 3: Авторизоваться агрономом и снять рабочие экраны**

Capture:
```text
- calendar
- operations or field detail
- documents
```

Expected: кадры подтверждают продуктовые сценарии и редактирование.

- [ ] **Step 4: Проверить читаемость кадров**

Verify for each PNG:
```text
- clear heading
- visible navigation context
- no modal overlap unless intentional
- no broken loading states
```

- [ ] **Step 5: Commit**

```bash
git add outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/assets/screenshots
git commit -m "Добавить скриншоты для презентации AgroScope"
```

### Task 3: Подготовить narrative spine и визуальную систему

**Files:**
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/claim-spine.txt`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/design-system.txt`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/contact-sheet-plan.txt`

- [ ] **Step 1: Зафиксировать тезис и арку**

Write:
```text
thesis: AgroScope объединяет карту, сезонное планирование, аналитику и документы в единый цифровой контур управления хозяйством.
audience: дипломная комиссия
one-line arc: от проблемы разрозненного управления к демонстрации работающего цифрового продукта и его архитектурной зрелости
```

- [ ] **Step 2: Прописать claims по 11 слайдам**

Each slide entry must include:
```text
- kicker
- claim title
- proof object
- source
```

- [ ] **Step 3: Зафиксировать дизайн-систему Green Executive**

Define:
```text
- slide size 1280x720
- warm light background
- pine green accent
- graphite text
- clean screenshot frames
- KPI and divider grammar
```

- [ ] **Step 4: Спланировать ритм contact sheet**

Require at least:
```text
- cover
- problem/goal
- product capability mosaic
- 4 interface proof slides
- architecture diagram
- stack summary
- conclusion slide
```

- [ ] **Step 5: Commit**

```bash
git add outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/claim-spine.txt \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/design-system.txt \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/contact-sheet-plan.txt
git commit -m "Подготовить сценарий и дизайн-систему презентации"
```

### Task 4: Собрать слайды и экспортировать PPTX

**Files:**
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/slides/slide-01.mjs` ... `slide-11.mjs`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/output/agroscope-defense-green-executive.pptx`
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/speech.md`

- [ ] **Step 1: Собрать cover и narrative slides**

Implement first slides with editable artifact-tool text and shapes.

- [ ] **Step 2: Встроить реальные screenshot-first слайды**

Use captured PNGs as proof objects with short callouts instead of large text blocks.

- [ ] **Step 3: Нарисовать архитектурную и стековую схемы**

Use shapes/connectors with explicit semantics, no generic decorative boxes.

- [ ] **Step 4: Экспортировать deck и превью**

Run:
```bash
node "/Users/semen/.codex/plugins/cache/openai-primary-runtime/presentations/26.521.10419/skills/presentations/scripts/build_artifact_deck.mjs" \
  --workspace "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense" \
  --slides-dir "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/slides" \
  --out "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/output/agroscope-defense-green-executive.pptx" \
  --preview-dir "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/preview" \
  --layout-dir "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/layout/final" \
  --contact-sheet "/Users/semen/Documents/Универ/Diplom/agro-manager/outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/preview/contact-sheet.png" \
  --slide-count 11
```

Expected: non-empty PPTX and rendered slide PNGs.

- [ ] **Step 5: Commit**

```bash
git add outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/slides \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/output/agroscope-defense-green-executive.pptx \
  outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/speech.md
git commit -m "Собрать презентацию AgroScope в формате PPTX"
```

### Task 5: Проверить качество и подготовить выдачу

**Files:**
- Create: `outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/qa/comeback-scorecard.txt`

- [ ] **Step 1: Проверить package и рендеры**

Verify:
```text
- pptx exists and non-empty
- 11 slides exported
- preview PNGs render cleanly
```

- [ ] **Step 2: Оценить deck по comeback rubric**

Record scores for story, rhythm, typography, coherence, specificity, chart clarity.

- [ ] **Step 3: Исправить слабые слайды при необходимости и пересобрать**

Re-run build command if any slide fails the visual gate.

- [ ] **Step 4: Подготовить итоговую выдачу**

Deliver:
```text
- path to final pptx
- short scorecard summary
- ready-to-use speech text
```

- [ ] **Step 5: Commit**

```bash
git add outputs/019e8431-3b1a-72a0-ad9a-fbace40ad270/presentations/agroscope-defense/qa/comeback-scorecard.txt
git commit -m "Проверить и подготовить выдачу презентации AgroScope"
```

