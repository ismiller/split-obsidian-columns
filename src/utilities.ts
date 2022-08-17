import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";


export function createRow(element: Element, context: MarkdownPostProcessorContext): HTMLDivElement {
    let row = element.createDiv({  cls: "row" });
    let renderColP = new MarkdownRenderChild(row);
    context.addChild(renderColP);

    return row;
}

export function moveChildren(from: Element, to: Element) {
    let afterText = false;
    for (let itemListItemChild of Array.from(from.childNodes)) {
        if (afterText) {
            to.appendChild(itemListItemChild);
        }
        
        if (itemListItemChild.nodeName == "#text") {
            afterText = true;
        }
    }
}