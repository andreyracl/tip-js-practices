"use strict";

const totalTasks = 15;
const completedTasks = 0;
const dailyLimit = 4;

if (
  !Number.isInteger(totalTasks) ||
  !Number.isInteger(completedTasks) ||
  totalTasks < 0 ||
  totalTasks > 1000 ||
  completedTasks < 0 ||
  completedTasks > totalTasks
) {
  console.log("Ошибка: недопустимые данные о задачах");
} else if (
  !Number.isInteger(dailyLimit) ||
  dailyLimit < 1 ||
  dailyLimit > 1000
) {
  console.log("Ошибка: недопустимая дневная норма");
} else {
  let remaining = totalTasks - completedTasks;

  if (remaining === 0) {
    console.log("Все задачи уже выполнены");
    console.log("Потребуется дней: 0");
  } else {
    console.log(`Осталось задач: ${remaining}`);

    let day = 0;
    while (remaining > 0) {
      day += 1;
      const today = Math.min(dailyLimit, remaining);
      remaining -= today;
      console.log(`День ${day}: выполнено ${today}, осталось ${remaining}`);
    }

    console.log(`Потребуется дней: ${day}`);
  }
}