import TaskController from "./task.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import SortView, {SortType} from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import {render, remove, RenderPosition} from "../utils/render.js";

const TASK_COUNT_PER_STEP = 8;

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

const getSortedTask = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showingTasksCount = TASK_COUNT_PER_STEP;
    this._noTasksComponent = new NoTaskView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._taskListComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._taskListComponent.getElement();

    renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._tasks.length > this._showingTasksCount) {
      let renderedTaskCount = this._showingTasksCount;
      const container = this._container.getElement();

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const sortedTasks = getSortedTask(tasks, this._sortComponent.getSortType(), renderedTaskCount, renderedTaskCount + this._showingTasksCount);
        const taskListElement = this._taskListComponent.getElement();
        renderTasks(taskListElement, sortedTasks.slice(0, renderedTaskCount));

        renderedTaskCount += TASK_COUNT_PER_STEP;

        if (renderedTaskCount >= this._tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }

  _onSortTypeChange() {
    this._showingTasksCount = TASK_COUNT_PER_STEP;
    const sortedTasks = getSortedTask(this._tasks, sortType, 0, this._showingTasksCount);
    const taskListElement = this._taskListComponent.getElement();

    taskListElement.innerHTML = ``;

    renderTasks(taskListElement, sortedTasks);
    this._renderLoadMoreButton();
  }
}
