import * as vscode from 'vscode';
import * as path from 'path';
import sound from 'sound-play';

let lastErrorCount = 0;
let lastPlayed = 0;
const COOLDOWN = 2000; // 2 sec cooldown

export function activate(context: vscode.ExtensionContext) {

    vscode.languages.onDidChangeDiagnostics(() => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);

        const errorCount = diagnostics.filter(
            d => d.severity === vscode.DiagnosticSeverity.Error
        ).length;

        const now = Date.now();

        // 🔴 If errors exist → play faah (even same error)
        if (errorCount > 0 && now - lastPlayed > COOLDOWN) {
            playSound('error.wav', context);
            lastPlayed = now;
        }

        // 🟢 If errors were present and now fixed → relief sound
        if (lastErrorCount > 0 && errorCount === 0) {
            playSound('relief.wav', context);
        }

        lastErrorCount = errorCount;
    });
}

function playSound(fileName: string, context: vscode.ExtensionContext) {

    const soundPath = path.join(
        context.extensionPath,
        'media',
        fileName
    );

    sound.play(soundPath).catch((err: unknown) => {
        console.error("Audio error:", err);
    });
}

export function deactivate() {}