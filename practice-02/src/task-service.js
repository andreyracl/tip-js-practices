function isValidId(id) {
  return Number.isSafeInteger(id) && id > 0;
}

function validateTitle(title) {
  if (typeof title !== "string") {
    return { ok: false, error: "Название должно быть строкой" };
  }
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { ok: false, error: "Название должно содержать от 1 до 100 символов" };
  }
  return { ok: true, title: trimmed };
}

const PRIORITIES = ["low", "medium", "high"];

export function createTask(id, title, priority = "medium") {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным безопасным целым" };
  }
  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;
  if (!PRIORITIES.includes(priority)) {
    return { ok: false, error: "Приоритет должен быть low, medium или high" };
  }
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
  let completed = 0;
  for (const task of tasks) {
    if (task.completed === true) completed += 1;
  }
  const pending = total - completed;
  const progress = total > 0 ? (completed / total) * 100 : 0;
  return { total, completed, pending, progress };
}

export function addTask(tasks, id, title, priority = "medium") {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным безопасным целым" };
  }
  if (tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с таким id уже существует" };
  }
  const created = createTask(id, title, priority);
  if (!created.ok) return created;
  return { ok: true, tasks: [...tasks, created.task] };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным безопасным целым" };
  }
  if (typeof completed !== "boolean") {
    return { ok: false, error: "completed должен быть логическим значением" };
  }
  if (!tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с указанным id не найдена" };
  }
  const next = tasks.map((task) =>
    task.id === id ? { ...task, completed } : task
  );
  return { ok: true, tasks: next };
}

export function renameTask(tasks, id, title) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным безопасным целым" };
  }
  const titleCheck = validateTitle(title);
  if (!titleCheck.ok) return titleCheck;
  if (!tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с указанным id не найдена" };
  }
  const next = tasks.map((task) =>
    task.id === id ? { ...task, title: titleCheck.title } : task
  );
  return { ok: true, tasks: next };
}

export function removeTask(tasks, id) {
  if (!isValidId(id)) {
    return { ok: false, error: "id должен быть положительным безопасным целым" };
  }
  if (!tasks.some((task) => task.id === id)) {
    return { ok: false, error: "Задача с указанным id не найдена" };
  }
  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}