import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// --------------------------------------------------------------------------------
// Helper: Recursively build a repo structure, skipping certain files and directories
// --------------------------------------------------------------------------------
function getRepoStructureWithGitignore(folderPath: string): string[] {
  // We'll skip these explicitly even if they're not in .gitignore
  // (Added 'venv' to avoid including virtual env files)
  const exclusions = [
    ".git",
    ".idea",
    "__pycache__",
    "node_modules",
    ".code",
    "venv",
  ];

  // Build an array of patterns from .gitignore (if it exists)
  const gitignoreFile = path.join(folderPath, ".gitignore");
  let gitignorePatterns: string[] = [];
  if (fs.existsSync(gitignoreFile)) {
    const gitignoreContent = fs.readFileSync(gitignoreFile, "utf-8");
    gitignorePatterns = gitignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  }

  const structure: string[] = [];

  // Recursive directory walk
  const walkDirectory = (dir: string, prefix = "") => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files/folders that start with "."
      if (entry.name.startsWith(".")) {
        continue;
      }

      // Skip explicitly named exclusions
      if (exclusions.includes(entry.name)) {
        continue;
      }

      const entryPath = path.join(dir, entry.name);
      const relativePath = path.relative(folderPath, entryPath);

      // Skip .gitignore patterns (simple "contains" check in the relative path)
      if (gitignorePatterns.some((pattern) => relativePath.includes(pattern))) {
        continue;
      }

      if (entry.isDirectory()) {
        structure.push(`${prefix}${entry.name}/`);
        walkDirectory(entryPath, prefix + "    ");
      } else {
        structure.push(`${prefix}${entry.name}`);
      }
    }
  };

  walkDirectory(folderPath);
  return structure;
}

// --------------------------------------------------------------------------------
// Helper: Collect file contents for specified files (Python, JS, TS, HTML, CSS, etc.)
// --------------------------------------------------------------------------------
function getRepoCodeContent(folderPath: string): string {
  // Which file patterns should we include for code output
  const includeFilesToPrint = [
    "requirements.txt",
    "dockerfile", // matches "Dockerfile" as well (case-insensitive exact match)
    "*.py",
    "*.js",
    "*.jsx",
    "*.ts",
    "*.tsx",
    "*.html",
    "*.css",
  ];

  // We'll skip these explicitly (same as above, including 'venv')
  const exclusions = [
    ".git",
    ".idea",
    "__pycache__",
    "node_modules",
    ".code",
    "venv",
  ];

  // Determine whether a file name matches any of our patterns
  const matchesIncludePattern = (fileName: string): boolean => {
    return includeFilesToPrint.some((pattern) => {
      // If it's a wildcard pattern, like "*.py", check the extension
      if (pattern.startsWith("*.")) {
        // e.g., "*.py" -> ".py"
        const ext = pattern.slice(1).toLowerCase();
        return fileName.toLowerCase().endsWith(ext);
      }
      // Otherwise do a direct (case-insensitive) comparison
      return fileName.toLowerCase() === pattern.toLowerCase();
    });
  };

  const codeSection: string[] = [];

  // Recursive directory walk to gather code content
  const walkDirectoryForCode = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files/folders that start with "."
      if (entry.name.startsWith(".")) {
        continue;
      }

      // Skip explicitly named exclusions
      if (exclusions.includes(entry.name)) {
        continue;
      }

      const entryPath = path.join(dir, entry.name);
      const relativePath = path.relative(folderPath, entryPath);

      if (entry.isDirectory()) {
        // Descend into subdirectories
        walkDirectoryForCode(entryPath);
      } else if (matchesIncludePattern(entry.name)) {
        // If the file matches our "include" patterns, read and store its content
        try {
          const content = fs.readFileSync(entryPath, "utf-8");
          codeSection.push(`### ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n`);
        } catch (err) {
          console.error(`Failed to read file ${entryPath}:`, err);
        }
      }
    }
  };

  walkDirectoryForCode(folderPath);
  return codeSection.join("\n");
}

// --------------------------------------------------------------------------------
// Main extension activation
// --------------------------------------------------------------------------------
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "repotollm.repoToLLM",
    async () => {
      // Get the currently opened workspace folder
      const workspaceFolder =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (!workspaceFolder) {
        vscode.window.showErrorMessage(
          "No folder is opened. Please open a folder."
        );
        return;
      }

      // The repo name is derived from the folder name
      const repoName = path.basename(workspaceFolder);

      // Grab the structure and code snippets
      const repoStructure = getRepoStructureWithGitignore(workspaceFolder);
      const repoCode = getRepoCodeContent(workspaceFolder);

      // Prepare markdown content
      const docContent = `# ${repoName} Repository

## Repo Structure
\`\`\`
${repoStructure.join("\n")}
\`\`\`

## Repo Code

${repoCode}
`;

      // Write out to REPO_TO_LLM.md in the root folder
      const docPath = path.join(workspaceFolder, "REPO_TO_LLM.md");
      fs.writeFileSync(docPath, docContent, "utf-8");

      // Show a completion message
      vscode.window.showInformationMessage(`Documentation created: ${docPath}`);
    }
  );

  context.subscriptions.push(disposable);
}

// --------------------------------------------------------------------------------
// Deactivate (no-op for this extension)
// --------------------------------------------------------------------------------
export function deactivate() {}
