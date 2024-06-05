import { Plugin, MarkdownView, TFile } from 'obsidian';
import MindMirrorSettingTab from './MindMirrorSettingTab'; 
import { fetchAndDisplayResult } from './apiHandler'; 
import { createUIElements } from './MindMirrorUI';

interface MindMirrorSettings {
	apiKey: string;
	length: string;
	noteRange: string;
}

const DEFAULT_SETTINGS: MindMirrorSettings = {
	apiKey: '',
	length: 'one sentence',
	noteRange: 'current'
};



export default class MindMirror extends Plugin {
	settings: MindMirrorSettings;
	settingsTab: MindMirrorSettingTab; // Define the settingsTab property

	private apiKey: string;
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	async onload() {
		await this.loadSettings();
		this.settingsTab = new MindMirrorSettingTab(this.app, this); // Initialize the settingsTab
		this.addSettingTab(this.settingsTab);
		console.log("Plugin loaded");
		createUIElements(this);
	}
	async handleRefresh() {
		console.log('hi');
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			const userInput = view.editor.getValue();
			const therapyType = (document.getElementById("therapy-type-dropdown") as HTMLSelectElement).value;
			const insightFilter = (document.getElementById("insight-filter-dropdown") as HTMLSelectElement).value;
			const length = this.settings.length; // Use the length from settings
			const noteRange = this.settings.noteRange; // Use the note range from settings
			const prompt = this.generatePrompt(therapyType, insightFilter, length);

			const resultDiv = document.getElementById("result");
			const popup = document.getElementById("popup");
			if (resultDiv && popup) {
				resultDiv.innerText = "Fetching feedback...";
				popup.style.display = "block"; 
			}

			this.fetchAndDisplayResult(prompt, userInput, "result", noteRange);
		}
	}

	async handlePlusClick() {
		const resultDiv = document.getElementById("result");
		if (!resultDiv) return;

		const advice = resultDiv.innerText;
		if (!advice) return;

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const editor = view.editor;
		const currentContent = editor.getValue();
		const updatedContent = `${currentContent}\n\n### AI:\n- ${advice}\n### Me:\n- `;
		editor.setValue(updatedContent);

			
		const lastLine = editor.lineCount() - 1;
		editor.setCursor({ line: lastLine, ch: 0 });
		editor.scrollIntoView({ from: { line: lastLine, ch: 0 }, to: { line: lastLine, ch: 0 } });
	}
	async handleHeartClick() {
		const resultDiv = document.getElementById("result");
		if (!resultDiv) return;

		const advice = resultDiv.innerText;
		if (!advice) return;

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const currentNoteFile = view.file;
		const currentNoteDate = currentNoteFile?.basename; 

		const feedbackFile = this.app.vault.getAbstractFileByPath("ai-feedback.md");

		if (feedbackFile instanceof TFile) { // Use instanceof check
			const content = await this.app.vault.read(feedbackFile);
			const updatedContent = `### ${currentNoteDate}\n${advice}\n\n${content}`;
			await this.app.vault.modify(feedbackFile, updatedContent);
		} else {
			console.log('no feedback file');
			
			const newContent = `### ${currentNoteDate}\n${advice}`;
			await this.app.vault.create("ai-feedback.md", newContent);
		}
	}

    generatePrompt(therapyType: string, insightFilter: string, length: string): string {
        return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}. Don't include any formatting or bullet points. Don't hold anything back.`;
    }

	async fetchAndDisplayResult(prompt: string, userInput: string, resultElementId: string, noteRange: string) {
		await fetchAndDisplayResult(this, prompt, userInput, resultElementId, noteRange);
	}

	async getRecentNotes(range: string): Promise<string[]> {
		const files = this.app.vault.getMarkdownFiles();

		
		const dailyNotes = files.filter(file => /\d{4}-\d{2}-\d{2}\.md$/.test(file.path));

		
		const sortedFiles = dailyNotes.sort((a, b) => b.path.localeCompare(a.path));

		
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return [];
		const currentNoteFile = view.file;
		const currentNoteDate = currentNoteFile?.basename;

		
		const currentIndex = sortedFiles.findIndex(file => file.basename === currentNoteDate);
		if (currentIndex === -1) return [];

		
		let limit;
		if (range === "last2") {
			limit = 2;
		} else if (range === "last3") {
			limit = 3;
		} else if (range === "last5") {
			limit = 5;
		} else if (range === "last10") {
			limit = 10;
		} else if (range === "last20") {
			limit = 20;
		} else {
			limit = 1; 
		}

		
		const recentFiles = sortedFiles.slice(currentIndex + 1, currentIndex + 1 + limit);
		console.log("🚀 ~ MindMirror ~ getRecentNotes ~ recentFiles:", recentFiles)

		
		const notesContent = await Promise.all(
			recentFiles.map(async (file) => {
				const content = await this.app.vault.read(file);
				return content;
			})
		);

		return notesContent;
	}

 
    onunload() {

        console.log("Plugin unloaded");
        const dropdownContainer = document.getElementById("dropdown-container");
        const popup = document.getElementById("popup");
        if (dropdownContainer) {
            dropdownContainer.remove();
            console.log("Dropdown container removed");
        }
        if (popup) {
            popup.remove();
            console.log("Popup removed");
        }
    }
}