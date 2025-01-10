import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import ignore, { Ignore } from "ignore";

export function activate(context: vscode.ExtensionContext) {
  const exportAllCommand = vscode.commands.registerCommand(
    "repotollm.exportAll",
    handleExportAllCommand
  );
  const exportSelectedCommand = vscode.commands.registerCommand(
    "repotollm.exportSelected",
    handleExportSelectedCommand
  );

  context.subscriptions.push(exportAllCommand);
  context.subscriptions.push(exportSelectedCommand);
}

async function handleExportAllCommand() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder is currently open.");
    return;
  }

  const rootFolderPath = workspaceFolders[0].uri.fsPath;
  const allFiles = await fetchAllFiles(rootFolderPath);
  const markdownContent = await generateMarkdownContent(
    allFiles,
    rootFolderPath
  );
  saveMarkdownToFile(markdownContent);
}

async function handleExportSelectedCommand(
  uri: vscode.Uri,
  selectedUris: vscode.Uri[]
) {
  const urisToExport =
    selectedUris && selectedUris.length > 0 ? selectedUris : [uri];
  const selectedFiles = await fetchFilesFromUris(urisToExport);

  if (selectedFiles.length === 0) {
    vscode.window.showErrorMessage("No files selected for export.");
    return;
  }

  const rootFolderPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const markdownContent = await generateMarkdownContent(
    selectedFiles,
    rootFolderPath
  );
  saveMarkdownToFile(markdownContent);
}

async function fetchAllFiles(directoryPath: string): Promise<string[]> {
  const ignoreInstance = createIgnoreInstance(directoryPath);
  const allFiles: string[] = [];

  async function traverseDirectory(currentPath: string) {
    const directoryEntries = await fs.promises.readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of directoryEntries) {
      const entryFullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(directoryPath, entryFullPath);

      if (ignoreInstance.ignores(relativePath) || isFileLarge(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (!ignoreInstance.ignores(relativePath + "/")) {
          await traverseDirectory(entryFullPath);
        }
      } else {
        allFiles.push(entryFullPath);
      }
    }
  }

  await traverseDirectory(directoryPath);
  return allFiles;
}

async function fetchFilesFromUris(uris: vscode.Uri[]): Promise<string[]> {
  const filesToExport: string[] = [];
  const rootFolderPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const ignoreInstance = createIgnoreInstance(rootFolderPath);

  async function processUri(fileUri: vscode.Uri) {
    const fileStat = await vscode.workspace.fs.stat(fileUri);
    const relativeFilePath = vscode.workspace.asRelativePath(fileUri);

    if (
      ignoreInstance.ignores(relativeFilePath) ||
      isFileLarge(path.basename(fileUri.fsPath))
    ) {
      return;
    }

    if (fileStat.type === vscode.FileType.Directory) {
      if (!ignoreInstance.ignores(relativeFilePath + "/")) {
        const childEntries = await vscode.workspace.fs.readDirectory(fileUri);
        for (const [childName] of childEntries) {
          const childUri = vscode.Uri.joinPath(fileUri, childName);
          await processUri(childUri);
        }
      }
    } else {
      filesToExport.push(fileUri.fsPath);
    }
  }

  for (const uri of uris) {
    await processUri(uri);
  }

  return filesToExport;
}

function createIgnoreInstance(rootPath: string): Ignore {
  const ignoreInstance = ignore();
  const gitignoreFilePath = path.join(rootPath, ".gitignore");

  if (fs.existsSync(gitignoreFilePath)) {
    const gitignoreContent = fs.readFileSync(gitignoreFilePath, "utf8");
    ignoreInstance.add(gitignoreContent);
  }

  ignoreInstance.add([
    "node_modules/",
    "build/",
    "out/",
    "dist/",
    ".git/",
    ".svn/",
    ".hg/",
    ".vscode/",
    ".idea/",
    "coverage/",
    "logs/",
    "*.log",
    "*.exe",
    "*.dll",
    "*.bin",
    "*.lock",
    "*.zip",
    "*.tar",
    "*.tar.gz",
    "*.tgz",
    "*.jar",
    "*.class",
    "*.pyc",
    "__pycache__/",
    "*.next*",
  ]);

  return ignoreInstance;
}

function isFileLarge(fileName: string): boolean {
  const largeFilesList = ["package-lock.json", "yarn.lock"];
  return largeFilesList.includes(fileName);
}

async function generateMarkdownContent(
  files: string[],
  rootPath: string
): Promise<string> {
  let markdownOutput = `# Project Export\n\n`;

  markdownOutput += `\n## Folder Structure\n\n`;
  markdownOutput += "``\n";
  markdownOutput += generateFolderTree(files, rootPath);
  markdownOutput += "\n``\n";

  for (const file of files) {
    const relativePath = path.relative(rootPath, file);
    const fileName = path.basename(file);

    markdownOutput += `\n### ${relativePath}\n\n`;
    if (isSupportedFileType(fileName)) {
      const fileContent = fs.readFileSync(file, "utf8");
      const fileExtension = path.extname(file).substring(1);
      markdownOutput += "```" + fileExtension + "\n";
      markdownOutput += fileContent;
      markdownOutput += "\n```\n";
    } else {
      markdownOutput += "*(Unsupported file type)*\n";
    }
  }

  return markdownOutput;
}

function generateFolderTree(files: string[], rootPath: string): string {
  const tree: any = {};
  files.forEach((file) => {
    const relativePath = path.relative(rootPath, file);
    const pathParts = relativePath.split(path.sep);
    let currentNode = tree;

    for (const part of pathParts) {
      if (!currentNode[part]) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part];
    }
  });

  function buildTreeStructure(node: any, prefix = ""): string {
    let result = "";
    for (const key in node) {
      result += `${prefix}${key}\n`;
      result += buildTreeStructure(node[key], prefix + "  ");
    }
    return result;
  }

  return buildTreeStructure(tree);
}

function saveMarkdownToFile(content: string) {
  const saveOptions: vscode.SaveDialogOptions = {
    saveLabel: "Save Markdown File",
    filters: { "Markdown Files": ["md"] },
  };

  vscode.window.showSaveDialog(saveOptions).then((fileUri) => {
    if (fileUri) {
      fs.writeFile(fileUri.fsPath, content, (error) => {
        if (error) {
          vscode.window.showErrorMessage("Failed to save the Markdown file.");
        } else {
          vscode.window.showInformationMessage(
            "Markdown file saved successfully."
          );
        }
      });
    }
  });
}

function isSupportedFileType(fileName: string): boolean {
  const supportedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".md",
    ".txt",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".cs",
    ".rb",
    ".go",
    ".php",
    ".sh",
    ".xml",
    ".yaml",
    ".yml",
    ".ini",
    ".bat",
    ".sql",
    ".rs",
    ".swift",
    ".kt",
    ".dart",
    ".lua",
    ".r",
    ".pl",
    ".hs",
    ".erl",
    ".ex",
    ".el",
    ".jl",
    ".scala",
  ];
  return supportedExtensions.includes(path.extname(fileName).toLowerCase());
}

export function deactivate() {}
