import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

function getRepoStructureWithGitignore(folderPath: string): string[] {
  const gitignoreFile = path.join(folderPath, ".gitignore");
  const structure: string[] = [];

  // Define the exclusion list
  const exclusions = [".git", ".idea", "__pycache__"];

  let gitignorePatterns: string[] = [];
  if (fs.existsSync(gitignoreFile)) {
    const gitignoreContent = fs.readFileSync(gitignoreFile, "utf-8");
    gitignorePatterns = gitignoreContent
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));
  }

  const walkDirectory = (dir: string, prefix = "") => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name);
      const relativePath = path.relative(folderPath, entryPath);

      // Skip exclusions and `.gitignore` patterns
      if (exclusions.includes(entry.name)) return;
      if (gitignorePatterns.some((pattern) => relativePath.includes(pattern)))
        return;

      if (entry.isDirectory()) {
        structure.push(`${prefix}${entry.name}/`);
        walkDirectory(entryPath, prefix + "    ");
      } else {
        structure.push(`${prefix}${entry.name}`);
      }
    });
  };

  walkDirectory(folderPath);
  return structure;
}

function getRepoCodeContent(folderPath: string): string {
  const includeFilesToPrint = ["requirements.txt", "*.py", "dockerfile"];
  const codeSection: string[] = [];

  const matchesIncludePattern = (fileName: string) => {
    return includeFilesToPrint.some((pattern) => {
      if (
        pattern.startsWith("*.") &&
        fileName.toLowerCase().endsWith(pattern.slice(1).toLowerCase())
      ) {
        return true;
      }
      return fileName.toLowerCase() === pattern.toLowerCase();
    });
  };

  const walkDirectoryForCode = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name);
      const relativePath = path.relative(folderPath, entryPath);

      if (entry.isDirectory()) {
        walkDirectoryForCode(entryPath);
      } else if (matchesIncludePattern(entry.name)) {
        try {
          const content = fs.readFileSync(entryPath, "utf-8");
          codeSection.push(`### ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n`);
        } catch (err) {
          console.error(`Failed to read file ${entryPath}:`, err);
        }
      }
    });
  };

  walkDirectoryForCode(folderPath);
  return codeSection.join("\n");
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "repotollm.repoToLLM",
    async () => {
      const chatBackFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (!chatBackFolder) {
        vscode.window.showErrorMessage(
          "No folder is opened. Please open a folder."
        );
        return;
      }

      // Automatically get the repo name from the folder
      const repoName = path.basename(chatBackFolder);

      const repoStructure = getRepoStructureWithGitignore(chatBackFolder);
      const repoCode = getRepoCodeContent(chatBackFolder);

      const docContent = `# ${repoName} Repository\n\n## Repo Structure\n\`\`\`\n${repoStructure.join(
        "\n"
      )}\n\`\`\`\n\n## Repo Code\n\n${repoCode}`;

      const docPath = path.join(chatBackFolder, "REPO_TO_LLM.md");
      fs.writeFileSync(docPath, docContent, "utf-8");

      vscode.window.showInformationMessage(`Documentation created: ${docPath}`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
