import { 
    BORDER_TYPE_ALL, 
    BORDER_TYPE_BOTTOM, 
    BORDER_TYPE_LEFT, 
    BORDER_TYPE_RIGHT, 
    BORDER_TYPE_TOP, 
    KEY_BORDER_COLOR, 
    KEY_BORDER_STYLE, 
    KEY_BORDER_TYPE, 
    KEY_BORDER_WIDTH, 
    KEY_COL_BACKGROUND, 
    KEY_COL_PADDING, 
    KEY_COL_SPAN 
} from "./constants";

export class IColumnStyle {
    selectedBorders: Array<IStyleItem>;
    borderWidth: IStyleItem;
    borderColor: IStyleItem;
    borderStyle: IStyleItem;
    colBackground: IStyleItem;
    colSpan: IStyleItem;
    colPadding: IStyleItem;
}

export interface IStyleItem extends IStyleValue {
    key: string;
    cssTag: string;
}

export interface IStyleValue {
    value: string;
    validateValue(): boolean;
}


export class ColumnStyleParser {

    public parseFromString(source: string): IColumnStyle {
        let style = {} as IColumnStyle; 

        let parametersStrings = source.split("\n");
        for(let parametersString of parametersStrings) {
            let parameterString = parametersString.replace(/\s+/g, '').trim();
            let parameter = parameterString.split(":");
            if (parameter.length > 1) {
                let token = parameter[0];
                let value = parameter[1];
                style = this.addStyleProperty(token, value, style);
            }
        }

        return style;
    }
 
    private addStyleProperty(token: string, value: string, style: IColumnStyle): IColumnStyle {
        switch(token) {
            case KEY_BORDER_TYPE:
                style.selectedBorders = this.buildBorderParameters(value);
                break;

            case KEY_BORDER_WIDTH:
                style.borderWidth = this.buildWidthParameter(value);
                break;

            case KEY_BORDER_COLOR:
                style.borderColor = this.buildColorParameter(value);
                break;

            case KEY_BORDER_STYLE:
                style.borderStyle = this.buildStyleParameter(value);
                break;

            case KEY_COL_BACKGROUND:
                style.colBackground = this.buildColumnBackgroundParameter(value);
                break;

            case KEY_COL_SPAN:
                style.colSpan = this.buildColumnWidthParameter(value);
                break;

            case KEY_COL_PADDING:
                style.colPadding = this.buildColumnPaddingParameter(value);
                break;
        }

        return style;
    }

    private buildColumnPaddingParameter(source: string): IStyleItem {
        return { value: source, key: KEY_COL_PADDING, cssTag: "padding-left", validateValue: () => true };
    } 

    private buildColumnWidthParameter(source: string): IStyleItem {
        return { value: source, key: KEY_COL_SPAN, cssTag: "", validateValue: () => true };
    } 

    private buildColumnBackgroundParameter(source: string): IStyleItem {
        return { value: source, key: KEY_COL_BACKGROUND, cssTag: "background-color", validateValue: () => true };
    }

    private buildStyleParameter(source: string): IStyleItem {
        let parameterValues = source.split(",");
        return { value: parameterValues[0], key: KEY_BORDER_STYLE, cssTag: "-style", validateValue: () => true };
    }

    private buildColorParameter(source: string): IStyleItem {
        return { value: source, key: KEY_BORDER_COLOR, cssTag: "-color", validateValue: () => true };
    }

    private buildWidthParameter(source: string): IStyleItem {
        return { value: source, key: KEY_BORDER_WIDTH, cssTag: "-width", validateValue: () => true };
    }
    
    private buildBorderParameters(source: string): Array<IStyleItem> {
        let borderTypeParameters: Array<IStyleItem> = [];
        let parameterValues = source.split(",");
        for(let value of parameterValues) {
            switch(value) {
                case BORDER_TYPE_ALL:
                    borderTypeParameters.push(this.buildBorderParameter(value, "border"));
                    break;
    
                case BORDER_TYPE_TOP:
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-top"));
                    break;
    
                case BORDER_TYPE_BOTTOM:
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-bottom"));
                    break;
    
                case BORDER_TYPE_LEFT:
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-left"));
                    break;
    
                case BORDER_TYPE_RIGHT:
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-right"));
                    break;
            }
        }

        return borderTypeParameters;
    }

    private buildBorderParameter(key: string, tag: string): IStyleItem {
        return { value: "", key: key, cssTag: tag, validateValue: () => true };
    }
}


export function tryColumnStyleParse(parent: Element): {isSuccess: boolean, style: IColumnStyle | null } {
    let preElement = parent.querySelector("pre");
    if (preElement && parent == preElement.parentNode) {
        let codeElement = preElement.querySelector("code");
        if (codeElement) {
            if (codeElement.className == `language-col-style`) {
                let styleString = codeElement.textContent;
                let isExist = true;

                let parameterParser = new ColumnStyleParser();
                let style = parameterParser.parseFromString(styleString!);

                return { isSuccess: isExist, style };
            }
        }
    }

    let isExist = false;
    let style = null;

    return { isSuccess: isExist, style };
}

export function trySplitStyleParse(parent: Element): {isSuccess: boolean, wrapStyle: IStyleValue | null } {
    let preElement = parent.querySelector("pre");
    if (preElement && parent == preElement.parentNode) {
        let codeElement = preElement.querySelector("code");
        if (codeElement) {
            if (codeElement.className == `language-split-style`) {
                let parameterString = codeElement.textContent!.replace(/\s+/g, '').trim();
                let parameter = parameterString.split(":");

                let wrapStyle: IStyleValue = { value: parameter[1], validateValue: () => true };
                let isExist = true;

                return { isSuccess: isExist, wrapStyle };
            }
        }
    }

    let isExist = false;
    let wrapStyle: IStyleValue = { value: "12", validateValue: () => true };

    return { isSuccess: isExist, wrapStyle };
}

