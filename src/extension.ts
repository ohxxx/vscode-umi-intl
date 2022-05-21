import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import customTextDecoration from './decoration'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
  window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
}

export function deactivate() { }
