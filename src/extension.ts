import * as vscode from "vscode";

export let myStatusBarItem: vscode.StatusBarItem;

function getFileSize(editor: vscode.TextEditor | undefined) {
  const fileContent = editor?.document.getText().length;
  return fileContent?.toString() || "0";
}

function updateSize() {
  const newSize = getFileSize(vscode.window.activeTextEditor);
  myStatusBarItem.text = formatBytes(parseInt(newSize, 10));
  myStatusBarItem.show();
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function activate({ subscriptions }: vscode.ExtensionContext) {
  myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  updateSize();
  subscriptions.push(myStatusBarItem);
  subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateSize));
  subscriptions.push(vscode.workspace.onDidChangeTextDocument(updateSize));

  subscriptions.push(
    vscode.commands.registerCommand("file-size.show", updateSize)
  );

  subscriptions.push(
    vscode.commands.registerCommand("file-size.hide", () => {
      myStatusBarItem.hide();
    })
  );
}
