import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import UmiIntl from './core/umiIntl'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  UmiIntl.init()
}

export function deactivate() { }
