import "../scss/main.scss"
import FetchUtils from "./FetchUtils";
import {ITask} from "./FetchUtils";
import HtmlUtils from "./HtmlUtils";

interface ITodoApp {
    elements: IElements;
    addTaskToApi: (e: SubmitEvent) => void;
    fetchUtils: IFetchUtils;
}

interface IElements {
    taskForm: HTMLFormElement;
    taskInput: HTMLInputElement;
    tasksList: HTMLElement;
}

interface IFetchUtils {
    baseUrl: string;
    get: (endpoint: string) => Promise<any>;
    post: (endpoint: string, body: any, headers?: HeadersInit | undefined) => Promise<any>;
}

class TodoApp {
    public fetchUtils: IFetchUtils;

    elements: IElements = {
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasksList: <HTMLUListElement>document.getElementById(`tasks_list`),
    };

    constructor(url: string) {
        this.fetchUtils = new FetchUtils(url);

        this.getTasks().then((r: Array<ITask>) => r.map((task: ITask) => this.createTasksListItem(task)));
        // this.getTasks().then(r => console.log(r));
        this.setEvents();
    };

    getTasks = async (): Promise<Array<ITask>> => await this.fetchUtils.get(`tasks`);

    addTaskToApi = async (e: SubmitEvent): Promise<void> => {
        e.preventDefault();

        const task = await this.fetchUtils.post(`tasks`, {
            taskName: this.elements.taskInput.value
        });

        console.log(task);

        this.elements.taskForm.reset();

        this.createTasksListItem(task);
    };

    createTasksListItem = (task: ITask): void => {

        const listItem: HTMLElement = HtmlUtils.createHtmlElement(`li`, {className: `tasks_list__task_item`});

            const checkBoxLabel = HtmlUtils.createHtmlElement(`label`, {className: `checkbox`});

        listItem.appendChild(HtmlUtils.createHtmlElement(`div`, {className: `task_checker`}))
                .appendChild(checkBoxLabel);

                checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`input`, {type: `checkbox`}));

                checkBoxLabel.appendChild(HtmlUtils.createHtmlElement(`span`, {className: `checkmark`}));

        listItem.appendChild(HtmlUtils.createHtmlElement(`span`, {innerText: task.taskName}));

        listItem.appendChild(HtmlUtils.createHtmlElement(`button`, {}))
                .appendChild(HtmlUtils.createHtmlElement(`span`, {className: `fa-solid fa-plus`}));

        this.elements.tasksList.appendChild(listItem);
    };

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
    };
}

// new TodoApp();
const app: TodoApp = new TodoApp(`http://localhost:9999`);

console.log(app);