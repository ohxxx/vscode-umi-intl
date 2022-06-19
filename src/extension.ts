import type { ExtensionContext } from 'vscode'
import UmiIntl from './core/umiIntl'

export function activate(_: ExtensionContext) {
  UmiIntl.init()
}

export function deactivate() { }
