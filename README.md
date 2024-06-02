# Mind Mirror - Obsidian Plugin

Mind Mirror is a powerful AI journaling tool that provides real-time feedback and insights on your writing. Choose the type of therapy, what type of insights you want, and get AI generations inside of Obisidan to help you dive deeper.

## Getting Started

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd mind-mirror
   ```

2. **Configure API Key:**
   - Rename `config.example.json` to `config.json`
   - Add your OpenAI API key in `config.json`:
    ```json
    {
    "apiKey": "YOUR_OPENAI_API_KEY"
    }
     ```

3. **Build and Run:**
   ```bash
   npm install
   npm run build
   npm run dev
   ```

### Usage

1. **Load the Plugin:**
   - Open Obsidian.
   - Go to `Settings` > `Community Plugins` > `Install Plugin`.
   - Locate and enable `Mind Mirror`.

2. **Configure the Plugin:**
   - In Obsidian, navigate to the Mind Mirror settings to customize your experience.

3. **Use the Plugin:**
   - Select your preferred type of therapy, insight filter, and legnth from the dropdown menus.
   - Press the `Refresh` button to get feedback and insights on your journal entry.
   - If you press the heart button, it will add the current LLM response to a note called AI Feedback.
   - If you press the "+" button, it will append the LLM response to the bottom of the current note.


### Example Configuration

```json
{
  "apiKey": "YOUR_OPENAI_API_KEY"
}
```

### Additional Information

- Ensure you have the latest version of Obsidian installed.