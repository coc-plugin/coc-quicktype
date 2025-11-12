import { window } from 'coc.nvim';

const log = window.createOutputChannel('quicktype');

export function logInfo(message: string) {
  const date = new Date();
  log.appendLine(`${date.toLocaleString()} [INFO] ${message}`);
}

export function logError(message: string) {
  const date = new Date();
  log.appendLine(`${date.toLocaleString()} [ERROR] ${message}`);
}

export function logWarn(message: string) {
  const date = new Date();
  log.appendLine(`${date.toLocaleString()} [WARN] ${message}`);
}

export function logDebug(message: string) {
  const date = new Date();
  log.appendLine(`${date.toLocaleString()} [DEBUG] ${message}`);
}
