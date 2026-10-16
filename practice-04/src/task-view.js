import { getTaskStats } from "./task-service.js";

// Здесь создаётся DOM, но не изменяется состояние приложения.

const PRIORITY_LABELS = { low: "Низкий", medium: "Средний", high: "Высокий" };

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text; // всегда текст, а не HTML
  return element;
}

function createActionButton(action, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.action = action;
  button.append(createTextElement("span", "action-label", label));
  return button;
}

export function createTaskElement(task) {
  const card = document.createElement("li");
  card.className = "task-card";
  card.classList.toggle("is-completed", task.completed);
  card.dataset.taskId = String(task.id);

  const toggle = createActionButton("toggle", "Выполнена"); // подпись постоянная
  toggle.setAttribute("aria-pressed", String(task.completed));

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.append(
    toggle,
    createActionButton("edit", "Изменить"),
    createActionButton("delete", "Удалить"),
  );

  card.append(
    createTextElement("h3", "task-title", task.title),
    createTextElement("span", "task-status", task.completed ? "Выполнена" : "В работе"),
    createTextElement("span", "task-priority", PRIORITY_LABELS[task.priority] ?? task.priority),
    actions,
  );
  return card;
}

export function renderTaskList(listElement, tasks) {
  // Сам listElement сохраняется — обработчик на нём остаётся живым.
  listElement.replaceChildren(...tasks.map(createTaskElement));
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  const values = {
    total,
    completed,
    pending,
    progress: `${progress.toFixed(1)}%`,
    visible: visibleCount,
  };

  for (const [stat, value] of Object.entries(values)) {
    summaryElement.querySelector(`[data-stat="${stat}"]`).textContent = String(value);
  }
}

export function renderEmptyState(messageElement, total, visibleCount) {
  const isEmpty = visibleCount === 0;
  messageElement.hidden = !isEmpty;

  if (!isEmpty) {
    messageElement.textContent = "";
  } else if (total === 0) {
    messageElement.textContent = "Список задач пуст.";
  } else {
    messageElement.textContent = "Нет задач по выбранному фильтру.";
  }
}
