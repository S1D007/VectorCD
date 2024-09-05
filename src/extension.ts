import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vectorcd" is now active!');

	const disposable = vscode.commands.registerCommand('vectorcd.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vectorcd!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
