
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext)
{
    const runCommand = vscode.commands.registerCommand(
        "cyva.runCurrentFile",
        async () =>
        {
            const editor = vscode.window.activeTextEditor;

            if (!editor || editor.document.languageId !== "cyva")
            {
                vscode.window.showWarningMessage("Please open a Cyva file first.");
                return;
            }

            const document = editor.document;
            const filePath = document.uri.fsPath;

            if (document.isDirty)
            {
                const saved = await document.save();

                if (!saved)
                {
                    vscode.window.showErrorMessage("Could not save the Cyva file.");
                    return;
                }
            }

            const terminal = vscode.window.createTerminal({ name: "Cyva", cwd: vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath });

            terminal.show();

            terminal.sendText(`cyva run "${filePath}"`);
        }
    );

    context.subscriptions.push(runCommand);
}

export function deactivate()
{
    
}
