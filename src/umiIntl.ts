import { window } from 'vscode'
import { getUserConfig } from './config'
import customTextDecoration from './decoration'
import intlFile from './intlFile'
import packageParser from './parsers/packages'

class UmiIntl {
  static init() {
    if (!getUserConfig().autoDetection)
      return

    if (!packageParser.init())
      return

    if (intlFile.init()) {
      console.warn('xxx#intl config', intlFile.config)
      window.onDidChangeActiveTextEditor(() => customTextDecoration.create())
      window.onDidChangeTextEditorSelection(() => customTextDecoration.watch())
    }
  }
}

export default UmiIntl
