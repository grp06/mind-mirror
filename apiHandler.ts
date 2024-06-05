import { requestUrl } from 'obsidian';

export async function fetchAndDisplayResult(plugin: any, prompt: string, userInput: string, resultElementId: string, noteRange: string) {
	try {
		let notesContent = userInput;
		if (noteRange !== "current") {
			const notes = await plugin.getRecentNotes(noteRange);
			notesContent = notes.join("\n\n");
		}

		const response = await requestUrl({
			url: "https://api.openai.com/v1/chat/completions",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${plugin.settings.apiKey}`, // Use stored API key
			},
			body: JSON.stringify({
				model: "gpt-4",
				messages: [
					{ role: "system", content: prompt },
					{ role: "user", content: notesContent },
				],
			}),
		});

		const data = response.json;
		
		const resultDiv = document.getElementById(resultElementId);
		
		const heartEmoji = document.getElementById("heart-emoji");
		const plusEmoji = document.getElementById("plus-emoji");

		if (heartEmoji) {
			heartEmoji.addEventListener("click", () => {
				plugin.handleHeartClick();
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