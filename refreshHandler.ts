import { MarkdownView } from 'obsidian';
import MindMirror from './main';

export async function handleRefresh(plugin: MindMirror) {
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
        const userInput = view.editor.getValue();
        const therapyType = (document.getElementById("therapy-type-dropdown") as HTMLSelectElement).value;
        const insightFilter = (document.getElementById("insight-filter-dropdown") as HTMLSelectElement).value;
        const length = plugin.settings.length; // Use the length from settings
        const noteRange = plugin.settings.noteRange; // Use the note range from settings

        const userFeelings = plugin.extractFeelings(userInput);
        const prompt = plugin.generatePrompt(therapyType, insightFilter, length, userFeelings);
        console.log("🚀 ~ MindMirror ~ handleRefresh ~ prompt:", prompt)

        const resultDiv = document.getElementById("result");
        const popup = document.getElementById("popup");
        if (resultDiv && popup) {
            resultDiv.innerText = "Fetching feedback...";
            popup.style.display = "block"; 
        }

        plugin.fetchAndDisplayResult({ prompt, userInput, resultElementId: "result", noteRange });

        // Fetch and log memories
        const memories = await plugin.fetchMemories(userInput);
        console.log("🚀 ~ MindMirror ~ handleRefresh ~ memories:", memories);
    }
}