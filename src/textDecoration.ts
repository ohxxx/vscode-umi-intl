import { Range, window } from 'vscode'
import { INTL_RE } from './constants'
import type { IDecorationRecord } from './types'

class TextDecoration {
  #decorationRecord: IDecorationRecord[] = []

  /**
   * 更新装饰记录
   */
  private updateDecorationRecord(record: IDecorationRecord) {
    this.#decorationRecord.push(record)
  }

  /**
   * 隐藏文本装饰类型
   */
  private hideTextDecorationType = window.createTextEditorDecorationType({
    textDecoration: 'none; display: none;',
  })

  /**
   * 下划线文本装饰类型
   */
  private underlineDecorationType = window.createTextEditorDecorationType({
    textDecoration: 'underline',
  })

  /**
   * 提示文本装饰类型
   */
  private tipTextDecorationType(text: string) {
    return window.createTextEditorDecorationType({
      after: {
        contentText: text,
        // color: '#008B6C',
        // border: '1px solid rgba(0, 139, 108, 0.2)',
        color: 'white',
        backgroundColor: 'red',
      },
    })
  }

  /**
   * 更新文本装饰
   *
   * @todo：
   *    1、原文本 与 提示文本 切换
   *    2、多语言 hover 提示及跳转
   */
  private update() {
    const editor = window.activeTextEditor!
    const text = editor.document.getText()
    const rangeArr: Range[] = []

    for (const match of text.matchAll(INTL_RE)) {
      const index = match.index!
      const start = editor.document.positionAt(index)
      const end = editor.document.positionAt(index + match[0].length)
      const range = new Range(start, end)
      rangeArr.push(range)
      this.updateDecorationRecord({ id: 'xxx', start, end })
    }

    editor?.setDecorations(this.hideTextDecorationType, rangeArr)
    editor?.setDecorations(this.underlineDecorationType, rangeArr)
    // todo：tipTextDecorationType context 需要动态获取
    editor?.setDecorations(this.tipTextDecorationType('前方施工中'), rangeArr)
  }

  /**
   * 检测文本内容
   */
  private checkText() {
    /** ... */
  }

  /**
   * 刷新文本装饰
   */
  private refresh() {
    /** ... */
  }

  /**
   * 清除文本装饰
   */
  private clear() {
    /** ... */
  }

  /**
   * 监听光标位置
   */
  public watch() {
    const editor = window.activeTextEditor!
    const selection = editor.selection
    for (const item of this.#decorationRecord) {
      if (
        (selection.start.line <= item.start.line && item.start.line <= selection.end.line)
        || (selection.start.line <= item.end.line && item.end.line <= selection.end.line)
      ) {
        const range = new Range(item.start, item.end)
        editor?.setDecorations(this.underlineDecorationType, [range])
        editor?.setDecorations(this.tipTextDecorationType('哈哈哈哈哈哈'), [range])
        /**
         * @todo：清空/更新文本装饰
         */
      }
    }
  }

  /**
   * 创建文本装饰
   */
  public create() {
    // check
    this.checkText()

    // update
    this.update()
  }
}

const customTextDecoration = new TextDecoration()

export default customTextDecoration
