const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

function parseId(rawId) {
  if (typeof rawId === "string" && rawId.trim() === "") return null;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

function parseTitle(rawTitle) {
  if (typeof rawTitle !== "string") return null;
  const title = rawTitle.trim();
  if (title.length < 1 || title.length > 100) return null;
  return title;
}

export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  const isEditing = editingId !== null;

  let id;
  if (isEditing) {
    if (!Number.isSafeInteger(editingId) || editingId <= 0) {
      errors.id = "Некорректный идентификатор редактируемой задачи";
    } else if (!tasks.some((t) => t.id === editingId)) {
      errors.id = "Редактируемая задача не найдена";
    } else {
      id = editingId;
    }
  } else {
    id = parseId(draft.id);
    if (id === null) {
      errors.id = "Введите положительное целое число";
    } else if (tasks.some((t) => t.id === id)) {
      errors.id = "Задача с таким идентификатором уже существует";
    }
  }

  const title = parseTitle(draft.title);
  if (title === null) {
    errors.title = "Название должно быть строкой от 1 до 100 символов";
  }

  if (typeof draft.priority !== "string" || !ALLOWED_PRIORITIES.has(draft.priority)) {
    errors.priority = "Приоритет должен быть low, medium или high";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { id, title, priority: draft.priority } };
}