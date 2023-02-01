import "../scss/main.scss"
import FetchUtils from "./FetchUtils";
import {ITask} from "./FetchUtils";
import HtmlUtils from "./HtmlUtils";

interface IElements {
    error: HTMLParagraphElement;
    taskForm: HTMLFormElement;
    taskCheckbox: HTMLInputElement;
    taskInput: HTMLInputElement;
    tasks: HTMLDivElement;
    tasksList: HTMLElement;
    tasksLeft: HTMLSpanElement;
    tasksClear: HTMLButtonElement;
    tasksFilterWrapper: HTMLDivElement;
    tasksFilterButtons: NodeListOf<HTMLButtonElement>;
}

interface IFetchUtils {
    baseUrl: string;
    get(endpoint: string): Promise<any>;
    post(endpoint: string, body: ITask): Promise<ITask>;
    put(endpoint: string, body: ITask): Promise<ITask>;
    delete(endpoint: string): Promise<void>;
}

class TodoApp {

    fetchUtils: IFetchUtils;

    elements: IElements = {
        error: <HTMLParagraphElement>document.getElementById(`error`),
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskCheckbox: <HTMLInputElement>document.getElementById(`task_checkbox`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasks: <HTMLDivElement>document.querySelector(`.tasks`),
        tasksList: <HTMLUListElement>document.querySelector(`.tasks__list`),
        tasksLeft: <HTMLSpanElement>document.querySelector(`.tasks__counter_left`),
        tasksClear: <HTMLButtonElement>document.querySelector(`.tasks__counter_clear`),
        tasksFilterWrapper: <HTMLDivElement>document.querySelector(`.tasks__filter_wrapper`),
        tasksFilterButtons: <NodeListOf<HTMLButtonElement>>document.querySelectorAll(`button[data-filter]`),
    };

    constructor(url: string) {
        this.fetchUtils = new FetchUtils(url);


        this.getTasks().then((r: Array<ITask>): void => {

            r.map((task: ITask) => this.createTasksListItem(task));

            this.tasksCounter();
        });

        this.setEvents();
    };

    getTasks = async (): Promise<Array<ITask>> => await this.fetchUtils.get(`tasks`);

    addTaskToApi = async (e: SubmitEvent): Promise<void> => {
        e.preventDefault();

        this.handleErrorHide()

        if (this.elements.taskInput.value.length <= 1) {

            this.handleErrorShow(`Task must be at least 2 characters long...`);

        } else if (this.elements.taskInput.value.length > 43) {

            this.handleErrorShow(`Tasks can't be longer than 43 characters...`);
        } else {

            const task: ITask = await this.fetchUtils.post(`tasks`, {
                taskName: this.elements.taskInput.value,
                isChecked: this.elements.taskCheckbox.checked
            });

            this.elements.taskInput.value = ``;

            this.createTasksListItem(task);

            this.tasksCounter();
        }
    };

    handleErrorShow = (errorContent: string): void => {

        this.elements.error.textContent = errorContent;
        this.elements.error.style.display = `block`;
        this.elements.taskForm.style.margin = `2.65em auto 0em auto`;

        setTimeout((): void => this.handleErrorHide(), 12 * 1000);
    };

    handleErrorHide = (): void => {
        this.elements.error.style.display = `none`;
        this.elements.taskForm.style.margin = `2.65em auto 1.40em auto`;
    };

    addCheckedTask = (e: Event): void => (e.target as HTMLInputElement).checked ? this.elements.taskInput.classList.add(`done`) : this.elements.taskInput.classList.remove(`done`);

    createTasksListItem = (task: ITask): void => {

        const listItem: HTMLElement = HtmlUtils.createHtmlElement(`li`, {class: `tasks__list_item`});

        // __CUSTOM__CHECKBOX___
        const checkBoxLabel: HTMLElement = HtmlUtils.createHtmlElement(`label`, {class: `checkbox__label`});

        listItem.appendChild(HtmlUtils.createHtmlElement(`div`, {class: `checkbox`})).appendChild(checkBoxLabel);

        const checkBoxDefault: HTMLElement = HtmlUtils.createHtmlElement(`input`, {class: `checkbox__default`, type: `checkbox`, checked: task.isChecked, data: {"task-id": `${task.id}`}});

        checkBoxLabel.appendChild(checkBoxDefault);

        checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`span`, {class: `checkbox__custom`}));

        // __TASK____NAME__
        const taskContent: HTMLElement = HtmlUtils.createHtmlElement(`div`, {class: `tasks__item_value`, text: task.taskName})

        listItem.appendChild(taskContent);

        task.isChecked && taskContent.classList.add(`done`);

        // __DELETE__BUTTON__
        const deleteBtn: HTMLElement = HtmlUtils.createHtmlElement(`button`, {class: "btn"});

        listItem.appendChild(deleteBtn).appendChild(HtmlUtils.createHtmlElement(`span`, {class: `fa-solid fa-xmark`}));

        // EVENTS
        // checkbox--event
        checkBoxDefault.addEventListener('change', (e: Event) => this.handleCheckbox(e, task));
        // delete_button--event
        deleteBtn.addEventListener(`click`, (e: MouseEvent) => this.deleteTask(e, task));

        // add list item to tasksList
        this.elements.tasksList.appendChild(listItem);
    };

    handleCheckbox = async (e: Event, task: ITask): Promise<void> => {
        const itemValue: HTMLDivElement = <HTMLDivElement>(e.target as HTMLInputElement).closest(`.tasks__list_item`)?.querySelector(`.tasks__item_value`);

        await this.fetchUtils.put(`tasks/${task.id}`, {
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

    deleteTask = async (e: MouseEvent, task: ITask): Promise<void> => {

        (e.target as HTMLSpanElement).closest(`.tasks__list_item`)?.remove();

        this.tasksCounter();

        await this.fetchUtils.delete(`tasks/${task.id}`);
    };

    tasksCounter = (): void => {
        const tasksListItems: NodeListOf<HTMLDivElement> = <NodeListOf<HTMLDivElement>>this.elements.tasksList.querySelectorAll(`.tasks__list_item`);
        const tasksNotDoneAmount: number = this.elements.tasksList.querySelectorAll(`.tasks__item_value:not(.done)`).length;

        if (!tasksListItems.length) {

            this.elements.tasks.style.display = "none";
        } else {

            this.elements.tasks.style.display = "block";

            tasksListItems.forEach((listItems: HTMLDivElement): string => listItems.style.display = "flex");
            // to powoduje powrót do all

            if (!tasksNotDoneAmount || tasksListItems.length === tasksNotDoneAmount) {

                this.elements.tasksFilterWrapper.style.display = "none";
            } else {

                this.elements.tasksFilterWrapper.style.display = "flex";
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

    handleTasksClear = (): void => {
        this.elements.tasksList.querySelectorAll(`input[type="checkbox"]:checked`).forEach((checkedItem: Element, index: number): void => {

            checkedItem.closest(`.tasks__list_item`)?.remove();

            this.tasksCounter();

            setTimeout(async (): Promise<void> =>
                await this.fetchUtils.delete(`tasks/${checkedItem.getAttribute('data-task-id')}`), 200 * index);
        });
    }

    handleTasksFilter = (e: MouseEvent): void => {
        const tasksCheckedLength: number = this.elements.tasksList.querySelectorAll(`input[type="checkbox"]:checked`).length;
        const tasksNotDoneAmount: number = this.elements.tasksList.querySelectorAll(`.tasks__item_value:not(.done)`).length;

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

        this.elements.tasksList.querySelectorAll(`.tasks__list_item`).forEach((taskListItem: Element): void => {
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
    }

    backToAll = (): void => {
        this.setDefaultBtnColors();
        (document.querySelector(`[data-filter="all"]`) as HTMLButtonElement).style.color = `#FFFFFF`;
    }

    setDefaultBtnColors = (): void => this.elements.tasksFilterButtons.forEach((filterBtn: HTMLButtonElement): string => filterBtn.style.color = `#515471`);

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
        this.elements.taskCheckbox.addEventListener(`change`, this.addCheckedTask);
        this.elements.tasksClear.addEventListener(`click`, this.handleTasksClear);
        this.elements.tasksFilterButtons.forEach((filterBtn: HTMLButtonElement) => filterBtn.addEventListener(`click`, this.handleTasksFilter));
    };
}

const app = new TodoApp(`http://localhost:0666`);

console.log(app);
