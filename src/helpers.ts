import { window } from 'vscode'

export const showErrorMsg = (msg: string) =>
  window.showErrorMessage(`[ Umi Intl ]: ${msg}`)
