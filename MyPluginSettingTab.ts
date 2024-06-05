import { PluginSettingTab, Setting, App, Notice } from 'obsidian';
import MyPlugin from './main'; // Adjust the path if necessary

export default class MyPluginSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for MyPlugin' });

		let apiKeyInput: HTMLInputElement;

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Enter your API key here')
			.addText(text => {
				apiKeyInput = text.inputEl;
				text
					.setPlaceholder('Enter your API key')
					.setValue(this.plugin.settings.apiKey);
			});

		const saveButton = containerEl.createEl('button', { text: 'Save' });
		saveButton.addEventListener('click', async () => {
			this.plugin.settings.apiKey = apiKeyInput.value;
			await this.plugin.saveSettings();
			new Notice('Settings saved');
		});
	}
}