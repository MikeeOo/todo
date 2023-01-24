export interface ITask {
    taskName: string;
    id?: number;
    isChecked?: boolean;
}

export default class FetchUtils {

    baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    };

    get = async (endpoint: string): Promise<Array<ITask>> => {
        return (await fetch(`${this.baseUrl}/${endpoint}/`)).json();
    };

    post = async (
        endpoint: string,
        body: ITask,
        headers: HeadersInit | undefined = {"Content-Type": "application/json"}
    ): Promise<ITask> => {

        return (await fetch(`${this.baseUrl}/${endpoint}/`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })).json();
    };

    put = async (
        endpoint: string,
        body: ITask,
        headers: HeadersInit | undefined = {"Content-Type": "application/json"}
    ): Promise<ITask> => {

        return (await fetch(`${this.baseUrl}/${endpoint}/`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(body)
        })).json();
    };

    delete = async (endpoint: string): Promise<void> => {
        await fetch(`${this.baseUrl}/${endpoint}/`, {method: "DELETE"});
    };
}