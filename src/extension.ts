import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { getUserConfig } from './config'
import customTextDecoration from './decoration'
import intl from './intl'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  if (!getUserConfig().autoDetection)
    return

  if (intl.init()) {
    console.warn('xxx#intl config', intl.config)
    window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
    window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
  }
}

export function deactivate() { }
