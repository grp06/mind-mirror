import { PluginSettingTab, Setting, App, Notice } from 'obsidian';
import MyPlugin from './main'; // Adjust the path if necessary

export default class MindMirrorSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Mind Mirror Settings' });

		let apiKeyInput: HTMLInputElement;
		let lengthInput: HTMLSelectElement;
		let noteRangeInput: HTMLSelectElement;

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Enter your API key here')
			.addText(text => {
				apiKeyInput = text.inputEl;
				text
					.setPlaceholder('Enter your API key')
					.setValue(this.plugin.settings.apiKey)
					.onChange(async () => {
						this.plugin.settings.apiKey = apiKeyInput.value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Length')
			.setDesc('Select the length of the response')
			.addDropdown(dropdown => {
				lengthInput = dropdown.selectEl;
				dropdown
					.addOption('one sentence', 'One Sentence')
					.addOption('three sentences', 'Three Sentences')
					.addOption('one paragraph', 'One Paragraph')
					.setValue(this.plugin.settings.length)
					.onChange(async (value) => { // Ensure the value is passed to the handler
						console.log("🚀 ~ MyPluginSettingTab ~ .onChange ~ value:", value)
						this.plugin.settings.length = value;
						this.updateCurrentSettingsDisplay(); // Update display on change
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Note Range')
			.setDesc('Select the range of notes to consider')
			.addDropdown(dropdown => {
				noteRangeInput = dropdown.selectEl;
				dropdown
					.addOption('current', 'Just this note')
					.addOption('last2', 'Last 2 notes')
					.addOption('last3', 'Last 3 notes')
					.addOption('last5', 'Last 5 notes')
					.addOption('last10', 'Last 10 notes')
					.addOption('last20', 'Last 20 notes')
					.setValue(this.plugin.settings.noteRange)
					.onChange(async (value) => { // Ensure the value is passed to the handler
						console.log("🚀 ~ MyPluginSettingTab ~ .onChange ~ value:", value)
						this.plugin.settings.noteRange = value;
						this.updateCurrentSettingsDisplay(); // Update display on change
						await this.plugin.saveSettings();
					});
			});

		const saveButton = containerEl.createEl('button', { text: 'Save' });
		saveButton.addEventListener('click', async () => {
			this.plugin.settings.apiKey = apiKeyInput.value;
			this.plugin.settings.length = lengthInput.value;
			this.plugin.settings.noteRange = noteRangeInput.value;
			await this.plugin.saveSettings();
			new Notice('Settings saved');
		});

		// Add a section to display current settings
		const currentSettingsEl = containerEl.createEl('div', { cls: 'current-settings' });
		this.updateCurrentSettingsDisplay(currentSettingsEl);

		// Add Update Memories button
		const updateMemoriesButton = containerEl.createEl('button', { text: 'Update Memories' });
		updateMemoriesButton.addEventListener('click', async () => {
			const view = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				const userInput = view.editor.getValue();
				const memories = await this.plugin.fetchMemories(userInput);
				new Notice('Memories updated');
				console.log("🚀 ~ MindMirror ~ updateMemoriesButton ~ memories:", memories);
			}
		});
	}

	updateCurrentSettingsDisplay(currentSettingsEl?: HTMLElement): void {
		const { length, noteRange } = this.plugin.settings;
		const displayText = `Length: ${length}\nNote range: ${noteRange}`; // Add line break
		if (currentSettingsEl) {
			currentSettingsEl.setText(displayText);
		} else {
			const existingEl = this.containerEl.querySelector('.current-settings');
			if (existingEl) {
				existingEl.setText(displayText);
			}
		}

		// Update the settings display in the UI
		const settingsDisplay = document.getElementById("settings-display");
		if (settingsDisplay) {
			settingsDisplay.setText(displayText);
		}
	}
}