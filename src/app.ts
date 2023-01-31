import "../scss/main.scss"
import FetchUtils from "./FetchUtils";
import {ITask} from "./FetchUtils";
import HtmlUtils from "./HtmlUtils";

interface IElements {
    taskForm: HTMLFormElement;
    taskCheckbox: HTMLInputElement;
    taskInput: HTMLInputElement;
    tasksList: HTMLElement;
    tasksLeft: HTMLSpanElement;
    tasksClear: HTMLButtonElement;
    tasksFilters: NodeListOf<HTMLButtonElement>;
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
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskCheckbox: <HTMLInputElement>document.getElementById(`task_checkbox`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasksList: <HTMLUListElement>document.querySelector(`.tasks__list`),
        tasksLeft: <HTMLSpanElement>document.querySelector(`.tasks__counter_left`),
        tasksClear: <HTMLButtonElement>document.querySelector(`.tasks__counter_clear`),
        tasksFilters: <NodeListOf<HTMLButtonElement>>document.querySelectorAll(`button[data-filter]`)
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

        if (this.elements.taskInput.value.length > 43 || this.elements.taskInput.value.length === 0) {
            // console.log(`xd`);
        } else {
            const task: ITask = await this.fetchUtils.post(`tasks`, {
                taskName: this.elements.taskInput.value,
                isChecked: this.elements.taskCheckbox.checked
            });

            this.elements.taskInput.value = ``;

            this.createTasksListItem(task);

            !this.elements.taskCheckbox.checked && this.tasksCounter();
        }
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

        await this.fetchUtils.put(`tasks/${task.id}`, {
            taskName: task.taskName,
            isChecked: (e.target as HTMLInputElement).checked
        });

        if ((e.target as HTMLInputElement).checked) {
            const taskDone: HTMLElement = (e.target as HTMLInputElement).closest(`li`)?.childNodes[1] as HTMLElement;

            taskDone?.classList.add(`done`);

            // this.elements.tasksClear.classList.remove(`hidden`)

            this.tasksCounter();
        } else {
            const taskDone: HTMLElement = (e.target as HTMLInputElement).closest(`li`)?.childNodes[1] as HTMLElement;

            taskDone?.classList.remove(`done`);

            // this.elements.tasksClear.classList.add(`hidden`)

            this.tasksCounter();
        }
    };

    deleteTask = async (e: MouseEvent, task: ITask): Promise<void> => {

        (e.target as HTMLSpanElement).closest(`li`)?.remove();
        // TUTAJ MOŻESZ PODAĆ KLASĘ TEGO LI

        const taskDone: HTMLElement = (e.target as HTMLSpanElement).closest(`li`)?.childNodes[1] as HTMLElement;
        // TUTAJ POLEĆ QUERY SELECTOREM TUTAJ TEŻ KLASĘ SPANA

        taskDone.classList[1] !== `done` && this.tasksCounter();

        await this.fetchUtils.delete(`tasks/${task.id}`);
    };

    tasksCounter = (): void => {
        const tasksAmount: number = this.elements.tasksList.querySelectorAll(`.tasks__item_value:not(.done)`).length

        if (tasksAmount > 1) {
            this.elements.tasksLeft.innerText = `${tasksAmount} items left`;
        } else if (tasksAmount === 1) {
            this.elements.tasksLeft.innerText = `${tasksAmount} item left`;
        } else {
            this.elements.tasksLeft.innerText = ``;
        }
    };

    handleTasksClear = (): void => {
        this.elements.tasksList.querySelectorAll(`input[type="checkbox"]:checked`).forEach((checkedItem: Element, index: number): void => {

            checkedItem.closest(`.tasks__list_item`)?.remove();

            setTimeout(async (): Promise<void> =>
                await this.fetchUtils.delete(`tasks/${checkedItem.getAttribute('data-task-id')}`), 100 * index);
        });
    }

    handleTasksFilter = (e: MouseEvent): void => {

        this.elements.tasksList.querySelectorAll(`li`).forEach(taskListItem => {
            if((e.target as HTMLButtonElement).dataset.filter === 'all'){
                taskListItem.style.display = 'flex';
            }
            else if((e.target as HTMLButtonElement).dataset.filter === "active"){
                taskListItem.style.display = taskListItem.querySelector('input[type="checkbox"]:checked') ? "none" : "flex";
            }
            else if((e.target as HTMLButtonElement).dataset.filter === "completed"){
                taskListItem.style.display = taskListItem.querySelector('input[type="checkbox"]:checked') ? "flex" : "none";
            }
        });
    }

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
        this.elements.taskCheckbox.addEventListener(`change`, this.addCheckedTask);
        this.elements.tasksClear.addEventListener(`click`, this.handleTasksClear);
        this.elements.tasksFilters.forEach((filterBtn: HTMLButtonElement) => filterBtn.addEventListener(`click`, this.handleTasksFilter));
    };
}

const app = new TodoApp(`http://localhost:0666`);

console.log(app);

// new TodoApp();

// if (taskDone.classList[1] === `done`) {
//     this.elements.tasksClear.innerText = ``
// }

// console.log(this.elements.tasksFilters)
// dokończ logikę przełączania widoczności buttona
// console.log(this.elements.tasksList.getElementsByTagName(`li`).length === this.tasksAmount.length)
// console.log(this.elements.tasksList.getElementsByTagName(`li`).length === this.tasksAmount.length)
//
// if (this.tasksAmount.length === this.elements.tasksList.getElementsByTagName(`li`).length) {
//     this.elements.tasksClear.classList.add(`hidden`)
// } else if (this.elements.tasksList.getElementsByTagName(`li`).length === 0) {
//     this.elements.tasksClear.classList.add(`hidden`)
// } else {
//     this.elements.tasksClear.classList.remove(`hidden`)
// }

// może zrób oddzielną metodę ta te dynksy widoczność buttonów też możesz ogarnąć