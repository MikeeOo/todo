interface IOptions {
    className?: string;
}


export default class HtmlUtils {

    static createHtmlElement = (selector: string, options: IOptions = {}): HTMLElement => {

        const el: HTMLElement = document.createElement(selector);

        for (const option in options){
            console.log(option)
            console.log(options)
            el[<keyof IOptions>option] = options[<keyof IOptions>option] as string;
        }

        return el;
    }
}