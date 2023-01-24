interface IOptions {
    class?: string;
    type?: string;
    text? : string;
    checked?: boolean;
    // innerText?: string;
    // innerHTML?: string;
}

export default class HtmlUtils {
    static createHtmlElement = (selector: string, options: IOptions): HTMLElement => {

        const el: HTMLElement = document.createElement(selector);

        for (const [option, value] of Object.entries(options)) {

            if (option === 'checked' && value) {
                el.setAttribute(option, value);
            } else if (option !== 'checked') {
                option === `text` ? el.textContent = value : el.setAttribute(option, value);
            }
        }
        return el;
    }
}

// type HTMLElements = HTMLLIElement | HTMLInputElement | HTMLButtonElement ;
//
// export default class HtmlUtils {
//
//     static createHtmlElement = (selector: string, options: IOptions): HTMLElement => {
//
//         const el: HTMLElements = <HTMLElements>document.createElement(selector);
//
//         console.log(el)
//         for (const option in options){
//             // console.log(option)
//             // console.log(options)
//             el[<keyof IOptions>option] = options[<keyof IOptions>option] as string;
//         }
//
//         return el;
//     }
// }


// if (option === 'checked' && value) {
//     el.setAttribute(option, value);
// } else if (option !== 'checked') {
//     option === `text` ? el.textContent = value : el.setAttribute(option, value);
// }