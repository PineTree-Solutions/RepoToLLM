import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

function getRepoStructureWithGitignore(folderPath: string): string {
  const gitignoreFile = path.join(folderPath, ".gitignore");
  const structure: string[] = [];

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

      // Skip .gitignore patterns
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
  return structure.join("\n");
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

      const repoStructure = getRepoStructureWithGitignore(chatBackFolder);
      const docContent = `# Chat Back Repository\n\n## Repo Structure\n\`\`\`\n${repoStructure}\n\`\`\`\n\n`;

      const docPath = path.join(chatBackFolder, "REPO_TO_LLM.md");
      fs.writeFileSync(docPath, docContent, "utf-8");

      vscode.window.showInformationMessage(`Documentation created: ${docPath}`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
