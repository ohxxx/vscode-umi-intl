import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import customTextDecoration from './decoration'
import intl from './intl'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  intl.init()
  console.warn('xxx#intl', intl.config)

  window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
  window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
}

export function deactivate() { }
