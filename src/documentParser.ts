import SplitColumnPlugin from "main";
import { MarkdownPostProcessorContext, MarkdownRenderChild } from "obsidian";
import { tryColumnStyleParse, trySplitStyleParse } from "./columnStyleParser";
import { SPLIT_ITEM_TOKEN, SPLIT_TOKEN } from "./constants";
import { ElementProcessor } from "./elementProcessor";
import { DEFAULT_SETTINGS, ISplitColumnSettings } from "./settings";
import { createRow, moveChildren } from "./utilities";

export function processDocument(element: Element, context: MarkdownPostProcessorContext, plugin: SplitColumnPlugin) {
    let elementProcessor = new ElementProcessor(plugin.settings);
    processor(element, context, elementProcessor);
}

function processor(element: Element, context: MarkdownPostProcessorContext, elementProcessor: ElementProcessor) {
    for (let child of Array.from(element.children)) {
        if (child == null || (child.nodeName != "UL" && child.nodeName != "OL")) {
            continue;
        }

        for (let items of Array.from(child.children)) {
            if (items && items!.textContent!.trim().startsWith(SPLIT_TOKEN) == false) {
                processor(items, context, elementProcessor);
                continue;
            }

            let extractResult = trySplitStyleParse(items);
            let wrap = parseInt(extractResult.wrapStyle!.value, undefined); 

            child.removeChild(items);
            
            let itemList = items.querySelector("ul, ol");
            if (itemList == null) {
                continue;
            }

            let colParent = createRow(element, context);
            let columnCount = 0;

            for (let itemListChildren of Array.from(itemList.children)) {
                if (itemListChildren && itemListChildren!.textContent!.trim().startsWith(SPLIT_ITEM_TOKEN)) {
                    
                    if (columnCount >= wrap) {
                        colParent = createRow(element, context);
                        columnCount = 0;
                    }

                    columnCount++;

                    let childDiv = colParent.createDiv({ cls: "column" });
                    
                    let extractResult = tryColumnStyleParse(itemListChildren);
                    if (extractResult.isSuccess) {
                        itemListChildren.removeChild(itemListChildren.querySelector("pre")!);
                        elementProcessor.applyStyle(childDiv, extractResult.style!);
                    } else {
                        elementProcessor.applyDefaultStyle(childDiv);
                    }

                    let renderColC = new MarkdownRenderChild(childDiv);
                    context.addChild(renderColC);

                    processor(itemListChildren, context, elementProcessor);
                    moveChildren(itemListChildren, childDiv);
                    elementProcessor.processMissingColumn(childDiv);
                }
            }
        }
    }
}
