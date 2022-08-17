import { MarkdownPostProcessorContext, Plugin, } from 'obsidian';
import { processDocument } from 'src/documentParser';
import { loadSettings, SplitSettingsTab } from './src/settings';


export default class SplitColumnPlugin extends Plugin {

	settings: SplitSettingsTab;

	async onload() {
		await this.loadSettings();
		let settingTab = new SplitSettingsTab(this.app, this);
		this.addSettingTab(settingTab);
		this.registerMarkdownPostProcessor(this.markdownPostProcessor);
	}

	onunload() {

	}

	async loadSettings() {
		loadSettings(this);
	}

	markdownPostProcessor(element: HTMLElement, context: MarkdownPostProcessorContext) {
		processDocument(element, context);
	}
}
