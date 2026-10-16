// Прикладные функции модели задачи.
// Модуль не обращается к консоли, DOM и внешнему состоянию:
// каждая функция работает только с переданными аргументами.

const PRIORITIES = ["low", "medium", "high"];
const MAX_TITLE_LENGTH = 100;

const ERRORS = {
  invalidId: "id должен быть положительным безопасным целым",
  duplicateId: "Задача с таким id уже существует",
  notFound: "Задача с указанным id не найдена",
  titleType: "Название должно быть строкой",
  titleLength: `Название должно содержать от 1 до ${MAX_TITLE_LENGTH} символов`,
  priority: "Приоритет должен быть low, medium или high",
  completedType: "completed должен быть логическим значением",
};

const fail = (error) => ({ ok: false, error });

function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function hasTask(tasks, id) {
  return tasks.some((task) => task.id === id);
}

// Возвращает { ok: true, title } с очищенной строкой либо { ok: false, error }.
function normalizeTitle(title) {
  if (typeof title !== "string") return fail(ERRORS.titleType);
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > MAX_TITLE_LENGTH) {
    return fail(ERRORS.titleLength);
  }
  return { ok: true, title: trimmed };
}

// Общая проверка для операций над существующей задачей.
function checkExisting(tasks, id) {
  if (!isValidId(id)) return fail(ERRORS.invalidId);
  if (!hasTask(tasks, id)) return fail(ERRORS.notFound);
  return { ok: true };
}

// Новый массив, в котором выбранная задача заменена новым объектом с изменениями.
function patchTask(tasks, id, changes) {
  return tasks.map((task) => (task.id === id ? { ...task, ...changes } : task));
}

export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) return fail(ERRORS.invalidId);

  const titleCheck = normalizeTitle(title);
  if (!titleCheck.ok) return titleCheck;

  if (!PRIORITIES.includes(priority)) return fail(ERRORS.priority);

  return {
    ok: true,
    task: { id, title: titleCheck.title, completed: false, priority },
  };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function getPendingTasks(tasks) {
  return tasks.filter((task) => task.completed === false);
}

export function getTaskTitles(tasks) {
  return tasks.map((task) => task.title);
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed === true).length;
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  // createTask проверяет все поля, включая id; здесь остаётся только уникальность.
  const created = createTask(id, title, priority);
  if (!created.ok) return created;
  if (hasTask(tasks, id)) return fail(ERRORS.duplicateId);
  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (typeof completed !== "boolean") return fail(ERRORS.completedType);

  const existing = checkExisting(tasks, id);
  if (!existing.ok) return existing;

  return { ok: true, tasks: patchTask(tasks, id, { completed }) };
}

export function renameTask(tasks, id, title) {
  const existing = checkExisting(tasks, id);
  if (!existing.ok) return existing;

  const titleCheck = normalizeTitle(title);
  if (!titleCheck.ok) return titleCheck;

  return { ok: true, tasks: patchTask(tasks, id, { title: titleCheck.title }) };
}

export function removeTask(tasks, id) {
  const existing = checkExisting(tasks, id);
  if (!existing.ok) return existing;

  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}
