import SplitColumnPlugin from 'main'
import {Setting, PluginSettingTab, App} from 'obsidian'

const NAME = "Split - Obsidian Columns";

export interface SettingItem {
	value: string;
	name: string;
	description: string;
}

export const DEFAULT_SETTINGS: ISplitColumnSettings = {
	minWidth: { value: "100", name: "Минимальная ширина колонки", description: "Столбцы будут иметь эту минимальную ширину перед переносом на новую строку. 0 отключает перенос столбцов. Полезно для небольших устройств." },
	defaultSpan: { value: "1", name: "Ширина столбца по умолчанию", description: "Ширина столбца по умолчанию. Если указана минимальная ширина, ширина столбца будет умножена на этот параметр." },
	defaultBorderWidth: { value: "1", name: "Толщина границы по умолчанию", description: "Толщина границы, которая будет установлена, если не указаны иные настройки." },
	defaultBorderColor: { value: "#000000", name: "Цвет границ по умолчанию", description: "Цвет границы, который будет установлен, если не указаны иные настройки." },
	defaultBorderStyle: { value: "solid", name: "Стиль границы по умолчанию", description: "Стиль границы, который будет установлен, если не указаны иные настройки." },
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