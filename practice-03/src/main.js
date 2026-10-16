import { demoTasks, variantTasks, variantNumber } from "./data.js";
import { findTaskById, setTaskCompleted, removeTask } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

const elements = {
  list: document.querySelector("#task-list"),
  filters: document.querySelector("#task-filters"),
  summary: document.querySelector("#task-summary"),
  empty: document.querySelector("#empty-message"),
  message: document.querySelector("#operation-message"),
  datasetLabel: document.querySelector("#dataset-label"),
};

const isVariant = new URLSearchParams(window.location.search).get("dataset") === "variant";
const initialTasks = isVariant ? variantTasks : demoTasks;
let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";

const FILTERS = new Set(["all", "pending", "completed"]);
const TASK_ACTIONS = new Set(["toggle", "delete"]);

function showMessage(text = "") {
  elements.message.textContent = text;
}

// Идентификатор из DOM — строка; преобразуется и проверяется на границе обработчика.
function readTaskId(card) {
  const id = Number(card.dataset.taskId);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

elements.datasetLabel.textContent = isVariant
  ? `Индивидуальный вариант: ${variantNumber ?? "не указан"}`
  : "Общий контрольный набор";

function renderApp() {
  const visible = getVisibleTasks(currentTasks, currentFilter);
  renderTaskList(elements.list, visible);
  renderSummary(elements.summary, currentTasks, visible.length);
  renderEmptyState(elements.empty, currentTasks.length, visible.length);

  for (const button of elements.filters.querySelectorAll("button[data-filter]")) {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function handleTaskListClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-action]");
  if (!button || !elements.list.contains(button)) return;

  const action = button.dataset.action;
  if (!TASK_ACTIONS.has(action)) return;

  const card = button.closest("li[data-task-id]");
  if (!card) return;

  const id = readTaskId(card);
  if (id === null) {
    showMessage("Некорректный идентификатор задачи");
    return;
  }

  let result;
  if (action === "toggle") {
    const task = findTaskById(currentTasks, id);
    // Отсутствующую задачу сервис тоже отклонит, но так сообщение точнее.
    result = task
      ? setTaskCompleted(currentTasks, id, !task.completed)
      : { ok: false, error: `Задача с id ${id} не найдена` };
  } else {
    result = removeTask(currentTasks, id);
  }

  if (!result.ok) {
    showMessage(result.error);
    return;
  }

  currentTasks = result.tasks;
  showMessage();
  renderApp();
  restoreTaskFocus(id, action);
}

function handleFilterClick(event) {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-filter]");
  if (!button || !elements.filters.contains(button)) return;

  const filter = button.dataset.filter;
  if (!FILTERS.has(filter)) return;

  currentFilter = filter;
  showMessage();
  renderApp();
}

function restoreTaskFocus(id, action) {
  const actionButton = elements.list.querySelector(
    `[data-task-id="${id}"] button[data-action="${action}"]`,
  );
  const filterButton = elements.filters.querySelector(`[data-filter="${currentFilter}"]`);
  (actionButton ?? filterButton)?.focus();
}

elements.list.addEventListener("click", handleTaskListClick);
elements.filters.addEventListener("click", handleFilterClick);

try {
  renderApp();
} catch (error) {
  showMessage(`Ошибка запуска: ${error.message}`);
  console.error(error);
}
