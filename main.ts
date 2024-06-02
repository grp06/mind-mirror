import { Plugin, MarkdownView, TFile, normalizePath } from 'obsidian';


export default class MyPlugin extends Plugin {
	private apiKey: string;


	async loadConfig(): Promise<{ apiKey: string }> {
		const configPath = normalizePath(this.app.vault.configDir + '/plugins/mind-mirror/config.json');
		console.log("🚀 ~ MyPlugin ~ loadConfig ~ configPath:", configPath)
		const configContent = await this.app.vault.adapter.read(configPath);
		return JSON.parse(configContent);
	}
    
	async onload() {
        console.log("Plugin loaded");

	
		const config = await this.loadConfig();
		this.apiKey = config.apiKey;
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
		document.head.appendChild(link);
		
        // Create a container for all elements
        const container = document.createElement("div");
        container.id = "plugin-container";
        container.innerHTML = `
            <div id="dropdown-container">
                <label for="therapy-type-dropdown">Type of Therapy</label>
                <select id="therapy-type-dropdown">
                    <option value="cbt">Cognitive Behavioral Therapy</option>
                    <option value="sfbt">Solution-Focused Brief Therapy</option>
                    <option value="gestalt">Gestalt Therapy</option>
                    <option value="dbt">Dialectical Behavior Therapy</option>
                    <option value="mbct">Mindfulness-Based Cognitive Therapy</option>
                    <option value="psychodynamic">Psychodynamic Therapy</option>
                    <option value="humanistic">Humanistic Therapy</option>
                    <option value="existential">Existential Therapy</option>
                    <option value="ipt">Interpersonal Therapy</option>
                    <option value="family-systems">Family Systems Therapy</option>
                </select>

                <label for="insight-filter-dropdown">Insight Filter</label>
                <select id="insight-filter-dropdown">
                    <option value="find-blindspots">Find Blindspots</option>
                    <option value="give-feedback">Give Feedback</option>
                    <option value="challenge-assumptions">Challenge Assumptions</option>
                    <option value="identify-patterns">Identify Patterns</option>
                    <option value="give-journaling-prompt">Give Me a Journaling Prompt</option>
                    <option value="detect-sentiment">Detect Sentiment</option>
                    <option value="detect-underlying-emotions">Detect Underlying Emotions</option>
                    <option value="generate-insights">Generate Insights</option>
                    <option value="narrative-reframing">Narrative Reframing</option>
                    <option value="action-planning">Action Planning</option>
                </select>

                <label for="length-dropdown">Length</label>
                <select id="length-dropdown">
                    <option value="one sentence">One sentence</option>
                    <option value="three sentences">Three sentences</option>
                    <option value="one paragraph">One paragraph</option>
                </select>

                <label for="note-range-dropdown">Note Range</label>
                <select id="note-range-dropdown">
                    <option value="current">Just this note</option>
					<option value="last2">Last 2 notes</option>
					<option value="last3">Last 3 notes</option>
                    <option value="last5">Last 5 notes</option>
                    <option value="last10">Last 10 notes</option>
                    <option value="last20">Last 20 notes</option>
                </select>

                <button id="refresh-button">Refresh</button>
            </div>
			<div class="popup" id="popup" style="display: none;">
				<button id="close-button" class="close-button">&times;</button>
				<div id="result"></div>
				<div class="buttons-container">
					<div id="heart-emoji" style="display: none;">
						<i class="material-icons">favorite</i>
					</div>
					<div id="plus-emoji">
						<i class="material-icons">add</i>
					</div>
				</div>
			</div>
        `;
        document.body.appendChild(container);
        console.log("Container appended to body");

        const closeButton = document.getElementById("close-button");
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                const popup = document.getElementById("popup");
                if (popup) {
                    popup.style.display = "none";
                }
            });
        }

        const refreshButton = document.getElementById("refresh-button");
        if (refreshButton) {
            refreshButton.addEventListener("click", () => {
                this.handleRefresh();
            });
        }

        const plusEmoji = document.getElementById("plus-emoji");
        if (plusEmoji) {
            plusEmoji.addEventListener("click", () => {
                this.handlePlusClick();
            });
        }	
    }

    async handleRefresh() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) {
            const userInput = view.editor.getValue();
            const therapyType = (document.getElementById("therapy-type-dropdown") as HTMLSelectElement).value;
            const insightFilter = (document.getElementById("insight-filter-dropdown") as HTMLSelectElement).value;
            const length = (document.getElementById("length-dropdown") as HTMLSelectElement).value;
            const noteRange = (document.getElementById("note-range-dropdown") as HTMLSelectElement).value;
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
		console.log('click');
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
	}

	async handleHeartClick() {
		const resultDiv = document.getElementById("result");
		if (!resultDiv) return;

		const advice = resultDiv.innerText;
		if (!advice) return;

		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const currentNoteFile = view.file;
		const currentNoteDate = currentNoteFile?.basename; // Assuming the filename is the date

		const feedbackFile = this.app.vault.getAbstractFileByPath("ai-feedback.md") as TFile;

		if (feedbackFile) {
			console.log("🚀 ~ MyPlugin ~ handleHeartClick ~ feedbackFile:", feedbackFile);
			// Update existing feedback note
			const content = await this.app.vault.read(feedbackFile);
			const updatedContent = `### ${currentNoteDate}\n${advice}\n\n${content}`;
			await this.app.vault.modify(feedbackFile, updatedContent);
		} else {
			console.log('no feedback file');
			// Create new feedback note
			const newContent = `### ${currentNoteDate}\n${advice}`;
			await this.app.vault.create("ai-feedback.md", newContent);
		}
	}

    generatePrompt(therapyType: string, insightFilter: string, length: string): string {
        return `You are the world's top therapist, trained in ${therapyType}. Your only job is to ${insightFilter}. Your responses must always be ${length}. Don't include any formatting or bullet points.`;
    }

	async fetchAndDisplayResult(prompt: string, userInput: string, resultElementId: string, noteRange: string) {
		try {
			let notesContent = userInput;
			if (noteRange !== "current") {
				const notes = await this.getRecentNotes(noteRange);
				notesContent = notes.join("\n\n");
			}

			const response = await fetch(
				"https://api.openai.com/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${this.apiKey}`,

					},
					body: JSON.stringify({
						model: "gpt-4o",
						messages: [
							{ role: "system", content: prompt },
							{ role: "user", content: notesContent },
						],
					}),
				}
			);

			const data = await response.json();
			const resultDiv = document.getElementById(resultElementId);
			const heartEmoji = document.getElementById("heart-emoji");
			const plusEmoji = document.getElementById("plus-emoji");

			if (heartEmoji) {
				heartEmoji.addEventListener("click", () => {
					this.handleHeartClick();
				});
			}

			if (resultDiv) {
				resultDiv.innerText = data.choices[0].message.content;
				if (heartEmoji && plusEmoji) {
					heartEmoji.style.display = "block";
					plusEmoji.style.display = "block"; // Ensure plus emoji is displayed
				}
			}
		} catch (error) {
			const resultDiv = document.getElementById(resultElementId);
			const heartEmoji = document.getElementById("heart-emoji");
			const plusEmoji = document.getElementById("plus-emoji");

			if (resultDiv) {
				resultDiv.innerText = "Error: " + (error as Error).message;
				if (heartEmoji && plusEmoji) {
					heartEmoji.style.display = "none";
					plusEmoji.style.display = "none"; // Ensure plus emoji is hidden on error
				}
			}
		}
	}


	async getRecentNotes(range: string): Promise<string[]> {
		const files = this.app.vault.getMarkdownFiles();

		// Filter files to only include daily notes (assuming they follow the pattern YYYY-MM-DD.md)
		const dailyNotes = files.filter(file => /\d{4}-\d{2}-\d{2}\.md$/.test(file.path));

		// Sort files by date in descending order
		const sortedFiles = dailyNotes.sort((a, b) => b.path.localeCompare(a.path));

		// Get the currently active note's date
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return [];
		const currentNoteFile = view.file;
		const currentNoteDate = currentNoteFile?.basename;

		// Find the index of the current note
		const currentIndex = sortedFiles.findIndex(file => file.basename === currentNoteDate);
		if (currentIndex === -1) return [];

		// Determine the number of notes to fetch
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
			limit = 1; // Default to 1 if the range is "current" or any other value
		}

		// Get the notes before the current note
		const recentFiles = sortedFiles.slice(currentIndex + 1, currentIndex + 1 + limit);
		console.log("🚀 ~ MyPlugin ~ getRecentNotes ~ recentFiles:", recentFiles)

		// Read the content of the recent files
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