import { MarkdownPostProcessorContext, Plugin, } from 'obsidian';
import { processDocument } from 'src/documentParser';
import { ISplitColumnSettings, loadSettings, SplitSettingsTab } from './src/settings';

export default class SplitColumnPlugin extends Plugin {

	settings: ISplitColumnSettings;

	async onload() {
		this.loadSettings();
		let settingTab = new SplitSettingsTab(this.app, this);
		this.addSettingTab(settingTab);
		this.registerMarkdownPostProcessor((element, context) => { processDocument(element, context, this) } );
	}

	onunload() {

	}

	loadSettings() {
		loadSettings(this);
	}
}
