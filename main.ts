import { Plugin, MarkdownRenderChild, MarkdownRenderer, PluginSettingTab, App, MarkdownPostProcessorContext, Editor, MarkdownView, Modal, Setting } from 'obsidian';
import { ElementProcessor } from 'src/elementProcessor';
import { ColumnStyleParser, IColumnStyle, IColumnStyleItem } from './src/columnStyleParser';
import { DEFAULT_SETTINGS, loadSettings, SplitSettingsTab } from './src/settings';

// Remember to rename these classes and interfaces!

const SPLIT_TOKEN = "!#split";
const SPLIT_ITEM_TOKEN = "!#item"

export default class MyPlugin extends Plugin {
	settings: SplitSettingsTab;
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SplitSettingsTab(this.app, this));

		let processList = (element: Element, context: MarkdownPostProcessorContext) => {
			for (let child of Array.from(element.children)) {
				if (child == null) {
					continue;
				}

				if (child.nodeName != "UL" && child.nodeName != "OL" && child.nodeName != "PRE") {
					continue;
				}

				for (let listItem of Array.from(child.children)) {
					if (listItem == null) {
						continue;
					}

					if (listItem!.textContent!.trim().startsWith(SPLIT_TOKEN) == false) {
						processList(listItem, context);
						continue;
					}

					child.removeChild(listItem);
					let colParent = element.createEl("div", {  cls: "columnParent" });

					let renderColP = new MarkdownRenderChild(colParent);
					context.addChild(renderColP);
					let itemList = listItem.querySelector("ul, ol");
					if (itemList == null) {
						continue;
					}

					for (let itemListItem of Array.from(itemList.children)) {
						if (itemListItem == null) {
							continue;
						}

						if (itemListItem?.textContent?.trim().startsWith(SPLIT_ITEM_TOKEN)) {
							let elementProcessor = new ElementProcessor(DEFAULT_SETTINGS);
							let childDiv = colParent.createEl("div", { cls: "columnChild" });
							let itemList2 = itemListItem.querySelector("pre");
							let isStyleApply = false;
							if (itemList2)
							{
								if (itemListItem == itemList2.parentNode)
								{
									let itemList2Code = itemList2.querySelector("code");
									if (itemList2Code)
									{
										if (itemList2Code.className == `language-split-settings`)
										{
											let parameterParser = new ColumnStyleParser()
	
											let parameter = parameterParser.parseFromString(itemList2Code!.textContent!);
											itemListItem.removeChild(itemList2);
											elementProcessor.applyStyle(childDiv, parameter);
											isStyleApply = true;
										}
									}
								}
							}
							
							if (isStyleApply == false) {
								elementProcessor.applyDefaultStyle(childDiv);
							}

							let renderColC = new MarkdownRenderChild(childDiv);
							context.addChild(renderColC);

							let afterText = false;
							processList(itemListItem, context);
	
							for (let itemListItemChild of Array.from(itemListItem.childNodes)) {
								if (afterText) {
									childDiv.appendChild(itemListItemChild);
								}
								if (itemListItemChild.nodeName == "#text") {
									afterText = true;
								}
							}
	
							elementProcessor.processMissingColumn(childDiv);
						}
					}
				}
			}
		}

		this.registerMarkdownPostProcessor((element, context) => { processList(element, context) });

	}

	onunload() {

	}

	async loadSettings() {
		loadSettings(this)
	}
}
