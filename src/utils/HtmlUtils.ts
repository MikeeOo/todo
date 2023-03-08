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
    static createHtmlElement<T extends HTMLElement>(selector: string, options: IOptions): T {
        const el: T = document.createElement(selector) as T;

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