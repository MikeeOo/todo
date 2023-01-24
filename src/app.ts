import "../scss/main.scss"
import FetchUtils from "./FetchUtils";
import {ITask} from "./FetchUtils";
import HtmlUtils from "./HtmlUtils";

interface IElements {
    taskForm: HTMLFormElement;
    taskInput: HTMLInputElement;
    tasksList: HTMLElement;
    tasksLeft: HTMLSpanElement;
}

interface IFetchUtils {
    baseUrl: string;
    get(endpoint: string): Promise<any>;
    post(endpoint: string, body: ITask): Promise<ITask>;
    delete(endpoint: string): Promise<void>;
}

class TodoApp {

    fetchUtils: IFetchUtils;

    tasksAmount: number = 0;

    elements: IElements = {
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasksList: <HTMLUListElement>document.getElementById(`tasks_list`),
        tasksLeft: <HTMLSpanElement>document.getElementById(`tasks_left`)
    };

    constructor(url: string) {
        this.fetchUtils = new FetchUtils(url);

        this.getTasks().then((r: Array<ITask>) => {
            this.tasksCounter(`init`, r.length);
            return r.map((task: ITask) => this.createTasksListItem(task));
        })
        this.setEvents();
    };

    getTasks = async (): Promise<Array<ITask>> => await this.fetchUtils.get(`tasks`);

    addTaskToApi = async (e: SubmitEvent): Promise<void> => {
        e.preventDefault();

        const task: ITask = await this.fetchUtils.post(`tasks`, {
            taskName: this.elements.taskInput.value
        });

        this.elements.taskForm.reset();

        // await this.updateTasksListLength();

        this.tasksCounter(`increment`, 1);

        this.createTasksListItem(task);
    };

    // createTasksListItem = (task: ITask): void => {
    //
    //     const listItem: HTMLElement = HtmlUtils.createHtmlElement(`li`, {className: `tasks_list__task_item`});
    //
    //         const checkBoxLabel = HtmlUtils.createHtmlElement(`label`, {className: `checkbox`});
    //
    //     listItem.appendChild(HtmlUtils.createHtmlElement(`div`, {className: `task_checker`}))
    //             .appendChild(checkBoxLabel);
    //
    //             checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`input`, {type: `checkbox`}));
    //
    //             checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`span`, {className: `checkmark`}));
    //
    //     listItem.appendChild(HtmlUtils.createHtmlElement(`span`, {innerText: task.taskName}));
    //
    //     listItem.appendChild(HtmlUtils.createHtmlElement(`button`, {}))
    //             .appendChild(HtmlUtils.createHtmlElement(`span`, {className: `fa-solid fa-plus`}));
    //
    //     this.elements.tasksList.appendChild(listItem);
    // };

    createTasksListItem = (task: ITask): void => {

        const listItem: HTMLElement = HtmlUtils.createHtmlElement(`li`, {class: `tasks_list__task_item`});

        // custom checkBox
        const checkBoxLabel: HTMLElement = HtmlUtils.createHtmlElement(`label`, {class: `checkbox__label`});

        listItem.appendChild(HtmlUtils.createHtmlElement(`div`, {class: `checkbox`})).appendChild(checkBoxLabel);

        checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`input`, {class: `checkbox__default`, type: `checkbox`}));

        checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`span`, {class: `checkbox__custom`}));

        // taskName
        listItem.appendChild(HtmlUtils.createHtmlElement(`div`, {class: `task`, text: task.taskName}));

        // deleteBtn
        const deleteBtn: HTMLElement = HtmlUtils.createHtmlElement(`button`, {class: "btn"});

        listItem.appendChild(deleteBtn).appendChild(HtmlUtils.createHtmlElement(`span`, {class: `fa-solid fa-xmark`}));

        deleteBtn.addEventListener(`click`, (e: MouseEvent) => this.deleteTask(e, task));

        // add list item to tasksList
        this.elements.tasksList.appendChild(listItem);
    };

    deleteTask = async (e: MouseEvent, task: ITask): Promise<void> => {

        (e.target as HTMLSpanElement)?.closest(`li`)?.remove();

        this.tasksCounter(`decrement`, 1);

        await this.fetchUtils.delete(`tasks/${task.id}`);

        // await this.updateTasksListLength();
    };

    tasksCounter = (state: string, value: number): void => {

        if (state === `increment`) {
            this.tasksAmount += value;
        }
        else if (state === `decrement`) {
            this.tasksAmount -= value;
        }
        else {
            this.tasksAmount = value;
        }

        if (this.tasksAmount > 1) {
            this.elements.tasksLeft.innerText = `${this.tasksAmount} items left`;
        } else if (this.tasksAmount === 1) {
            this.elements.tasksLeft.innerText = `${this.tasksAmount} item left`;
        } else {
            this.elements.tasksLeft.innerText = ``;
        }
    }

    // updateTasksListLength =  async (): Promise<void> => {
        // const tasksList: Array<ITask> = await this.getTasks();
        //
        // if (tasksList.length > 1) {
        //     this.elements.taskCounter.innerText = `${tasksList.length} items left`;
        // } else if (tasksList.length === 1) {
        //     this.elements.taskCounter.innerText = `${tasksList.length} item left`;
        // } else {
        //     this.elements.taskCounter.innerText = ``;
        // }
    // }

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
    };
}

// new TodoApp();
const app = new TodoApp(`http://localhost:0666`);

console.log(app);