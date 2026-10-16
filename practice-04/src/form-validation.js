// Чистая проверка черновика формы: без DOM, без сообщений на странице
// и без изменения входных значений. Правила модели берутся из task-service.js.
import { MAX_TITLE_LENGTH, isValidId, isValidPriority, normalizeTitle } from "./task-service.js";

// Значение поля формы обычно строка (FormData), но допускается и число.
// Пустая строка не должна превратиться в 0, null/undefined — тоже отказ.
function parseFormId(rawId) {
  if (typeof rawId === "string" && rawId.trim() === "") return null;
  if (typeof rawId !== "string" && typeof rawId !== "number") return null;
  const id = Number(rawId);
  return isValidId(id) ? id : null;
}

function validateId(draft, tasks, editingId) {
  const exists = (id) => tasks.some((task) => task.id === id);

  if (editingId !== null) {
    // В режиме редактирования поле id заблокировано; источник — editingId.
    if (!isValidId(editingId)) return { error: "Некорректный идентификатор редактируемой задачи" };
    if (!exists(editingId)) return { error: "Редактируемая задача не найдена" };
    return { value: editingId };
  }

  const id = parseFormId(draft.id);
  if (id === null) return { error: "Введите положительное целое число" };
  if (exists(id)) return { error: "Задача с таким идентификатором уже существует" };
  return { value: id };
}

export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};

  const idCheck = validateId(draft, tasks, editingId);
  if (idCheck.error) errors.id = idCheck.error;

  const titleCheck = normalizeTitle(draft.title);
  if (!titleCheck.ok) {
    errors.title = `Название должно быть строкой от 1 до ${MAX_TITLE_LENGTH} символов`;
  }

  if (!isValidPriority(draft.priority)) {
    errors.priority = "Приоритет должен быть low, medium или high";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { id: idCheck.value, title: titleCheck.title, priority: draft.priority },
  };
}
