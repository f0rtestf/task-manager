import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit.js";
import LoadMoreButtonView from "../view/load-more-button.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTaskView from "../view/no-task.js";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

const TASK_COUNT_PER_STEP = 8;

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditButtonClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTaskView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._loadMoreButtonComponent = new LoadMoreButtonView();
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._taskListComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._taskListComponent.getElement();

    tasks.slice(0, TASK_COUNT_PER_STEP)
      .forEach((task) => renderTask(taskListElement, task));

    if (tasks.length > TASK_COUNT_PER_STEP) {
      let renderedTaskCount = TASK_COUNT_PER_STEP;

      render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
          .forEach((task) => renderTask(taskListElement, task));

        renderedTaskCount += TASK_COUNT_PER_STEP;

        if (renderedTaskCount >= tasks.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }
}
