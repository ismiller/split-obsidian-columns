import SplitColumnPlugin from 'main'
import {Setting, PluginSettingTab, App} from 'obsidian'

const NAME = "Split - Obsidian Columns";

type BorderStyleTypes = 'none' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
const BORDER_STYLE: Record<BorderStyleTypes, string> = {
    none: `none`,
    dotted: `dotted`,
    dashed: `dashed`,
    solid: `solid`, 
    double: `double`, 
    groove: `groove`,
    ridge: `ridge`, 
    inset: `inset`, 
    outset: `outset`
}


export interface SettingItem {
	value: string;
	name: string;
	description: string;
}

export const DEFAULT_SETTINGS: ISplitColumnSettings = {
	minWidth: { value: "100", name: "Minimum column width", description: "Columns have a minimum sharpness before wrapping to a new line. 0 disables column wrapping. Useful for small devices." },
	defaultSpan: { value: "1", name: "The default span of an item", description: "Default column width. If a minimum width is specified, the span will be multiplied by that column setting." },
	defaultBorderWidth: { value: "1", name: "Default border width", description: "The thickness of the border that will be set if no other settings are specified." },
	defaultBorderColor: { value: "#000000", name: "Default border color", description: "The color of the border that will be set if no other settings are specified." },
	defaultBorderStyle: { value: "solid", name: "Default border style", description: "The style of the border that will be set if no other settings are specified." },
}

export interface ISplitColumnSettings {
	minWidth: SettingItem,
	defaultSpan: SettingItem,
    defaultBorderWidth: SettingItem,
    defaultBorderColor: SettingItem,
    defaultBorderStyle: SettingItem,
}

export class SplitSettingsTab extends PluginSettingTab {
	plugin: SplitColumnPlugin;

	constructor(app: App, plugin: SplitColumnPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.showSettings(DEFAULT_SETTINGS, NAME);
	}

    private showSettings(DEFAULT_SETTINGS: any, name: string) {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for ' + name });
    
        let entries = (Object.entries(DEFAULT_SETTINGS) as [string, SettingItem][])
    
        for (let entry of entries) {
            this.createSetting(containerEl, entry);
        }
    }

    private createSetting(containerEl: any, entry: [string, SettingItem]) {

        let setting = new Setting(containerEl)
                .setName(entry[1].name)
                .setDesc(entry[1].description);
    
        setting.addText(text => text
            .setPlaceholder(String(entry[1].value))
            .setValue(entry[1].value)
            .onChange(value => {
                (this.plugin.settings as any)[entry[0]].value = value;
                let saveData:any = {}
                Object.entries(this.plugin.settings).forEach((i) => {
                    saveData[i[0]] = (i[1] as SettingItem).value;
                })
                this.plugin.saveData(saveData);
            })
        );
    }
}

export function loadSettings(obj: any) {
    obj.settings = DEFAULT_SETTINGS;
    obj.loadData().then((data: any) => {
        if (data) {
            let items = Object.entries(data)
            items.forEach((item:[string, string]) => {
                if ((obj.settings as any)[item[0]]) {
                    (obj.settings as any)[item[0]].value = item[1];
                }
            })
        }
    });
}