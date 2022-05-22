import type { ExtensionContext } from 'vscode'
import { window } from 'vscode'
import customTextDecoration from './decoration'
import intl from './intl'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')

  /**
   * @todo：
   *    1、packages umi 检查
   *    2、locales 文件引用读取
   *    3、locales 文件监听
   *    4、当前文本编辑更新
   *    5、多语言 hover 列表
   */

  /** test readFile */
  console.warn('xxx#intl', intl.config)
  window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
  window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
}

export function deactivate() { }
