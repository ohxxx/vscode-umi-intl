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

export const uuid = (a?: number) =>
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
  (a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid))
