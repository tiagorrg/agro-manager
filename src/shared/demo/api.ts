import type { Field, FieldDetail } from "../../entities/field/types";
import type { Harvest } from "../../entities/harvest/types";
import type { Operation } from "../../entities/operation/types";
import type { DashboardData } from "../api/dashboard";
import type {
  CalendarOperation,
  CalendarStatus,
  CreateOperationInput,
} from "../api/operations";
import type { ReportFilters, ReportsData, ReportScope } from "../api/reports";
import type {
  RecommendationItem,
  RecommendationSeverity,
  RecommendationsData,
} from "../api/recommendations";

interface Crop {
  id: string;
  name: string;
  code: string;
  vegetationPeriod: number;
  plannedYield: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  regNumber: string | null;
}

type DemoOperation = Operation & {
  cropId?: string | null;
  equipmentId?: string | null;
  calendarStatus: CalendarStatus;
};

const DEMO_FIELDS: Field[] = [
  {
    id: "field1",
    name: "Поле №1",
    area: 120.5,
    cadastralNumber: "23:01:0101001:1",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.516622334508384, 46.26753728828723],
        [39.5405203713004, 46.255100730747984],
        [39.536206989854435, 46.25204459169328],
        [39.51272336193912, 46.26378965489343],
        [39.51655741492519, 46.26750778080364],
        [39.516622334508384, 46.26753728828723],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
  {
    id: "field2",
    name: "Поле №2",
    area: 85,
    cadastralNumber: "23:01:0101001:2",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.519217530995974, 46.26984216343425],
        [39.52021825338048, 46.2693390613363],
        [39.520824751795885, 46.26980023843561],
        [39.52864858135342, 46.265481791836294],
        [39.52852728167076, 46.26499961406367],
        [39.52952800405532, 46.263154720822115],
        [39.5327424456562, 46.26124686819591],
        [39.53165074850915, 46.26007277204235],
        [39.516973486859484, 46.26782972733531],
        [39.519217530995974, 46.26984216343425],
      ]],
    },
    currentCrop: { id: "crp2", name: "Подсолнечник" },
  },
  {
    id: "field3",
    name: "Поле №3",
    area: 95,
    cadastralNumber: "23:01:0101001:3",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.512150520329214, 46.263525741987706],
        [39.53582512524534, 46.251701689681255],
        [39.535066886771006, 46.249670786688],
        [39.53420735441344, 46.24888770593202],
        [39.53174745146018, 46.248144642255795],
        [39.508832251920325, 46.26021461015918],
        [39.51205680590644, 46.26344017011337],
        [39.512150520329214, 46.263525741987706],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
  {
    id: "field4",
    name: "Поле №4",
    area: 101.7,
    cadastralNumber: "23:01:0101001:4",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.508732091015474, 46.25999089734702],
        [39.5310551, 46.2479838],
        [39.5264533, 46.2476566],
        [39.5214873, 46.2492671],
        [39.5174049, 46.2488812],
        [39.5038563, 46.255395],
        [39.508732091015474, 46.25999089734702],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
  {
    id: "field5",
    name: "Поле №5",
    area: 103.8,
    cadastralNumber: "23:01:0101001:5",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.50353320390826, 46.255205012334045],
        [39.5160391, 46.248951],
        [39.514903, 46.2483001],
        [39.5164456, 46.2478729],
        [39.5180392, 46.2480969],
        [39.5229816, 46.2454347],
        [39.517103610173535, 46.24165048620216],
        [39.4991757, 46.2512027],
        [39.50353320390826, 46.255205012334045],
      ]],
    },
    currentCrop: { id: "crp2", name: "Подсолнечник" },
  },
  {
    id: "field6",
    name: "Поле №6",
    area: 98.6,
    cadastralNumber: "23:01:0101001:6",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.492972046129466, 46.267933393432116],
        [39.5040549, 46.2623993],
        [39.5029553, 46.2613144],
        [39.5046867, 46.260555],
        [39.5073111, 46.2594646],
        [39.50238803901155, 46.2552359697967],
        [39.4874578, 46.2625401],
        [39.492972046129466, 46.267933393432116],
      ]],
    },
    currentCrop: { id: "crp2", name: "Подсолнечник" },
  },
  {
    id: "field7",
    name: "Поле №7",
    area: 97.9,
    cadastralNumber: "23:01:0101001:7",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.487159826728146, 46.26240148133601],
        [39.5022202, 46.2548584],
        [39.4966751, 46.2499462],
        [39.4819111, 46.2573818],
        [39.487159826728146, 46.26240148133601],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
  {
    id: "field8",
    name: "Поле №8",
    area: 76.3,
    cadastralNumber: "23:01:0101001:8",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.51390014729196, 46.265824683981066],
        [39.498741, 46.2733151],
        [39.500585, 46.2745979],
        [39.5020918, 46.2749616],
        [39.5041474, 46.2736817],
        [39.5037539, 46.2731226],
        [39.504588, 46.2725452],
        [39.5053837, 46.2732656],
        [39.5025664, 46.2749239],
        [39.5073389, 46.2756785],
        [39.5105912, 46.2732529],
        [39.5156131, 46.2710559],
        [39.5174787, 46.2724498],
        [39.5199553, 46.2711384],
        [39.51390014729196, 46.265824683981066],
      ]],
    },
    currentCrop: { id: "crp2", name: "Подсолнечник" },
  },
  {
    id: "field9",
    name: "Поле №9",
    area: 98.3,
    cadastralNumber: "23:01:0101001:9",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.4986075, 46.2731377],
        [39.5136597, 46.2654041],
        [39.50835782522472, 46.26044639156052],
        [39.4934066, 46.268185],
        [39.4986075, 46.2731377],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
  {
    id: "field10",
    name: "Поле №10",
    area: 44.6,
    cadastralNumber: "23:01:0101001:10",
    coordinates: {
      type: "Polygon",
      coordinates: [[
        [39.4773736, 46.2678055],
        [39.4872615, 46.2628526],
        [39.4925231, 46.2681503],
        [39.4882748, 46.2701992],
        [39.4860777, 46.2690453],
        [39.484771, 46.2685079],
        [39.4837788, 46.2688477],
        [39.4815421, 46.268569],
        [39.4773736, 46.2678055],
      ]],
    },
    currentCrop: { id: "crp1", name: "Пшеница озимая" },
  },
];

const DEMO_CROPS: Crop[] = [
  { id: "crp1", name: "Пшеница озимая", code: "WHEAT", vegetationPeriod: 270, plannedYield: 48 },
  { id: "crp2", name: "Подсолнечник", code: "SUNFL", vegetationPeriod: 120, plannedYield: 28 },
];

const DEMO_EQUIPMENT: Equipment[] = [
  { id: "eq2", name: "Ростсельмаш Torum", type: "Комбайн", model: "Torum 785", regNumber: "КЛ 5678 23" },
  { id: "eq3", name: "Amazone UX", type: "Опрыскиватель", model: "UX 11200", regNumber: "МН 9012 23" },
  { id: "eq6", name: "Horsch Pronto", type: "Сеялка", model: "Pronto 9 DC", regNumber: null },
  { id: "eq7", name: "Amazone ZA-TS", type: "Разбрасыватель", model: "ZA-TS 4200", regNumber: null },
];

const DEMO_OPERATIONS: DemoOperation[] = [
  { id: "op1", fieldId: "field1", date: "2026-05-20", timeStart: "07:30", timeEnd: "11:20", type: "ВнесениеУдобрений", status: "Факт", calendarStatus: "Выполнено", cropId: "crp1", equipmentId: "eq7" },
  { id: "op2", fieldId: "field2", date: "2026-05-20", timeStart: "12:10", timeEnd: "16:40", type: "Посев", status: "Факт", calendarStatus: "Выполнено", cropId: "crp2", equipmentId: "eq6" },
  { id: "op3", fieldId: "field3", date: "2026-05-21", timeStart: "08:00", timeEnd: "12:10", type: "ВнесениеУдобрений", status: "Факт", calendarStatus: "Выполнено", cropId: "crp1", equipmentId: "eq7" },
  { id: "op4", fieldId: "field4", date: "2026-05-21", timeStart: "13:00", timeEnd: "17:20", type: "Обработка", status: "Факт", calendarStatus: "Выполнено", cropId: "crp1", equipmentId: "eq3" },
  { id: "op5", fieldId: "field5", date: "2026-05-22", timeStart: "07:20", timeEnd: "12:00", type: "Посев", status: "Факт", calendarStatus: "Выполнено", cropId: "crp2", equipmentId: "eq6" },
  { id: "op6", fieldId: "field6", date: "2026-05-22", timeStart: "12:40", timeEnd: "16:30", type: "Посев", status: "Факт", calendarStatus: "Выполнено", cropId: "crp2", equipmentId: "eq6" },
  { id: "op37", fieldId: "field4", date: "2026-06-09", timeStart: "07:20", timeEnd: "09:50", type: "ВнесениеУдобрений", status: "Факт", calendarStatus: "Выполнено", cropId: "crp1", equipmentId: "eq7" },
  { id: "op38", fieldId: "field1", date: "2026-06-18", timeStart: "08:00", timeEnd: "12:00", type: "Обработка", status: "Факт", calendarStatus: "В процессе", cropId: "crp1", equipmentId: "eq3" },
  { id: "op39", fieldId: "field2", date: "2026-06-19", timeStart: "10:20", timeEnd: "13:30", type: "Обработка", status: "Факт", calendarStatus: "В процессе", cropId: "crp2", equipmentId: "eq3" },
  { id: "op40", fieldId: "field5", date: "2026-06-20", timeStart: "09:00", timeEnd: "12:30", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq3" },
  { id: "op41", fieldId: "field1", date: "2026-06-21", timeStart: "07:30", timeEnd: "11:00", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq3" },
  { id: "op42", fieldId: "field2", date: "2026-06-22", timeStart: "08:20", timeEnd: "11:40", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq3" },
  { id: "op43", fieldId: "field3", date: "2026-06-23", timeStart: "06:50", timeEnd: "10:30", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq3" },
  { id: "op44", fieldId: "field4", date: "2026-06-24", timeStart: "07:40", timeEnd: "10:20", type: "ВнесениеУдобрений", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq7" },
  { id: "op45", fieldId: "field5", date: "2026-06-25", timeStart: "09:00", timeEnd: "12:30", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq3" },
  { id: "op46", fieldId: "field6", date: "2026-06-26", timeStart: "08:10", timeEnd: "11:20", type: "ВнесениеУдобрений", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq7" },
  { id: "op47", fieldId: "field3", date: "2026-07-03", timeStart: "06:40", timeEnd: "11:30", type: "Уборка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq2" },
  { id: "op48", fieldId: "field6", date: "2026-07-08", timeStart: "07:10", timeEnd: "10:40", type: "Уборка", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq2" },
  { id: "op49", fieldId: "field7", date: "2026-07-10", timeStart: "07:20", timeEnd: "11:10", type: "Уборка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq2" },
  { id: "op50", fieldId: "field8", date: "2026-07-12", timeStart: "08:30", timeEnd: "12:00", type: "Обработка", status: "План", calendarStatus: "Запланировано", cropId: "crp2", equipmentId: "eq3" },
  { id: "op51", fieldId: "field9", date: "2026-07-14", timeStart: "06:40", timeEnd: "11:30", type: "Уборка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq2" },
  { id: "op52", fieldId: "field10", date: "2026-07-16", timeStart: "07:10", timeEnd: "10:40", type: "Уборка", status: "План", calendarStatus: "Запланировано", cropId: "crp1", equipmentId: "eq2" },
];

const DEMO_HARVESTS: Harvest[] = [
  { id: "h1", fieldId: "field1", date: "2025-07-31", cropId: "crp1", grossHarvest: 583.2, yield: 48.4, grainQuality: "2 класс" },
  { id: "h2", fieldId: "field1", date: "2024-07-29", cropId: "crp1", grossHarvest: 529, yield: 43.9, grainQuality: "3 класс" },
  { id: "h3", fieldId: "field2", date: "2025-09-16", cropId: "crp2", grossHarvest: 261.8, yield: 30.8, grainQuality: null },
  { id: "h4", fieldId: "field2", date: "2024-09-12", cropId: "crp2", grossHarvest: 248.2, yield: 29.2, grainQuality: null },
  { id: "h5", fieldId: "field3", date: "2025-07-31", cropId: "crp1", grossHarvest: 453.1, yield: 47.7, grainQuality: "2 класс" },
  { id: "h6", fieldId: "field3", date: "2024-07-29", cropId: "crp1", grossHarvest: 410.4, yield: 43.2, grainQuality: "3 класс" },
  { id: "h7", fieldId: "field4", date: "2025-07-31", cropId: "crp1", grossHarvest: 492.2, yield: 48.4, grainQuality: "2 класс" },
  { id: "h8", fieldId: "field4", date: "2024-07-29", cropId: "crp1", grossHarvest: 446.5, yield: 43.9, grainQuality: "3 класс" },
  { id: "h9", fieldId: "field5", date: "2025-09-16", cropId: "crp2", grossHarvest: 319.7, yield: 30.8, grainQuality: null },
  { id: "h10", fieldId: "field5", date: "2024-09-12", cropId: "crp2", grossHarvest: 303.1, yield: 29.2, grainQuality: null },
  { id: "h11", fieldId: "field6", date: "2025-09-16", cropId: "crp2", grossHarvest: 289.9, yield: 29.4, grainQuality: null },
  { id: "h12", fieldId: "field6", date: "2024-09-12", cropId: "crp2", grossHarvest: 274.1, yield: 27.8, grainQuality: null },
  { id: "h13", fieldId: "field7", date: "2025-07-31", cropId: "crp1", grossHarvest: 473.8, yield: 48.4, grainQuality: "2 класс" },
  { id: "h14", fieldId: "field7", date: "2024-07-29", cropId: "crp1", grossHarvest: 429.8, yield: 43.9, grainQuality: "3 класс" },
  { id: "h15", fieldId: "field8", date: "2025-09-16", cropId: "crp2", grossHarvest: 235, yield: 30.8, grainQuality: null },
  { id: "h16", fieldId: "field8", date: "2024-09-12", cropId: "crp2", grossHarvest: 222.8, yield: 29.2, grainQuality: null },
  { id: "h17", fieldId: "field9", date: "2025-07-31", cropId: "crp1", grossHarvest: 468.9, yield: 47.7, grainQuality: "2 класс" },
  { id: "h18", fieldId: "field9", date: "2024-07-29", cropId: "crp1", grossHarvest: 424.7, yield: 43.2, grainQuality: "3 класс" },
  { id: "h19", fieldId: "field10", date: "2025-07-31", cropId: "crp1", grossHarvest: 215.9, yield: 48.4, grainQuality: "2 класс" },
  { id: "h20", fieldId: "field10", date: "2024-07-29", cropId: "crp1", grossHarvest: 195.8, yield: 43.9, grainQuality: "3 класс" },
];

const STORAGE_PREFIX = "agro_demo_v1";
const TYPE_LABELS: Record<string, string> = {
  Посев: "Посев",
  Обработка: "Обработка",
  Уборка: "Уборка",
  ВнесениеУдобрений: "Внесение удобрений",
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    return raw ? (JSON.parse(raw) as T) : clone(fallback);
  } catch {
    return clone(fallback);
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    // Local storage is a demo convenience; the app can still work in memory.
  }
}

function getFields(): Field[] {
  return readStorage("fields", DEMO_FIELDS);
}

function saveFields(fields: Field[]) {
  writeStorage("fields", fields);
}

function getOperations(): DemoOperation[] {
  return readStorage("operations", DEMO_OPERATIONS);
}

function saveOperations(operations: DemoOperation[]) {
  writeStorage("operations", operations);
}

function getCrop(cropId?: string | null) {
  return DEMO_CROPS.find((crop) => crop.id === cropId) || null;
}

function getEquipment(equipmentId?: string | null) {
  return DEMO_EQUIPMENT.find((item) => item.id === equipmentId) || null;
}

function enrichOperation(operation: DemoOperation): CalendarOperation {
  const field = getFields().find((item) => item.id === operation.fieldId) || null;
  return {
    ...operation,
    field: field ? { id: field.id, name: field.name, area: field.area } : null,
    crop: getCrop(operation.cropId),
    equipment: getEquipment(operation.equipmentId),
  } as CalendarOperation;
}

function getFieldDetail(id: string): FieldDetail {
  const field = getFields().find((entry) => entry.id === id);
  if (!field) {
    throw new Error("Поле не найдено");
  }

  return {
    ...field,
    operations: getOperations().filter((operation) => operation.fieldId === field.id),
    harvests: DEMO_HARVESTS.filter((harvest) => harvest.fieldId === field.id),
  };
}

function nextOperationId(operations: DemoOperation[]) {
  const max = operations.reduce((acc, operation) => {
    const id = Number(operation.id.replace("op", ""));
    return Number.isFinite(id) ? Math.max(acc, id) : acc;
  }, 0);
  return `op${max + 1}`;
}

function getDashboard(): DashboardData {
  const fields = getFields();
  const operations = getOperations();
  const totalArea = fields.reduce((sum, field) => sum + field.area, 0);
  const cropArea = fields.reduce<Record<string, number>>((acc, field) => {
    acc[field.currentCrop.name] = (acc[field.currentCrop.name] || 0) + field.area;
    return acc;
  }, {});

  const yieldHistory = DEMO_HARVESTS.reduce<Record<string, number>>((acc, harvest) => {
    const year = harvest.date.slice(0, 4);
    acc[year] = +((acc[year] || 0) + harvest.grossHarvest).toFixed(1);
    return acc;
  }, {});
  const yieldByYear = Object.entries(yieldHistory)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, totalGross]) => ({ year: Number(year), totalGross }));
  const lastYear = yieldByYear.at(-1);
  const prevYear = yieldByYear.at(-2);
  const completedOps = operations.filter((operation) => operation.status === "Факт").length;

  return {
    totalArea: +totalArea.toFixed(1),
    areaTrend: 5,
    activeFields: fields.length,
    harvestForecast: lastYear?.totalGross ?? 0,
    harvestTrend: lastYear && prevYear
      ? +(((lastYear.totalGross - prevYear.totalGross) / prevYear.totalGross) * 100).toFixed(1)
      : null,
    completedOpsPercent: +((completedOps / operations.length) * 100).toFixed(1),
    completedOps,
    totalOps: operations.length,
    cropsDistribution: Object.entries(cropArea).map(([crop, area]) => ({
      crop,
      area: +area.toFixed(1),
      percentage: +((area / totalArea) * 100).toFixed(1),
    })),
    recentOperations: operations
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
      .map((operation) => ({
        id: operation.id,
        fieldId: operation.fieldId,
        fieldName: fields.find((field) => field.id === operation.fieldId)?.name || null,
        date: operation.date,
        type: operation.type,
        status: operation.status,
      })),
    yieldByYear,
  };
}

function isInPeriod(item: { date: string }, dateFrom?: string, dateTo?: string) {
  if (dateFrom && item.date < dateFrom) return false;
  if (dateTo && item.date > dateTo) return false;
  return true;
}

function countBy<T>(items: T[], keyGetter: (item: T) => string | undefined) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = keyGetter(item);
    if (key) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function getReports(filters: ReportFilters = { scope: "farm" }): ReportsData {
  const scope: ReportScope = filters.scope === "field" ? "field" : "farm";
  const fields = getFields();
  const selectedField = scope === "field"
    ? fields.find((field) => field.id === filters.fieldId) || null
    : null;

  if (scope === "field" && !selectedField) {
    throw new Error("Поле для отчета не найдено");
  }

  const reportFields = selectedField ? [selectedField] : fields;
  const fieldIds = new Set(reportFields.map((field) => field.id));
  const reportOperations = getOperations().filter(
    (operation) =>
      fieldIds.has(operation.fieldId) &&
      isInPeriod(operation, filters.dateFrom, filters.dateTo),
  );
  const reportHarvests = DEMO_HARVESTS.filter(
    (harvest) =>
      fieldIds.has(harvest.fieldId) &&
      isInPeriod(harvest, filters.dateFrom, filters.dateTo),
  );
  const byType = countBy(reportOperations, (operation) => operation.type);
  const byStatus = countBy(reportOperations, (operation) => operation.calendarStatus);
  const byMonth = countBy(reportOperations, (operation) => operation.date.slice(0, 7));
  const yieldByYear = reportHarvests.reduce<Record<string, number>>((acc, harvest) => {
    const year = harvest.date.slice(0, 4);
    acc[year] = +((acc[year] || 0) + harvest.grossHarvest).toFixed(1);
    return acc;
  }, {});
  const total = reportOperations.length;
  const completed = byStatus["Выполнено"] || 0;
  const topType = Object.entries(byType).sort(([, a], [, b]) => b - a)[0];
  const insights = total === 0
    ? ["За выбранный период операции не найдены."]
    : [`За выбранный период выполнено ${Math.round((completed / total) * 100)}% операций (${completed} из ${total}).`];

  if (topType) {
    insights.push(`Наибольшая нагрузка пришлась на операции типа "${TYPE_LABELS[topType[0]] || topType[0]}" — ${topType[1]} шт.`);
  }

  return {
    scope,
    filters: {
      fieldId: filters.fieldId || "",
      dateFrom: filters.dateFrom || "",
      dateTo: filters.dateTo || "",
    },
    selectedField: selectedField
      ? {
          id: selectedField.id,
          name: selectedField.name,
          area: selectedField.area,
          crop: selectedField.currentCrop.name,
        }
      : null,
    byType,
    byStatus,
    byMonth,
    yieldByYear,
    byField: reportFields.map((field) => {
      const fieldOps = reportOperations.filter((operation) => operation.fieldId === field.id);
      return {
        id: field.id,
        name: field.name,
        area: field.area,
        crop: field.currentCrop.name,
        total: fieldOps.length,
        completed: fieldOps.filter((operation) => operation.calendarStatus === "Выполнено").length,
      };
    }),
    insights,
    totals: {
      operations: reportOperations.length,
      fields: reportFields.length,
      totalArea: +reportFields.reduce((sum, field) => sum + field.area, 0).toFixed(1),
    },
  };
}

function moscowTodayIso() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

function getRecommendations(): RecommendationsData {
  const todayIso = moscowTodayIso();
  const today = new Date(`${todayIso}T00:00:00`);
  const operations = getOperations();
  const fields = getFields();
  const planned = operations.filter(
    (operation) => operation.status === "План" || operation.calendarStatus === "Запланировано",
  );
  const recommendations: RecommendationItem[] = [];

  planned
    .filter((operation) => new Date(`${operation.date}T00:00:00`) < today)
    .slice(0, 4)
    .forEach((operation) => {
      const lateBy = Math.abs(daysBetween(today, new Date(`${operation.date}T00:00:00`)));
      const field = fields.find((item) => item.id === operation.fieldId);
      recommendations.push({
        id: `overdue-${operation.id}`,
        severity: lateBy > 30 ? "high" : "medium",
        kind: "overdue",
        title: `${TYPE_LABELS[operation.type] || operation.type} — ${field?.name || operation.fieldId}`,
        description: `Плановая операция просрочена на ${lateBy} дн. Перенесите дату или закройте задачу фактом.`,
        fieldId: operation.fieldId,
        fieldName: field?.name || operation.fieldId,
        operationId: operation.id,
        date: operation.date,
        actionLabel: "Открыть поле",
        actionHref: `/fields/${operation.fieldId}`,
      });
    });

  operations
    .filter((operation) => operation.calendarStatus === "В процессе")
    .slice(0, 3)
    .forEach((operation) => {
      const age = Math.max(0, daysBetween(today, new Date(`${operation.date}T00:00:00`)) * -1);
      const field = fields.find((item) => item.id === operation.fieldId);
      recommendations.push({
        id: `stale-${operation.id}`,
        severity: age > 7 ? "high" : "medium",
        kind: "stale",
        title: `${TYPE_LABELS[operation.type] || operation.type} — ${field?.name || operation.fieldId}`,
        description: `Операция находится в работе ${age} дн. Проверьте фактическое выполнение и обновите статус.`,
        fieldId: operation.fieldId,
        fieldName: field?.name || operation.fieldId,
        operationId: operation.id,
        date: operation.date,
        actionLabel: "Открыть поле",
        actionHref: `/fields/${operation.fieldId}`,
      });
    });

  planned
    .filter((operation) => new Date(`${operation.date}T00:00:00`) >= today)
    .slice(0, 3)
    .forEach((operation) => {
      const field = fields.find((item) => item.id === operation.fieldId);
      recommendations.push({
        id: `upcoming-${operation.id}`,
        severity: "info",
        kind: "upcoming",
        title: `${TYPE_LABELS[operation.type] || operation.type} — ${field?.name || operation.fieldId}`,
        description: `Ближайшая плановая работа назначена на ${operation.date}.`,
        fieldId: operation.fieldId,
        fieldName: field?.name || operation.fieldId,
        operationId: operation.id,
        date: operation.date,
        actionLabel: "К календарю",
        actionHref: "/calendar",
      });
    });

  const severityRank: Record<RecommendationSeverity, number> = {
    high: 0,
    medium: 1,
    low: 2,
    info: 3,
  };
  recommendations.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  return {
    generatedAt: todayIso,
    summary: {
      high: recommendations.filter((item) => item.severity === "high").length,
      medium: recommendations.filter((item) => item.severity === "medium").length,
      low: recommendations.filter((item) => item.severity === "low").length,
      info: recommendations.filter((item) => item.severity === "info").length,
      total: recommendations.length,
    },
    items: recommendations.slice(0, 8),
  };
}

function parseBody<T>(options?: RequestInit): T {
  return options?.body ? (JSON.parse(String(options.body)) as T) : ({} as T);
}

export async function demoRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const method = (options?.method || "GET").toUpperCase();
  const url = new URL(path, "https://demo.agroscope.local");
  const segments = url.pathname.split("/").filter(Boolean);

  if (method === "GET" && url.pathname === "/fields") {
    return clone(getFields()) as T;
  }

  if (segments[0] === "fields" && segments[1]) {
    if (method === "GET") {
      return clone(getFieldDetail(segments[1])) as T;
    }

    if (method === "PUT") {
      const fields = getFields();
      const field = fields.find((entry) => entry.id === segments[1]);
      if (!field) throw new Error("Поле не найдено");
      const body = parseBody<Partial<Field>>(options);
      if (body.name !== undefined) field.name = String(body.name).trim();
      if (body.area !== undefined) field.area = Number(body.area);
      if (body.cadastralNumber !== undefined) {
        field.cadastralNumber = String(body.cadastralNumber).trim() || undefined;
      }
      saveFields(fields);
      return clone(field) as T;
    }
  }

  if (method === "GET" && url.pathname === "/operations") {
    let operations = getOperations();
    const fieldId = url.searchParams.get("fieldId");
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    if (fieldId) operations = operations.filter((operation) => operation.fieldId === fieldId);
    if (type) operations = operations.filter((operation) => operation.type === type);
    if (status) operations = operations.filter((operation) => operation.status === status);
    return clone(operations.map(enrichOperation)) as T;
  }

  if (method === "POST" && url.pathname === "/operations") {
    const input = parseBody<CreateOperationInput>(options);
    if (!input.fieldId || !input.type || !input.date) {
      throw new Error("Необходимы fieldId, type, date");
    }
    if (!getFields().some((field) => field.id === input.fieldId)) {
      throw new Error("Поле не найдено");
    }

    const operations = getOperations();
    const field = getFields().find((entry) => entry.id === input.fieldId);
    const operation: DemoOperation = {
      id: nextOperationId(operations),
      fieldId: input.fieldId,
      type: input.type,
      date: input.date,
      timeStart: input.timeStart || undefined,
      timeEnd: input.timeEnd || undefined,
      status: "План",
      calendarStatus: "Запланировано",
      cropId: field?.currentCrop.id || undefined,
      equipmentId: undefined,
    };
    operations.push(operation);
    saveOperations(operations);
    return clone(enrichOperation(operation)) as T;
  }

  if (segments[0] === "operations" && segments[1] && method === "PATCH") {
    const operations = getOperations();
    const operation = operations.find((entry) => entry.id === segments[1]);
    if (!operation) throw new Error("Операция не найдена");

    if (segments[2] === "reschedule") {
      const body = parseBody<{ date?: string; timeStart?: string; timeEnd?: string }>(options);
      if (!body.date) throw new Error("Необходима дата");
      operation.date = body.date;
      operation.timeStart = body.timeStart || undefined;
      operation.timeEnd = body.timeEnd || undefined;
    }

    if (segments[2] === "status") {
      const body = parseBody<{ calendarStatus?: CalendarStatus }>(options);
      if (!body.calendarStatus) throw new Error("Необходим статус");
      operation.calendarStatus = body.calendarStatus;
      operation.status = body.calendarStatus === "Выполнено" ? "Факт" : "План";
    }

    saveOperations(operations);
    return clone(enrichOperation(operation)) as T;
  }

  if (method === "GET" && url.pathname === "/dashboard") {
    return clone(getDashboard()) as T;
  }

  if (method === "GET" && url.pathname === "/reports") {
    return clone(getReports({
      scope: (url.searchParams.get("scope") as ReportScope) || "farm",
      fieldId: url.searchParams.get("fieldId") || undefined,
      dateFrom: url.searchParams.get("dateFrom") || undefined,
      dateTo: url.searchParams.get("dateTo") || undefined,
    })) as T;
  }

  if (method === "GET" && url.pathname === "/recommendations") {
    return clone(getRecommendations()) as T;
  }

  throw new Error(`Demo API не поддерживает ${method} ${url.pathname}`);
}

export const demoData = {
  getFields,
  getOperations,
  getCrops: () => clone(DEMO_CROPS),
  getEquipment: () => clone(DEMO_EQUIPMENT),
  getHarvests: () => clone(DEMO_HARVESTS),
  getFieldDetail,
  enrichOperation,
};
