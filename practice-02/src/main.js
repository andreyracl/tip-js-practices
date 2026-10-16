import { isDeepStrictEqual } from "node:util";
import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

// ---------- Вспомогательные функции вывода ----------

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(`${label}: всего ${total}; выполнено ${completed}; осталось ${pending}`);
  if (total === 0) {
    console.log("Задач пока нет");
  } else {
    console.log(`Прогресс: ${progress.toFixed(1)}%`);
  }
}

function printTasks(label, tasks) {
  console.log(`\n--- ${label} ---`);
  console.table(tasks);
}

// Применяет результат операции: при успехе возвращает новый массив,
// при отказе выводит ошибку и возвращает прежнее состояние без изменений.
function applyResult(label, currentTasks, result) {
  const nextTasks = result.ok ? result.tasks : currentTasks;
  if (!result.ok) console.error(`Ошибка: ${result.error}`);
  printStats(label, nextTasks);
  return nextTasks;
}

// Глубокая копия «до» — чтобы сравнить не только id, но и все поля.
function snapshot(tasks) {
  return tasks.map((task) => ({ ...task }));
}

// ---------- Общий сценарий ----------

const demoBefore = snapshot(demoTasks);
let currentTasks = demoTasks;

printTasks("Исходные задачи", currentTasks);
console.log("Названия:", getTaskTitles(currentTasks));
console.log("Невыполненные id:", getPendingTasks(currentTasks).map((task) => task.id));
printStats("Исходная сводка", currentTasks);

currentTasks = applyResult(
  "После добавления id=20",
  currentTasks,
  addTask(currentTasks, 20, "Добавить проверку", "high"),
);
currentTasks = applyResult(
  "После completed=true id=4",
  currentTasks,
  setTaskCompleted(currentTasks, 4, true),
);
currentTasks = applyResult(
  "После переименования id=10",
  currentTasks,
  renameTask(currentTasks, 10, "Подготовить инструкцию запуска"),
);
currentTasks = applyResult(
  "После удаления id=7",
  currentTasks,
  removeTask(currentTasks, 7),
);

console.log("\n--- Обработка ошибки: повторный id ---");
currentTasks = applyResult(
  "Состояние не изменилось",
  currentTasks,
  addTask(currentTasks, 20, "Дубликат"),
);

console.log("\nИтоговые id:", currentTasks.map((task) => task.id).join(", "));
console.log(
  "Невыполненные id:",
  getPendingTasks(currentTasks).map((task) => task.id).join(", "),
);
console.log("demoTasks не изменён:", isDeepStrictEqual(demoTasks, demoBefore));

// ---------- Индивидуальный вариант ----------

console.log(`\n========== Вариант ${variantNumber} ==========`);

const variantBefore = snapshot(variantTasks);
let variantCurrent = variantTasks;

printTasks("Исходные задачи варианта", variantCurrent);
printStats("Исходная сводка варианта", variantCurrent);

variantCurrent = applyResult(
  "После добавления id=80",
  variantCurrent,
  addTask(variantCurrent, 80, "Провести генеральную репетицию", "medium"),
);
// id=11 уже выполнена — операция всё равно проверяется по контракту.
variantCurrent = applyResult(
  "После completed=true id=11",
  variantCurrent,
  setTaskCompleted(variantCurrent, 11, true),
);
variantCurrent = applyResult(
  "После переименования id=23",
  variantCurrent,
  renameTask(variantCurrent, 23, "Уточнить список источников"),
);
variantCurrent = applyResult(
  "После удаления id=37",
  variantCurrent,
  removeTask(variantCurrent, 37),
);

console.log("\n--- Повторное добавление id=80 ---");
variantCurrent = applyResult(
  "Состояние не изменилось",
  variantCurrent,
  addTask(variantCurrent, 80, "Ещё одна попытка"),
);

printTasks("Итоговый набор варианта", variantCurrent);
printStats("Итоговая сводка варианта", variantCurrent);

const renamed = findTaskById(variantCurrent, 23);
const originalRenamed = findTaskById(variantBefore, 23);
console.log(
  "id=23 переименован, остальные поля сохранены:",
  renamed?.title === "Уточнить список источников" &&
    renamed.completed === originalRenamed.completed &&
    renamed.priority === originalRenamed.priority,
);
console.log("variantTasks не изменён:", isDeepStrictEqual(variantTasks, variantBefore));
