import TaskView from "../view/task.js";
import TaskEditView from "../view/task-edit";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class TaskController {
  constructor(container) {
    this._container = container;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._taskComponent = new TaskView(task);
    this._taskEditComponent = new TaskEditView(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceCardToForm();
      document.addEventListener(`click`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormToCard();
    });

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceFormToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._taskComponent, this._taskEditComponent);
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceFormToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
