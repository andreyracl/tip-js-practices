"use strict";

const totalTasks = 15;
const completedTasks = 0;

const MAX_TASKS = 1000;

const isValidInput =
  Number.isInteger(totalTasks) &&
  Number.isInteger(completedTasks) &&
  totalTasks >= 0 &&
  totalTasks <= MAX_TASKS &&
  completedTasks >= 0 &&
  completedTasks <= totalTasks;

if (!isValidInput) {
  console.log("Ошибка: недопустимые входные данные");
} else if (totalTasks === 0) {
  // При totalTasks === 0 проверка выше гарантирует completedTasks === 0.
  console.log("Задач пока нет");
} else {
  const remaining = totalTasks - completedTasks;
  const progress = (completedTasks / totalTasks) * 100;

  let status = "В работе";
  if (completedTasks === 0) {
    status = "Не начато";
  } else if (completedTasks === totalTasks) {
    status = "Завершено";
  }

  console.log(`Всего задач: ${totalTasks}`);
  console.log(`Выполнено: ${completedTasks}`);
  console.log(`Осталось: ${remaining}`);
  console.log(`Прогресс: ${progress.toFixed(1)}%`);
  console.log(`Статус: ${status}`);
}
