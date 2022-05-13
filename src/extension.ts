import { window } from 'vscode'
import type { ExtensionContext } from 'vscode'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')
}

export function deactivate() { }
