export interface ITask {
    taskName: string;
    id: number;
}

export default class FetchUtils {

    public baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    };

    get = async (endpoint: string): Promise<Array<ITask>> => {
        return (await fetch(`${this.baseUrl}/${endpoint}`)).json()
    }

    post = async (
        endpoint: string,
        body: ITask,
        headers: HeadersInit | undefined = {"Content-Type": "application/json"}
    ): Promise<ITask> => {

        return (await fetch(`${this.baseUrl}/${endpoint}`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })).json()
    }
}