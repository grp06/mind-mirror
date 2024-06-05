import MyPlugin from './main'; // Adjust the path if necessary
import MindMirrorSettingTab from './MindMirrorSettingTab';
export function createUIElements(plugin: MyPlugin) { // Specify the type of plugin
    const link = document.createElement("link");
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

    // Add the gear icon
    // const gearIcon = therapyLabelWrapper.createEl("i", { cls: "material-icons gear-icon", text: "settings" });
    // gearIcon.style.color = "white";
    // gearIcon.style.cursor = "pointer";
    // gearIcon.style.paddingLeft = "10px"; // Adjust padding as needed

    // // Add event listener to open plugin settings
    // gearIcon.addEventListener("click", () => {
    //     plugin.settingsTab.display();
    // });

    const therapyDropdown = dropdownContainer.createEl("select");
    therapyDropdown.setAttr("id", "therapy-type-dropdown");
    ["cbt", "sfbt", "gestalt", "dbt", "mbct", "psychodynamic", "humanistic", "existential", "ipt", "family-systems"].forEach(type => {
        therapyDropdown.createEl("option", { value: type, text: type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Therapy" });
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