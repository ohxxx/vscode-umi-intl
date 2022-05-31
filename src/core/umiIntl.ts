import { window } from 'vscode'
import { getUserConfig } from '../config'
import customTextDecoration from '../decoration'
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
      window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
      window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
    }
  }
}

export default UmiIntl
