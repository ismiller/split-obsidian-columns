import { ColumnStyleParser, IColumnStyle } from "./columnStyleParser";
import { ISplitColumnSettings, SplitSettingsTab } from "./settings";


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
		if(this.isBorderStyleSet(style)) {
			for(let parameterItem  of style.selectedBorders) {
				let prefix = `${parameterItem.cssTag}`;
				this.applyBorderStyle(element, style, prefix);
			}
		} else {
			this.applyBorderStyle(element, style, `border`);
		}

		if (style.colBackground) {
			element.style.setProperty(style.colBackground.cssTag, style.colBackground.value);
		} 

		if (style.colPadding) {
			element.style.setProperty(style.colPadding.cssTag, `${style.colPadding.value}px`)
		}

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

		Object.assign(element.style, this.generateCssString(width, span));
	}

	public applyDefaultStyle(element: HTMLElement) {
		let span = NaN;
		if (this.defaultSettings.defaultSpan.value) {
			span = parseFloat(this.defaultSettings.defaultSpan.value);
		} 

		if (isNaN(span)) {
			span = 1;
		}

		let width = 0;
		if (this.defaultSettings.minWidth.value) {
			width = parseInt(this.defaultSettings.minWidth.value);
		} 

		if (width == 0) {
			width = 100;
		}

		Object.assign(element.style, this.generateCssString(width, span));
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
			}
            
			lastChild = this.nodeToHtmlElement(lastChild.lastChild);
		}
    }

    private nodeToHtmlElement (node: ChildNode | null): HTMLElement {
        return node as HTMLElement;
    }

	private isBorderStyleSet(style: IColumnStyle): boolean {
		return style.selectedBorders && style.selectedBorders.length > 0 && style.selectedBorders.find(b => b.key == "all") == undefined;
	}

	private applyBorderStyle(element: HTMLElement, style: IColumnStyle, prefix: string) {
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

	generateCssString (width: number, span: number): CSSStyleDeclaration {
		let o = {} as CSSStyleDeclaration
		o.flexGrow = span.toString()
		o.flexBasis = (width * span).toString() + "px"
		o.width = (width * span).toString() + "px"
		return o
	}
}