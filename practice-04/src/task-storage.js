// Граница localStorage: схема сохранённых данных, JSON и перехват исключений.
// storage передаётся аргументом — модуль не обращается к глобальному localStorage.
import { isValidId, isValidPriority, normalizeTitle } from "./task-service.js";

export const STORAGE_VERSION = 1;

// Сохранённая запись должна точно соответствовать модели:
// при чтении ничего не нормализуется, неверные данные отклоняются целиком.
function isValidTask(task) {
  if (task === null || typeof task !== "object") return false;
  const titleCheck = normalizeTitle(task.title);
  return (
    isValidId(task.id) &&
    titleCheck.ok &&
    titleCheck.title === task.title && // название уже должно быть очищено
    typeof task.completed === "boolean" &&
    isValidPriority(task.priority)
  );
}

function copyTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function fallback(tasks, error) {
  return { ok: false, source: "fallback", tasks, error };
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const seenIds = new Set();
  for (const task of value) {
    if (!isValidTask(task) || seenIds.has(task.id)) return false;
    seenIds.add(task.id);
  }
  return true;
}

export function loadTasks(storage, key, fallbackTasks) {
  const fallbackCopy = copyTasks(fallbackTasks);
  try {
    const raw = storage.getItem(key);
    if (raw === null) {
      return { ok: true, source: "initial", tasks: fallbackCopy };
    }

    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || parsed.version !== STORAGE_VERSION) {
      return fallback(fallbackCopy, "Неизвестная версия или формат сохранённых данных. Используется исходный набор.");
    }
    if (!isValidTaskList(parsed.tasks)) {
      return fallback(fallbackCopy, "Сохранённые задачи повреждены. Используется исходный набор.");
    }
    return { ok: true, source: "storage", tasks: copyTasks(parsed.tasks) };
  } catch (error) {
    return fallback(fallbackCopy, `Не удалось прочитать сохранённые данные (${error.message}). Используется исходный набор.`);
  }
}

export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) {
    return { ok: false, error: "Некорректный список задач: запись отменена" };
  }
  try {
    storage.setItem(key, JSON.stringify({ version: STORAGE_VERSION, tasks }));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: `Не удалось сохранить: ${error.message}` };
  }
}

export function removeSavedTasks(storage, key) {
  try {
    storage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: `Не удалось удалить сохранённые данные: ${error.message}` };
  }
}
