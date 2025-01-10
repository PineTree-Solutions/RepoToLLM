# RepoToLLM (Export Repo To Markdown)

Export your repository to a single, well-structured Markdown file. Once generated, you can easily copy and paste the file into LLMs like ChatGPT, Claude, Gemini, or any other AI tool to enhance your productivity and streamline your development process.

The generated Markdown file includes:

- A detailed overview of your project’s folder structure.
- A list of files with their respective paths.
- Complete code content for each supported file type.

---

## Usage

1. Open your project in VS Code.
2. Run the command `Export All to Markdown` from the command palette to export the entire project.
3. Alternatively, right-click on a specific folder or file and select `Export Selected to Markdown` to export only selected files.
4. Choose where to save the generated Markdown file when prompted.
5. Copy and paste the content from the generated file into your preferred LLM tool (ChatGPT, Claude, Gemini, etc.) to get insights, fix bugs, or collaborate with your team.

---

## Benefits

- **Copy and Paste Friendly**: The generated Markdown file can be directly copied and pasted into LLMs to enhance workflows.
- **Optimized for AI**: Markdown formatting ensures that LLMs can parse and understand your repository effectively.
- **Provide Context When Developing With AI**: Use the generated Markdown file to give AI tools better context when working on your project.
- **Streamlined Workflow**: Convert your codebase into an LLM-friendly format to speed up development.
- **Code to GPT**: Quickly prepare your code and repository structure for GPT-based models to improve productivity.

---

## Features

### Export Repository Structure

- Automatically generates the directory structure of your repository.
- Skips unnecessary files and folders based on `.gitignore` and common exclusions.

### Generate Markdown Documentation

- Creates a detailed Markdown file with:
  - **Folder Structure**: A clear, hierarchical view of your project’s structure.
  - **Code Content**: Code snippets formatted in Markdown for better readability by LLMs.
  - **File Types**: Only exports supported file types to ensure optimal output.

### Enhance Development with AI

- The Markdown file is optimized for use with LLMs, allowing faster responses and better insights.
- Use the file to:
  - Get quick insights into your repository.
  - Accelerate development cycles.
  - Fix bugs faster.
  - Share project details with your team efficiently.

---

## Supported File Types

The extension exports code content for the following file types:

- `.js`, `.jsx`, `.ts`, `.tsx`
- `.html`, `.css`, `.scss`
- `.json`, `.md`, `.txt`
- `.py`, `.java`, `.c`, `.cpp`
- `.cs`, `.rb`, `.go`, `.php`
- `.sh`, `.xml`, `.yaml`, `.yml`
- `.ini`, `.bat`, `.sql`, `.rs`
- `.swift`, `.kt`, `.dart`, `.lua`
- `.r`, `.pl`, `.hs`, `.erl`, `.ex`, `.el`, `.jl`, `.scala`

Unsupported file types will be marked as such in the generated Markdown file.

---

## Installation

Install the extension from the VS Code Marketplace:

- Search for `RepoToLLM`.
- Click `Install` to add the extension to your VS Code environment.

---

## Commands

| Command                       | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `Export All to Markdown`      | Export the entire repository to a Markdown file.     |
| `Export Selected to Markdown` | Export selected files or folders to a Markdown file. |

---

## Extension Settings

This extension does not introduce additional settings.

---

## Release Notes

### Version 0.0.6

- Added support for selective export of files and folders.
- Optimized `.gitignore` handling.
- Improved Markdown formatting and file structure generation.
- Added file type filtering for large files and unsupported formats.

---

## Contributing

We welcome contributions! If you encounter issues or have feature requests, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions, feedback, or support, please reach out via the [GitHub repository](https://github.com/PineTree-Solutions/RepoToLLM).

**Enjoy using RepoToLLM to bridge the gap between your codebase and any LLM provider!**
