import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import customTextDecoration from './decoration'
import intl from './file/intl'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  /** test readFile */
  console.warn('xxx#intl', intl)

  window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
  window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
}

export function deactivate() { }
