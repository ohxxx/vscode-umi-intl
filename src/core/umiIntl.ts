import { window, workspace } from 'vscode'
import { getUserConfig } from '../config'
import customTextDecoration from '../decoration'
import { throttleFn } from '../helpers'
import packageParser from '../parsers/packages'
import intl from './intl'

class UmiIntl {
  static init() {
    if (!getUserConfig().autoDetection)
      return

    if (!packageParser.init())
      return

    if (intl.init()) {
      console.warn('xxx#intl config', intl.config)
      window.onDidChangeActiveTextEditor(throttleFn(() => customTextDecoration.create()))
      window.onDidChangeTextEditorSelection(throttleFn(() => customTextDecoration.watch()))
      workspace.onDidChangeTextDocument(throttleFn(() => customTextDecoration.create()))
    }
  }
}

export default UmiIntl
