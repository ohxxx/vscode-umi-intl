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
      workspace.onDidSaveTextDocument((e) => {
        if (e?.uri?.fsPath?.includes(getUserConfig().localesPath))
          intl.init()
        else
          customTextDecoration.create()
      })
      /**
       * @ISSUE
       *   有点问题，废弃或者修复
       */
      // workspace.onDidChangeTextDocument((e) => {
      //   if (e?.document?.uri?.fsPath?.includes(getUserConfig().localesPath))
      //     intl.init()
      //   else
      //     throttleFn(() => customTextDecoration.create())
      // })
    }
  }
}

export default UmiIntl
