import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import { updateTextDecoration } from './textDecoration'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  /**
   * 更新当前文本装饰
   */
  window.onDidChangeActiveTextEditor(updateTextDecoration)
}

export function deactivate() { }
