import "../scss/main.scss";
import FetchUtils from "./utils/FetchUtils";
import HtmlUtils from "./utils/HtmlUtils";
import {ITask} from "./types/common";

interface IElements {
    error: HTMLParagraphElement;
    taskForm: HTMLFormElement;
    taskCheckbox: HTMLInputElement;
    taskInput: HTMLInputElement;
    tasks: HTMLDivElement;
    tasksList: HTMLElement;
    tasksLeft: HTMLSpanElement;
    tasksClear: HTMLButtonElement;
    tasksFiltersWrapper: HTMLDivElement;
    tasksFiltersButtons: NodeListOf<HTMLButtonElement>;
}

interface IFetchUtils {
    get(endpoint: string): Array<ITask>;
    post(endpoint: string, body: ITask): ITask;
    put(endpoint: string, body: ITask): ITask;
    delete(endpoint: string): void;
}

export default class TodoApp {
    fetchUtils: IFetchUtils;
    elements: IElements = {
        error: <HTMLParagraphElement>document.getElementById(`task-error`),
        taskForm: <HTMLFormElement>document.getElementById(`task-form`),
        taskCheckbox: <HTMLInputElement>document.getElementById(`task-checkbox`),
        taskInput: <HTMLInputElement>document.getElementById(`task-input`),
        tasks: <HTMLDivElement>document.getElementById(`tasks-wrapper`),
        tasksList: <HTMLUListElement>document.getElementById(`tasks-list`),
        tasksLeft: <HTMLSpanElement>document.getElementById(`tasks-left`),
        tasksClear: <HTMLButtonElement>document.getElementById(`tasks-clear`),
        tasksFiltersWrapper: <HTMLDivElement>document.getElementById(`filters-wrapper`),
        tasksFiltersButtons: <NodeListOf<HTMLButtonElement>>document.querySelectorAll(`button[data-filter]`),
    };

    constructor() {
        this.fetchUtils = new FetchUtils();
        this.getTasks();
        this.setEvents();
    };

    getTasks = (): void => {
        const tasks = this.fetchUtils.get(`tasks`);
        tasks.map((task: ITask) => this.createTasksListItem(task));
        this.tasksCounter();
    };

    addTaskToApi = (e: SubmitEvent): void => {
        e.preventDefault();
        this.handleErrorHide();
        if(!this.validateTaskInput()) {
            return;
        }
        const task: ITask = this.fetchUtils.post(`tasks`, {
            taskName: this.elements.taskInput.value,
            isChecked: this.elements.taskCheckbox.checked
        });
        this.elements.taskInput.value = ``;
        this.createTasksListItem(task);
        this.tasksCounter();
    };

    validateTaskInput = (): boolean => {
        let flag: boolean = true;
        if (this.elements.taskInput.value.length <= 1){
            flag = false;
            this.handleErrorShow(`Task must be at least 2 characters long...`);
        } else if (this.elements.taskInput.value.length > 43) {
            flag = false;
            this.handleErrorShow(`Tasks can't be longer than 43 characters...`);
        }
        return flag;
    };

    handleErrorShow = (errorContent: string): void => {
        this.elements.error.textContent = errorContent;
        this.elements.error.style.display = `block`;
        this.elements.taskForm.style.margin = `2.65em auto 0em auto`;
        setTimeout((): void => this.handleErrorHide(), 7 * 1000);
    };

    handleErrorHide = (): void => {
        this.elements.error.style.display = `none`;
        this.elements.taskForm.style.margin = `2.65em auto 1.40em auto`;
    };

    addCheckedTask = (e: Event): void => (e.target as HTMLInputElement).checked ? this.elements.taskInput.classList.add(`done`) : this.elements.taskInput.classList.remove(`done`);

    createTasksListItem = (task: ITask): void => {
        const listItem: HTMLLIElement = HtmlUtils.createHtmlElement<HTMLLIElement>(`li`, {class: `tasks__list-item`});

        const checkBoxLabel: HTMLLabelElement = HtmlUtils.createHtmlElement<HTMLLabelElement>(`label`, {class: `task__checkbox-label`});

        const taskCheckbox = listItem.appendChild(HtmlUtils.createHtmlElement<HTMLDivElement>(`div`, {class: `task__checkbox`}));
        taskCheckbox.appendChild(checkBoxLabel);

        const checkBoxDefault: HTMLInputElement = HtmlUtils.createHtmlElement<HTMLInputElement>(`input`, {class: `task__checkbox-default`, type: `checkbox`, checked: task.isChecked, data: {"task-id": `${task.id}`}});
        checkBoxDefault.addEventListener('change', (e: Event) => this.handleCheckbox(e, task));
        checkBoxLabel.appendChild(checkBoxDefault);

        checkBoxLabel.appendChild(HtmlUtils.createHtmlElement<HTMLSpanElement>(`span`, {class: `task__checkbox-custom`}));

        const taskContent: HTMLDivElement = HtmlUtils.createHtmlElement<HTMLDivElement>(`div`, {class: `tasks__item-value`, text: task.taskName});
        task.isChecked && taskContent.classList.add(`done`);
        listItem.appendChild(taskContent);

        const deleteBtn: HTMLButtonElement = HtmlUtils.createHtmlElement<HTMLButtonElement>(`button`, {class: "btn"});
        deleteBtn.addEventListener(`click`, (e: MouseEvent) => this.deleteTask(e, task));
        listItem.appendChild(deleteBtn);

        deleteBtn.appendChild(HtmlUtils.createHtmlElement<HTMLSpanElement>(`span`, {class: `fa-solid fa-xmark`}));

        this.elements.tasksList.appendChild(listItem);
    };

    handleCheckbox = (e: Event, task: ITask): void => {
        const itemValue: HTMLDivElement = <HTMLDivElement>(e.target as HTMLInputElement).closest(`.tasks__list-item`)?.querySelector(`.tasks__item-value`);
        this.fetchUtils.put(`tasks/${task.id}`, {
            taskName: task.taskName,
            isChecked: (e.target as HTMLInputElement).checked
        });
        if ((e.target as HTMLInputElement).checked) {
            itemValue.classList.add(`done`);
            this.tasksCounter();

        } else {
            itemValue.classList.remove(`done`);
            this.tasksCounter();
        }
    };

    deleteTask = (e: MouseEvent, task: ITask): void => {
        this.fetchUtils.delete(`tasks/${task.id}`);
        (e.target as HTMLSpanElement).closest(`.tasks__list-item`)?.remove();
        this.tasksCounter();
    };

    tasksCounter = (): void => {
        const tasksListItems: NodeListOf<HTMLDivElement> = <NodeListOf<HTMLDivElement>>this.elements.tasksList.querySelectorAll(`.tasks__list-item`);
        const tasksNotDoneAmount: number = this.elements.tasksList.querySelectorAll(`.tasks__item-value:not(.done)`).length;

        if (!tasksListItems.length) {
            this.elements.tasks.style.display = "none";
        } else {
            this.elements.tasks.style.display = "block";
            tasksListItems.forEach((listItems: HTMLDivElement): string => listItems.style.display = "flex");

            if (!tasksNotDoneAmount || tasksListItems.length === tasksNotDoneAmount) {
                this.elements.tasksFiltersWrapper.style.display = "none";
            } else {
                this.elements.tasksFiltersWrapper.style.display = "flex";
                this.elements.tasksClear.style.display = `none`;
            }

            (tasksListItems.length === tasksNotDoneAmount) ? this.elements.tasksClear.style.display = `none` : this.elements.tasksClear.style.display = `inline-block`;

            if (tasksNotDoneAmount > 1) {
                this.elements.tasksLeft.innerText = `${tasksNotDoneAmount} items left`;
            } else if (tasksNotDoneAmount === 1) {
                this.elements.tasksLeft.innerText = `${tasksNotDoneAmount} item left`;
            } else {
                this.elements.tasksLeft.innerText = `All done!`;
            }
        }

        this.backToAll();
    };
	// * to jeszcze możesz wywalić
    handleTasksClear = (): void => {
        this.elements.tasksList.querySelectorAll(`input[type="checkbox"]:checked`).forEach((checkedItem: Element, index: number): void => {
            setTimeout((): void => {
                const taskId = checkedItem.getAttribute('data-task-id');
                this.fetchUtils.delete(`tasks/${taskId}`);
                checkedItem.closest(`.tasks__list-item`)?.remove();
                this.tasksCounter();
            }, 200 * index);
        });
    };

    handleTasksFilter = (e: MouseEvent): void => {
        const tasksCheckedLength: number = this.elements.tasksList.querySelectorAll(`input[type="checkbox"]:checked`).length;
        const tasksNotDoneAmount: number = this.elements.tasksList.querySelectorAll(`.tasks__item-value:not(.done)`).length;

        if ((e.target as HTMLButtonElement).dataset.filter === "completed") {
            if (tasksCheckedLength > 1) {
                this.elements.tasksLeft.innerText = `Done: ${tasksCheckedLength} items`;
            } else if (tasksCheckedLength === 1) {
                this.elements.tasksLeft.innerText = `Done: ${tasksCheckedLength} item`;
            }
        } else {
            this.tasksCounter();
        }

        if ((e.target as HTMLButtonElement).dataset.filter === "active") {
            this.elements.tasksClear.style.display = `none`;
            if (tasksNotDoneAmount > 1) {
                this.elements.tasksLeft.innerText = `Active: ${tasksNotDoneAmount} items`;
            } else if (tasksNotDoneAmount === 1) {
                this.elements.tasksLeft.innerText = `Active: ${tasksNotDoneAmount} item`;
            }
        } else {
            this.elements.tasksClear.style.display = `inline-block`;
        }

        this.setDefaultBtnColors();
        (e.target as HTMLButtonElement).style.color = `#FFFFFF`;

        this.elements.tasksList.querySelectorAll(`.tasks__list-item`).forEach((taskListItem: Element): void => {
            if((e.target as HTMLButtonElement).dataset.filter === 'all') {
                (taskListItem as HTMLLIElement).style.display = 'flex';
            }
            else if((e.target as HTMLButtonElement).dataset.filter === "active") {
                (taskListItem as HTMLLIElement).style.display = taskListItem.querySelector('input[type="checkbox"]:checked') ? "none" : "flex";
            }
            else if((e.target as HTMLButtonElement).dataset.filter === "completed") {
                (taskListItem as HTMLLIElement).style.display = taskListItem.querySelector('input[type="checkbox"]:checked') ? "flex" : "none";
            }
        });
    };

    backToAll = (): void => {
        this.setDefaultBtnColors();
        (document.querySelector(`[data-filter="all"]`) as HTMLButtonElement).style.color = `#FFFFFF`;
    };

    setDefaultBtnColors = (): void => this.elements.tasksFiltersButtons.forEach((filterBtn: HTMLButtonElement): string => filterBtn.style.color = `#515471`);

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
        this.elements.taskCheckbox.addEventListener(`change`, this.addCheckedTask);
        this.elements.tasksClear.addEventListener(`click`, this.handleTasksClear);
        this.elements.tasksFiltersButtons.forEach((filterBtn: HTMLButtonElement) => filterBtn.addEventListener(`click`, this.handleTasksFilter));
    };
};

new TodoApp();