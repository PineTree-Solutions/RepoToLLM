# RepoToLLM

A Visual Studio Code extension designed specifically for Python projects to help you export your repository structure and code snippets into a Markdown file that an LLM (Large Language Model) can easily understand. It automates the creation of documentation for your repository, making it easier to integrate your codebase with AI tools like ChatGPT, Claude, Gemini, and more.

---

## Benefits

- **Optimized for AI**: Markdown formatting ensures that LLMs can parse and understand your repository more effectively.
- **Convert Code to LLM-Understandable Text**: Streamline your workflow by transforming your codebase into an LLM-ingestible format.
- **Code to GPT**: Quickly prepare your code and repository structure for tools like GPT-based models, enabling faster AI-driven development.
- **Ingest Code to LLM**: Simplify the process of making your repository accessible to AI tools.
- **Copy and Paste Friendly**: The generated Markdown file can be directly copied and pasted into tools like ChatGPT, Claude, Gemini, or any other LLM to easily develop and enhance workflows.
- **Streamlined Workflow**: Automatically document your project, enhancing productivity and focus.
- **Collaboration Ready**: Share structured, AI-friendly documentation with your team or leverage it as input for AI tools to improve collaboration.
- **Boost Productivity**: A powerful tool to make your development process faster and more efficient.

---

## Features

### Export Repository Structure

- Automatically generates the directory structure of your repository, skipping unnecessary files and folders based on `.gitignore` and common exclusions.

### Generate Markdown Documentation

- Creates a `REPO_TO_LLM.md` file in your repository root with:
  - **Repo Structure**: A clear hierarchical structure of the repository.
  - **Repo Code**: Code snippets formatted in Markdown for easy readability by LLMs.

### Enhance Development with AI

- The generated Markdown file is optimized for use with LLMs, which understand Markdown better, leading to improved context comprehension and faster responses.
- Copy and paste the Markdown file into any LLM tool to:
  - Get quick insights into your repository.
  - Accelerate development workflows.
  - Make project collaboration easier.

---

## Installation

### Install the extension from the VS Code Marketplace (RepoToLLM)

## Usage

1. Open your Python project in VS Code.
2. Run the command `Repo To LLM` from the command palette.
3. The extension generates a `REPO_TO_LLM.md` file in the root of your repository.
4. Use this Markdown file to:
   - Share your repository overview with team members.
   - Analyze your codebase using AI tools.
   - Copy and paste into LLMs like ChatGPT, Claude, or Gemini to enhance development.
   - Develop faster and more efficiently.

---

## Known Issues

- **Large Repositories**: May take longer to process for repositories with a large number of files and directories.
- **Pattern Matching**: `.gitignore` patterns may require refinement for advanced glob patterns.

---

## Extension Settings

This extension does not introduce additional settings.

---

## Release Notes

---

## Contributing

We welcome contributions! If you encounter issues or have feature requests, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions, feedback, or support, please reach out via the [GitHub repository](https://github.com/PineTree-Solutions/RepoToLLM).

**Enjoy using RepoToLLM to bridge the gap between your codebase and AI workflows!**
