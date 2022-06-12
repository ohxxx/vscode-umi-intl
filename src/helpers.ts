import { window } from 'vscode'

export const showErrorMsg = (msg: string) =>
  window.showErrorMessage(`[ Umi Intl ]: ${msg}`)

export const throttleFn = (fn: Function, delay = 200) => {
  let timer: NodeJS.Timeout | null
  return (...args: any[]) => {
    if (timer)
      return

    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
