import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import BoardController from "./controllers/board.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils/render.js";

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
