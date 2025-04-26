import {ITask} from "../types/common";

export default class LocalStorageUtils {
    private storageKey: string = 'todo-tasks';
    
    constructor() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    };
    
    get = (): Array<ITask> => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        return tasks;
    };
    
    post = (task: ITask): ITask => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        const timestamp = Date.now();
        const uuid = crypto.randomUUID();
        const hybridId = `${timestamp}-${uuid}`;
        
        const newTask: ITask = {
            ...task,
            id: hybridId,
            isChecked: task.isChecked || false
        };
        
        tasks.push(newTask);
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
        
        return newTask;
    };
    
    put = (taskId: string, task: ITask): ITask => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        
        const updatedTasks = tasks.map((t: ITask) => 
            t.id === taskId ? { ...t, ...task } : t
        );
        
        localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
        const updatedTask = updatedTasks.find((t: ITask) => t.id === taskId);
        
        return updatedTask as ITask;
    };
    
    delete = (taskId: string): void => {
        const tasks = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        
        const filteredTasks = tasks.filter((task: ITask) => task.id !== taskId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
    };
}; 