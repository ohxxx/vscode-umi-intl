import { Range, window } from 'vscode'
import { INTL_RE } from './constants'

/**
 * 隐藏原文本装饰类型
 */
const hideDecorationType = window.createTextEditorDecorationType({
  textDecoration: 'none; display: none;',
})

/**
 * 提示文本装饰类型
 */
const tipDecorationType = (text: string) =>
  window.createTextEditorDecorationType({
    after: {
      contentText: text,
      color: '#008B6C',
      border: '1px solid rgba(0, 139, 108, 0.2)',
    },
  })

/**
 * 更新当前文本装饰
 *
 * @todo：
 *    1、文件内容检测，没有引用 useIntl 就退出
 *    2、原文本 与 提示文本 切换
 *    3、多语言 hover 提示及跳转
 */
export const updateTextDecoration = () => {
  const activeEditor = window.activeTextEditor!
  const text = activeEditor.document.getText()
  const rangeArr = []

  for (const match of text.matchAll(INTL_RE)) {
    const index = match.index!
    const startPos = activeEditor.document.positionAt(index)
    const endPos = activeEditor.document.positionAt(index + match[0].length)
    const range = new Range(startPos, endPos)
    rangeArr.push(range)
  }

  activeEditor?.setDecorations(hideDecorationType, rangeArr)
  activeEditor?.setDecorations(tipDecorationType('前方施工中'), rangeArr)
}
