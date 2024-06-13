import { PluginSettingTab, Setting, App, Notice, MarkdownView } from 'obsidian';
import MyPlugin from './main'; // Adjust the path if necessary
import { loadMagicSDK, getMagicInstance } from './magic';
import { EmailModal } from './EmailModal'; // Adjust the path if necessary

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
					.onChange(async (value) => {
						this.plugin.settings.length = value;
						this.updateCurrentSettingsDisplay();
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
					.onChange(async (value) => {
						this.plugin.settings.noteRange = value;
						this.updateCurrentSettingsDisplay();
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

		

		// Add Magic authentication button
		// Replace the Magic authentication button with your custom email auth button
		const authButton = containerEl.createEl('button', { text: 'Authenticate with Email' });
		authButton.addEventListener('click', async () => {
			new EmailModal(this.app, async (email, isSignUp) => {
				try {
					const endpoint = isSignUp ? '/api/signup/' : '/api/login/';
					const response = await fetch(`https://your-django-app.com${endpoint}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email }),
					});
					if (response.ok) {
						const data = await response.json();
						console.log('Authenticated successfully:', data);
						new Notice('Authenticated successfully');
					} else {
						const error = await response.json();
						console.error('Authentication failed:', error);
						new Notice('Authentication failed');
					}
				} catch (error) {
					console.error('Authentication failed:', error);
					new Notice('Authentication failed');
				}
			}).open();
		});
	}

	updateCurrentSettingsDisplay(currentSettingsEl?: HTMLElement): void {
		const { length, noteRange } = this.plugin.settings;
		const displayText = `Length: ${length}\nNote range: ${noteRange}`;
		if (currentSettingsEl) {
			currentSettingsEl.setText(displayText);
		} else {
			const existingEl = this.containerEl.querySelector('.current-settings');
			if (existingEl) {
				existingEl.setText(displayText);
			}
		}

		const settingsDisplay = document.getElementById("settings-display");
		if (settingsDisplay) {
			settingsDisplay.setText(displayText);
		}
	}
}