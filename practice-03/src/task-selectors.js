// Вход: корректный массив задач и фильтр all/pending/completed.
// Результат: новый массив, исходный порядок и объекты сохраняются.
const FILTER_PREDICATES = {
  all: () => true,
  pending: (task) => task.completed === false,
  completed: (task) => task.completed === true,
};

export function getVisibleTasks(tasks, filter = "all") {
  const predicate = Object.hasOwn(FILTER_PREDICATES, filter)
    ? FILTER_PREDICATES[filter]
    : FILTER_PREDICATES.all;
  return tasks.filter(predicate); // filter всегда возвращает новый массив
}
