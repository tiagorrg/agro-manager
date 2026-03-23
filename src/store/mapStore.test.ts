import { useMapStore } from "./mapStore";
import { fetchFieldDetail } from "../shared/api/fields";
import type { Field } from "../entities/field/types";

jest.mock("../shared/api/fields", () => ({
  fetchFieldDetail: jest.fn(),
}));

const mockFetch = fetchFieldDetail as jest.MockedFunction<typeof fetchFieldDetail>;

const mockField: Field = {
  id: "field-1",
  name: "Поле 1",
  area: 50,
  currentCrop: { id: "crop-1", name: "Пшеница озимая" },
  coordinates: { type: "Polygon", coordinates: [[[39.0, 46.0], [39.1, 46.1]]] },
};

const mockDetail = { ...mockField, operations: [], harvests: [] };

beforeEach(() => {
  useMapStore.setState({ selectedFieldId: null, selectedDetail: null });
  mockFetch.mockReset();
});

describe("mapStore.clearSelection", () => {
  it("сбрасывает выбранное поле", () => {
    useMapStore.setState({ selectedFieldId: "field-1", selectedDetail: mockDetail });
    useMapStore.getState().clearSelection();
    const state = useMapStore.getState();
    expect(state.selectedFieldId).toBeNull();
    expect(state.selectedDetail).toBeNull();
  });
});

describe("mapStore.selectField", () => {
  it("сразу устанавливает selectedFieldId и сбрасывает detail", () => {
    mockFetch.mockReturnValue(new Promise(() => {})); // зависаем
    useMapStore.getState().selectField(mockField);
    const state = useMapStore.getState();
    expect(state.selectedFieldId).toBe("field-1");
    expect(state.selectedDetail).toBeNull();
  });

  it("устанавливает selectedDetail после успешного fetch", async () => {
    mockFetch.mockResolvedValue(mockDetail);
    useMapStore.getState().selectField(mockField);
    await Promise.resolve(); // flush microtasks
    expect(useMapStore.getState().selectedDetail).toEqual(mockDetail);
  });

  it("игнорирует устаревший ответ при быстром переключении полей", async () => {
    const field2: Field = { ...mockField, id: "field-2", name: "Поле 2" };
    const detail2 = { ...mockDetail, id: "field-2" };

    let resolveFirst!: (v: typeof mockDetail) => void;
    mockFetch
      .mockReturnValueOnce(new Promise((r) => { resolveFirst = r; })) // первый запрос завис
      .mockResolvedValueOnce(detail2); // второй сразу отвечает

    useMapStore.getState().selectField(mockField); // запрос 1
    useMapStore.getState().selectField(field2);    // запрос 2 — становится активным

    await Promise.resolve();
    resolveFirst(mockDetail); // поздний ответ первого запроса
    await Promise.resolve();

    // Должен применится только ответ второго запроса
    expect(useMapStore.getState().selectedDetail?.id).toBe("field-2");
  });
});
