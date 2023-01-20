import "../scss/main.scss"

interface ITodoApp {
    elements: IElements;
    addTaskToList: (e: SubmitEvent) => void;
}

interface IElements {
    taskForm: HTMLFormElement;
    taskInput: HTMLInputElement;
    tasksList: HTMLElement;
}

class TodoApp {

    elements: IElements = {
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasksList: <HTMLElement>document.getElementById(`tasks_list`),
    };

    constructor() {

        this.setEvents();
    };


    addTaskToList = (e: SubmitEvent): void => {
        e.preventDefault();

        console.log(e)
        console.log(this.elements.taskInput.value);

        this.elements.taskForm.reset();
    };

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToList);
    };
}

const app: ITodoApp = new TodoApp();

console.log(app);