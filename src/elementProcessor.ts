import { IColumnStyle } from "./columnStyleParser";
import { BORDER_TYPE_ALL } from "./constants";
import { ISplitColumnSettings } from "./settings";


export class ElementProcessor {

	defaultSettings: ISplitColumnSettings;

	constructor(settings: ISplitColumnSettings) {
		this.defaultSettings = settings;
	}

    public processMissingColumn (rootColumnElement: HTMLElement) {
		this.processTopElement(rootColumnElement);
        this.processBottomElement(rootColumnElement);
	}

	public applyStyle(element: HTMLElement, style: IColumnStyle) {
		let cssStyle = {} as CSSStyleDeclaration;

		if(this.isBorderStyleSet(style)) {
			for(let parameterItem  of style.selectedBorders) {
				let prefix = `${parameterItem.cssTag}`;
				this.setBorderStyle(element, style, prefix);
			}
		} else {
			this.setBorderStyle(element, style, `border`);
		}

		if (style.colBackground) {
			element.style.setProperty(style.colBackground.cssTag, style.colBackground.value);
		} 

		if (style.colPadding) {
			element.style.setProperty(style.colPadding.cssTag, `${style.colPadding.value}px`);
		}

		cssStyle = this.setColumnSize(style, cssStyle);
		Object.assign(element.style, cssStyle);
	}

	public applyDefaultStyle(element: HTMLElement) {
		let cssStyle = {} as CSSStyleDeclaration;
		let emptyStyle = {} as IColumnStyle;
		cssStyle = this.setColumnSize(emptyStyle, cssStyle);

		Object.assign(element.style, cssStyle);
	}

    private processTopElement(rootElement: HTMLElement) {
        let firstChild = rootElement;
		while (firstChild != null) {
			if ("style" in firstChild) {
				firstChild.style.marginTop = "0px";
			}

			firstChild = this.nodeToHtmlElement(firstChild.lastChild);
		}
    }

    private processBottomElement(rootElement: HTMLElement) {
		let lastChild = rootElement;
		while (lastChild != null) {
			if ("style" in lastChild) {
				lastChild.style.marginBottom = "0px";
				lastChild.style.paddingBottom = "10px";
			}
            
			lastChild = this.nodeToHtmlElement(lastChild.lastChild);
		}
    }

    private nodeToHtmlElement (node: ChildNode | null): HTMLElement {
        return node as HTMLElement;
    }

	private isBorderStyleSet(style: IColumnStyle): boolean {
		return style.selectedBorders && style.selectedBorders.length > 0 && style.selectedBorders.find(b => b.key == BORDER_TYPE_ALL) == undefined;
	}

	private setBorderStyle(element: HTMLElement, style: IColumnStyle, prefix: string) {
		if (style.borderWidth) {
			element.style.setProperty(`${prefix}${style.borderWidth.cssTag}`, `${style.borderWidth.value}px`);												
		} else {
			let defaultValue = this.defaultSettings.defaultBorderWidth.value;
			element.style.setProperty(`${prefix}-width`, `${defaultValue}px`);
		}

		if (style.borderColor) {
			element.style.setProperty(`${prefix}${style.borderColor.cssTag}`, style.borderColor.value);												
		} else {
			let defaultValue = this.defaultSettings.defaultBorderColor.value;
			element.style.setProperty(`${prefix}-color`, `${defaultValue}`);
		}

		if (style.borderStyle) {
			element.style.setProperty(`${prefix}${style.borderStyle.cssTag}`, style.borderStyle.value);												
		} else {
			let defaultValue = this.defaultSettings.defaultBorderStyle.value;
			element.style.setProperty(`${prefix}-style`, `${defaultValue}`);
		}
	}

	private setColumnSize (style: IColumnStyle, cssStyle: CSSStyleDeclaration): CSSStyleDeclaration {
		let span = NaN;
		if (style.colSpan) {
			span = parseFloat(style.colSpan.value);
		} else {
			span = parseFloat(this.defaultSettings.defaultSpan.value);
		}

		if (isNaN(span)) {
			span = 1;
		}

		let width = parseInt(this.defaultSettings.minWidth.value);

		if (width == 0) {
			width = 100;
		}
		
		cssStyle.flexGrow = span.toString();
		cssStyle.flexBasis = (width * span).toString() + "px";
		cssStyle.width = (width * span).toString() + "px";

		return cssStyle;
	}
}