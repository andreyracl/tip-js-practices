"use strict";

const totalTasks = 15;
const completedTasks = 0;
const dailyLimit = 4;

const MAX_TASKS = 1000;
const MAX_DAILY_LIMIT = 1000;

const isValidTasks =
  Number.isInteger(totalTasks) &&
  Number.isInteger(completedTasks) &&
  totalTasks >= 0 &&
  totalTasks <= MAX_TASKS &&
  completedTasks >= 0 &&
  completedTasks <= totalTasks;

const isValidLimit =
  Number.isInteger(dailyLimit) &&
  dailyLimit >= 1 &&
  dailyLimit <= MAX_DAILY_LIMIT;

if (!isValidTasks) {
  console.log("Ошибка: недопустимые данные о задачах");
} else if (!isValidLimit) {
  console.log("Ошибка: недопустимая дневная норма");
} else {
  let remaining = totalTasks - completedTasks;
  let day = 0;

  if (remaining === 0) {
    console.log("Все задачи уже выполнены");
  } else {
    console.log(`Осталось задач: ${remaining}`);
  }

  // При remaining === 0 цикл не выполнится ни разу.
  while (remaining > 0) {
    day += 1;
    const doneToday = Math.min(dailyLimit, remaining);
    remaining -= doneToday;
    console.log(`День ${day}: выполнено ${doneToday}, осталось ${remaining}`);
  }

  console.log(`Потребуется дней: ${day}`);
}
