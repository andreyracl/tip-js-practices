export const STORAGE_VERSION = 1;

const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

function isValidTask(task) {
  if (!task || typeof task !== "object") return false;
  if (!Number.isSafeInteger(task.id) || task.id <= 0) return false;
  if (typeof task.title !== "string") return false;
  if (task.title !== task.title.trim()) return false;
  if (task.title.length < 1 || task.title.length > 100) return false;
  if (typeof task.completed !== "boolean") return false;
  if (!ALLOWED_PRIORITIES.has(task.priority)) return false;
  return true;
}

function copyTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const seen = new Set();
  for (const task of value) {
    if (!isValidTask(task)) return false;
    if (seen.has(task.id)) return false;
    seen.add(task.id);
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
    if (!parsed || typeof parsed !== "object" || parsed.version !== STORAGE_VERSION) {
      return {
        ok: false, source: "fallback", tasks: fallbackCopy,
        error: "Неизвестная версия или формат сохранённых данных",
      };
    }
    if (!isValidTaskList(parsed.tasks)) {
      return {
        ok: false, source: "fallback", tasks: fallbackCopy,
        error: "Сохранённые задачи повреждены",
      };
    }
    return { ok: true, source: "storage", tasks: copyTasks(parsed.tasks) };
  } catch (error) {
    return {
      ok: false, source: "fallback", tasks: fallbackCopy,
      error: `Ошибка чтения: ${error.message}`,
    };
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
    return { ok: false, error: `Не удалось удалить: ${error.message}` };
  }
}