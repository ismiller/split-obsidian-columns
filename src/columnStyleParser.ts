import { ISplitColumnSettings, SettingItem, SplitSettingsTab } from "./settings";

export class IColumnStyle {
    selectedBorders: Array<IColumnStyleItem>;
    borderWidth: IColumnStyleItem;
    borderColor: IColumnStyleItem;
    borderStyle: IColumnStyleItem;
    colBackground: IColumnStyleItem;
    colSpan: IColumnStyleItem;
    colPadding: IColumnStyleItem;
}

export interface IColumnStyleItem {
    value: string;
    key: string;
    cssTag: string;

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
                style = this.addStyleProperty(token, value, style)
            }
        }

        return style;
    }

    private addStyleProperty(token: string, value: string, style: IColumnStyle): IColumnStyle {
        switch(token) {
            case "border-type":
                style.selectedBorders = this.buildBorderParameters(value);
                break;

            case "border-width":
                style.borderWidth = this.buildWidthParameter(value);
                break;

            case "border-color":
                style.borderColor = this.buildColorParameter(value);
                break;

            case "border-style":
                style.borderStyle = this.buildStyleParameter(value);
                break;

            case "col-background":
                style.colBackground = this.buildColumnBackgroundParameter(value);
                break;

            case "col-span":
                style.colSpan = this.buildColumnWidthParameter(value);
                break;

            case "col-padding":
                style.colPadding = this.buildColumnPaddingParameter(value);
                break;
        }

        return style;
    }

    private buildColumnPaddingParameter(source: string): IColumnStyleItem {
        return { value: source, key: "col-padding", cssTag: "padding-left", validateValue: () => true }
    } 

    private buildColumnWidthParameter(source: string): IColumnStyleItem {
        return { value: source, key: "col-span", cssTag: "", validateValue: () => true }
    } 

    private buildColumnBackgroundParameter(source: string): IColumnStyleItem {
        return { value: source, key: "col-background", cssTag: "background-color", validateValue: () => true }
    }

    private buildStyleParameter(source: string): IColumnStyleItem {
        let parameterValues = source.split(",");
        return { value: parameterValues[0], key: "border-style", cssTag: "-style", validateValue: () => true }
    }

    private buildColorParameter(source: string): IColumnStyleItem {
        return { value: source, key: "border-color", cssTag: "-color", validateValue: () => true }
    }

    private buildWidthParameter(source: string): IColumnStyleItem {
        return { value: source, key: "border-width", cssTag: "-width", validateValue: () => true }
    }
    
    private buildBorderParameters(source: string): Array<IColumnStyleItem> {
        let borderTypeParameters: Array<IColumnStyleItem> = [];
        let parameterValues = source.split(",");
        for(let value of parameterValues) {
            switch(value) {
                case "all":
                    borderTypeParameters.push(this.buildBorderParameter(value, "border"));
                    break;
    
                case "top":
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-top"));
                    break;
    
                case "bottom":
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-bottom"));
                    break;
    
                case "left":
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-left"));
                    break;
    
                case "right":
                    borderTypeParameters.push(this.buildBorderParameter(value, "border-right"));
                    break;
            }
        }

        return borderTypeParameters;
    }

    private buildBorderParameter(key: string, tag: string): IColumnStyleItem {
        return { value: "", key: key, cssTag: tag, validateValue: () => true }
    }
}