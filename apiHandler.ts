export async function fetchAndDisplayResult(plugin: any, { prompt, userInput, resultElementId, noteRange }: { prompt: string, userInput: string, resultElementId: string, noteRange: string }) {
    try {
        let notesContent = userInput;
        if (noteRange !== "current") {
            const notes = await plugin.getRecentNotes(noteRange);
            notesContent = notes.join("\n\n");
        }

        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${plugin.settings.apiKey}`, // Use stored API key
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

export async function fetchMemories(plugin: any, userInput: string, aiMemories: string): Promise<string> {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${plugin.settings.apiKey}`, // Use stored API key
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "system", content: "You are an LLM optimized to detect important memories. Your job is to parse the user's past memroies and current journal entry for the most important life events to remember. The memories should be facts about the user or things that they experienced. Only come up 1-3 bullet points. Do not duplicate memories from the current note if they're already stored. Only IMPORTANT memories. Write them concisely. Don't include any formatting, just markdown bullet points. Just return the bullet points. Ignore the emotions they list at the top if a bulleted list of emotions is present. If there are no important memories, just return an empty string." },
                        { role: "user", content: `${userInput}\n\n${aiMemories}` },
                    ],
                }),
            }
        );

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error fetching memories:", error);
        return "";
    }
}