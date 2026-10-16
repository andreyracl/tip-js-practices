// Общий контрольный набор. Для своего варианта ниже предусмотрен отдельный массив.
// Идентификатор задачи не совпадает с её индексом в массиве.
export const demoTasks = [
  { id: 1, title: "Изучить функции", completed: true, priority: "medium" },
  { id: 4, title: "Подготовить модель задач", completed: false, priority: "high" },
  { id: 7, title: "Проверить методы массивов", completed: false, priority: "low" },
  { id: 10, title: "Оформить README", completed: true, priority: "medium" },
];

// Вариант 2: «Подготовка выступления», K = 1 (выполнена первая задача).
export const variantNumber = 2;

export const variantTasks = [
  { id: 11, title: "Выбрать тему выступления", completed: true, priority: "high" },
  { id: 23, title: "Собрать материалы по теме", completed: false, priority: "high" },
  { id: 37, title: "Составить план доклада", completed: false, priority: "medium" },
  { id: 41, title: "Подготовить слайды", completed: false, priority: "medium" },
  { id: 58, title: "Отрепетировать выступление", completed: false, priority: "low" },
  { id: 64, title: "Проверить оборудование в аудитории", completed: false, priority: "low" },
];
