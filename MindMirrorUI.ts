import { feelingCategories } from './feelings';
import MyPlugin from './main'; // Adjust the path if necessary

export function createUIElements(plugin: MyPlugin) { // Specify the type of plugin
    const link = document.createElement("link");
    function getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
        "Happy": "#b48484",
        "Sad": "#CE7C87",
        "Disgusted": "#AB7BB4",
        "Angry": "#7572B3",
        "Fearful": "#00A3B9",
        "Bad": "#35B99F",
        "Surprised": "#E4A44B"
    };
        return colors[category] || "#FFFFFF";
    }

    function getCategoryColorWithOpacity(category: string, opacity: number): string {
        const hexColor = getCategoryColor(category);
        const rgb = hexColor.match(/\w\w/g)?.map(x => parseInt(x, 16));
        if (rgb) {
            return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
        }
        return `rgba(255, 255, 255, ${opacity})`;
    }
      
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.head.appendChild(link);

    const container = document.createElement("div");
    container.id = "plugin-container";
    document.body.appendChild(container);

    const dropdownContainer = container.createEl("div");
    dropdownContainer.setAttr("id", "dropdown-container");

    // Create a wrapper for the label and gear icon
    const therapyLabelWrapper = dropdownContainer.createEl("div", { cls: "therapy-label-wrapper" });
    therapyLabelWrapper.createEl("label", { attr: { for: "therapy-type-dropdown" }, text: "Type of Therapy" });

    const categoryBar = document.createElement("div");
    categoryBar.id = "category-bar";
    document.body.appendChild(categoryBar);

    feelingCategories.forEach(category => {
        const categoryButton = document.createElement("button");
        categoryButton.className = "category-button";
        categoryButton.innerText = category.level0;
        categoryButton.style.backgroundColor = getCategoryColor(category.level0); // Function to get color
        categoryButton.addEventListener("click", () => {
            toggleCategoryPane(category.level0);
        });
        categoryBar.appendChild(categoryButton);
    });

    // Create the secondary pane for detailed feelings
    const secondaryPane = document.createElement("div");
    secondaryPane.id = "secondary-pane";
    document.body.appendChild(secondaryPane);

    function hideSecondaryPane() {
        const pane = document.getElementById("secondary-pane");
        if (pane) {
            pane.style.display = "none";
        }
    }

    // Add event listener to document to detect clicks outside the category bar and secondary pane
    document.addEventListener("click", (event) => {
        const categoryBar = document.getElementById("category-bar");
        const secondaryPane = document.getElementById("secondary-pane");

        if (categoryBar && secondaryPane) {
            if (!categoryBar.contains(event.target as Node) && !secondaryPane.contains(event.target as Node)) {
                hideSecondaryPane();
            }
        }
    });

    function getCurrentTime(): string {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutesStr}${ampm}`;
    }

    function toggleCategoryPane(category: string) {
        const pane = document.getElementById("secondary-pane");
        if (!pane) return;

        if (pane.getAttribute("data-category") === category) {
            pane.style.display = pane.style.display === "block" ? "none" : "block";
            return;
        }

        pane.innerHTML = "";

        const selectedCategory = feelingCategories.find(cat => cat.level0 === category);
        if (selectedCategory) {
            selectedCategory.level1.forEach(feeling => {
                const feelingButton = document.createElement("button");
                feelingButton.className = "feeling-button";
                feelingButton.innerText = feeling;
                feelingButton.style.backgroundColor = getCategoryColor(category);
                feelingButton.addEventListener("click", () => {
                    const formattedString = `${feeling} - ${getCurrentTime()}`;
                    plugin.handleFeelingClick(formattedString); // Pass the formatted string
                    hideSecondaryPane(); // Close the menu
                });
                pane.appendChild(feelingButton);
            });

            selectedCategory.level2.forEach(feeling => {
                const feelingButton = document.createElement("button");
                feelingButton.className = "feeling-button";
                feelingButton.innerText = feeling;
                feelingButton.style.backgroundColor = getCategoryColorWithOpacity(category, 0.7);
                feelingButton.addEventListener("click", () => {
                    const formattedString = `${feeling} - ${getCurrentTime()}`;
                    plugin.handleFeelingClick(formattedString); // Pass the formatted string
                    hideSecondaryPane(); // Close the menu
                });
                pane.appendChild(feelingButton);
            });
        }

        pane.setAttribute("data-category", category);
        pane.style.display = "block";
    }


    const therapyDropdown = dropdownContainer.createEl("select");
    therapyDropdown.setAttr("id", "therapy-type-dropdown");
    [
        { value: "cbt", text: "Cognitive Behavioral Therapy" },
        { value: "sfbt", text: "Solution-Focused Brief Therapy" },
        { value: "gestalt", text: "Gestalt Therapy" },
        { value: "dbt", text: "Dialectical Behavior Therapy" },
        { value: "mbct", text: "Mindfulness-Based Cognitive Therapy" },
        { value: "psychodynamic", text: "Psychodynamic Therapy" },
        { value: "humanistic", text: "Humanistic Therapy" },
        { value: "existential", text: "Existential Therapy" },
        { value: "ipt", text: "Interpersonal Therapy" },
        { value: "family-systems", text: "Family Systems Therapy" }
    ].forEach(type => {
        therapyDropdown.createEl("option", { value: type.value, text: type.text });
    });

    dropdownContainer.createEl("label", { attr: { for: "insight-filter-dropdown" }, text: "Insight Filter" });
    const insightDropdown = dropdownContainer.createEl("select");
    insightDropdown.setAttr("id", "insight-filter-dropdown");
    ["find-blindspots", "give-feedback", "challenge-assumptions", "identify-patterns", "give-journaling-prompt", "detect-sentiment", "detect-underlying-emotions", "generate-insights", "narrative-reframing", "action-planning"].forEach(filter => {
        insightDropdown.createEl("option", { value: filter, text: filter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) });
    });

    // Add a new element to display the settings
    const settingsDisplay = dropdownContainer.createEl("div", { cls: "settings-display" });
    settingsDisplay.setAttr("id", "settings-display");
    settingsDisplay.setText(`Length: ${plugin.settings.length}\nNote range: ${plugin.settings.noteRange}`);

    const refreshButton = dropdownContainer.createEl("button", { text: "Refresh" });
    refreshButton.setAttr("id", "refresh-button");

    const popup = container.createEl("div", { cls: "popup", attr: { style: "display: none;" } });
    popup.setAttr("id", "popup");
    const closeButton = popup.createEl("button", { cls: "close-button", text: "×" });
    closeButton.setAttr("id", "close-button");
    const resultDiv = popup.createEl("div");
    resultDiv.setAttr("id", "result");
    const buttonsContainer = popup.createEl("div", { cls: "buttons-container" });
    const heartEmoji = buttonsContainer.createEl("div", { attr: { style: "display: none;" } });
    heartEmoji.setAttr("id", "heart-emoji");
    heartEmoji.createEl("i", { cls: "material-icons", text: "favorite" });
    const plusEmoji = buttonsContainer.createEl("div");
    plusEmoji.setAttr("id", "plus-emoji");
    plusEmoji.createEl("i", { cls: "material-icons", text: "add" });
    console.log("Container appended to body");

    const closeButtonElement = document.getElementById("close-button");
    if (closeButtonElement) {
        closeButtonElement.addEventListener("click", () => {
            const popup = document.getElementById("popup");
            if (popup) {
                popup.style.display = "none";
            }
        });
    }
    const refreshButtonElement = document.getElementById("refresh-button");
    if (refreshButtonElement) {
        refreshButtonElement.addEventListener("click", () => {
            console.log("Refresh button clicked"); // Debugging line
            plugin.handleRefresh();
        });
    }
    const plusEmojiElement = document.getElementById("plus-emoji");
    if (plusEmojiElement) {
        plusEmojiElement.addEventListener("click", () => {
            plugin.handlePlusClick();
        });
    }
}