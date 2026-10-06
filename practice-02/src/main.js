import { demoTasks, variantNumber, variantTasks } from "./data.js";
import {
  createTask,
  findTaskById,
  getPendingTasks,
  getTaskTitles,
  getTaskStats,
  addTask,
  setTaskCompleted,
  renameTask,
  removeTask,
} from "./task-service.js";

function printStats(label, tasks) {
  const { total, completed, pending, progress } = getTaskStats(tasks);
  console.log(
    `${label}: всего ${total}; выполнено ${completed}; осталось ${pending}`
  );
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

let currentTasks = demoTasks;

printTasks("Исходные задачи", currentTasks);
console.log("Названия:", getTaskTitles(currentTasks));
console.log(
  "Невыполненные id:",
  getPendingTasks(currentTasks).map((task) => task.id)
);
printStats("Исходная сводка", currentTasks);

let result = addTask(currentTasks, 20, "Добавить проверку", "high");
if (result.ok) currentTasks = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После добавления id=20", currentTasks);

result = setTaskCompleted(currentTasks, 4, true);
if (result.ok) currentTasks = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После completed=true id=4", currentTasks);

result = renameTask(currentTasks, 10, "Подготовить инструкцию запуска");
if (result.ok) currentTasks = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После переименования id=10", currentTasks);

result = removeTask(currentTasks, 7);
if (result.ok) currentTasks = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После удаления id=7", currentTasks);

// Демонстрация отказа
console.log("\n--- Обработка ошибки: повторный id ---");
const dupResult = addTask(currentTasks, 20, "Дубликат");
if (!dupResult.ok) console.error(`Ошибка: ${dupResult.error}`);
printStats("Состояние не изменилось", currentTasks);

console.log(
  "\nИтоговые id:",
  currentTasks.map((task) => task.id).join(", ")
);
console.log(
  "demoTasks не изменён:",
  JSON.stringify(demoTasks.map((task) => task.id)) ===
    JSON.stringify([1, 4, 7, 10])
);


let variantCurrent = variantTasks;
printTasks("Исходные задачи варианта", variantCurrent);
printStats("Исходная сводка варианта", variantCurrent);

// 2. Добавить id = 80 (приоритет medium для варианта 2)
result = addTask(variantCurrent, 80, "Провести генеральную репетицию", "medium");
if (result.ok) variantCurrent = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После добавления id=80", variantCurrent);

// 3. Установить completed = true для id = 11 (уже true — операция всё равно проверяется)
result = setTaskCompleted(variantCurrent, 11, true);
if (result.ok) variantCurrent = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После completed=true id=11", variantCurrent);

// 4. Переименовать id = 23, остальные поля сохранить
result = renameTask(variantCurrent, 23, "Уточнить список источников");
if (result.ok) variantCurrent = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После переименования id=23", variantCurrent);

// 5. Удалить id = 37
result = removeTask(variantCurrent, 37);
if (result.ok) variantCurrent = result.tasks;
else console.error(`Ошибка: ${result.error}`);
printStats("После удаления id=37", variantCurrent);

// 6. Повторно добавить id = 80 и показать отказ без изменения состояния
console.log("\n--- Повторное добавление id=80 ---");
const dupVariant = addTask(variantCurrent, 80, "Ещё одна попытка");
if (!dupVariant.ok) console.error(`Ошибка: ${dupVariant.error}`);
printStats("Состояние не изменилось", variantCurrent);

// 7. Итог и подтверждение неизменности variantTasks
printTasks("Итоговый набор варианта", variantCurrent);
printStats("Итоговая сводка варианта", variantCurrent);

console.log(
  "variantTasks не изменён:",
  JSON.stringify(variantTasks.map((task) => task.id)) ===
    JSON.stringify([11, 23, 37, 41, 58, 64])
);
console.log(
  "Проверка: id=23 переименован, остальные поля сохранены:",
  (() => {
    const t = variantCurrent.find((task) => task.id === 23);
    return t && t.title === "Уточнить список источников" && t.completed === false && t.priority === "high";
  })()
);