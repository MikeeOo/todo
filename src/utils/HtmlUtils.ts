interface IOptions {
    class?: string;
    type?: string;
    text? : string;
    checked?: boolean;
    data?: {
        [key: string]: string
    };
}

export default class HtmlUtils {
    static createHtmlElement = (selector: string, options: IOptions): HTMLElement => {
        const el: HTMLElement = document.createElement(selector);
        for (const [option, value] of Object.entries(options)) {
            if (option === 'checked' && value) {
                el.setAttribute(option, value);
            } else if (option !== 'checked' && option !== 'data') {
                option === `text` ? el.textContent = value : el.setAttribute(option, value);
            }
        }
        if (options.data) {
            for (const [dataKey, dataValue] of Object.entries(options.data)) {
                el.setAttribute(`data-${dataKey}`, dataValue);
            }
        }
        return el;
    };
};