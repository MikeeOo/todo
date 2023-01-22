interface IOptions {
    className?: string;
    type?: string;
    innerText?: string;
    innerHTML?: string;
}

type HTMLElements = HTMLLIElement | HTMLInputElement | HTMLButtonElement ;

export default class HtmlUtils {

    static createHtmlElement = (selector: string, options: IOptions): HTMLElement => {

        const el: HTMLElements = <HTMLElements>document.createElement(selector);

        // console.log(el)
        for (const option in options){
            // console.log(option)
            // console.log(options)
            el[<keyof IOptions>option] = options[<keyof IOptions>option] as string;
        }

        return el;
    }
}