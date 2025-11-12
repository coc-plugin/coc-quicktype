import { commands, ExtensionContext, nvim, TextEdit, TextEditor, window } from 'coc.nvim';
import { QuicktypeGenerator } from './core';
import { logError } from './log';
export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    commands.registerCommand('quicktype.generate', async () => {
      const t = await nvim.exec(`echo getreg('"')`, true);
      if (!isJson(t)) {
        logError('Please copy the JSON source to be processed');
        window.showErrorMessage('Please copy the JSON source to be processed');
        return;
      }
      const editor = window.activeTextEditor;
      if (editor) {
        const language = editor.document.languageId;
        let advanced = true;
        if (
          !QuicktypeGenerator.isAdvanced(language as keyof typeof QuicktypeGenerator.languageMap)
        ) {
          advanced = false;
        }
        const typeName = await getTypeName();
        if (typeName) {
          const lastTextEditors = window.visibleTextEditors[window.visibleTextEditors.length - 1];
          const textType = await QuicktypeGenerator.generate(
            t,
            typeName,
            language as keyof typeof QuicktypeGenerator.languageMap,
            advanced
          ).catch((r) => {
            logError((r as Error).message);
          });
          if (lastTextEditors && textType) {
            await insert(lastTextEditors, textType);
          }
        }
      }
    })
  );
}

function getTypeName(): Promise<string | null> {
  return new Promise(async (resolve, _) => {
    const box = await window.createInputBox('name');
    box.onDidFinish(async (name) => {
      if (!name) {
        resolve('outPut');
      }
      resolve(name);
    });
  });
}

async function insert(editor: TextEditor, text: string) {
  let range = await window.getCursorPosition();
  if (editor) {
    await editor.document.applyEdits([TextEdit.insert(range, text)]);
  }
}

function isJson(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
