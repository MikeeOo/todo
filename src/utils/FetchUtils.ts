import {ITask} from "../types/common";

export default class FetchUtils {
    private storageKey: string = 'todo-tasks';
    
    constructor() {
        // Initialize localStorage if empty
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    };
    
    get = (endpoint: string): Array<ITask> => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return tasks;
    };
    
    post = (endpoint: string, body: ITask): ITask => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const newTask: ITask = {
            ...body,
            id: Date.now(), 
            isChecked: body.isChecked || false
        };
        
        tasks.push(newTask);
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
        
        return newTask;
    };
    
    put = (endpoint: string, body: ITask): ITask => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const taskId = Number(endpoint.split('/')[1]);
        
        const updatedTasks = tasks.map((task: ITask) => 
            task.id === taskId ? { ...task, ...body } : task
        );
        
        localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
        const updatedTask = updatedTasks.find((task: ITask) => task.id === taskId);
        
        return updatedTask as ITask;
    };
    
    delete = (endpoint: string): void => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const taskId = Number(endpoint.split('/')[1]);
        
        const filteredTasks = tasks.filter((task: ITask) => task.id !== taskId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
    };
};