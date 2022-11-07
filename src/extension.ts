import type { ExtensionContext } from 'vscode'
import { window, workspace } from 'vscode'
import { getUserConfig } from './config'
import intl from './core/intl'
import TextDecoration from './decoration'
import { throttleFn } from './helpers'
import packageParser from './parsers/packages'

export function activate(ctx: ExtensionContext) {
  if (
    !getUserConfig().autoDetection
    || !packageParser.init()
    || !intl.init()
  )
    return

  console.warn('xxx#intl config', intl.config)
  const customTextDecoration = new TextDecoration()

  const activeTextEditor = window.onDidChangeActiveTextEditor(
    throttleFn(() => customTextDecoration.create()))

  const changeSelection = window.onDidChangeTextEditorSelection(
    throttleFn(() => customTextDecoration.create()))

  const saveTextDocument = workspace.onDidSaveTextDocument((e) => {
    if (e?.uri?.fsPath?.includes(getUserConfig().localesPath))
      intl.init()
    else
      customTextDecoration.create()
  })

  ctx.subscriptions.push(activeTextEditor)
  ctx.subscriptions.push(changeSelection)
  ctx.subscriptions.push(saveTextDocument)
}

export function deactivate(ctx: ExtensionContext) {
  ctx.subscriptions.forEach(d => d.dispose())
}
