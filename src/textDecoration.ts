import { Range, window } from 'vscode'
import { INTL_RE } from './constants'

class TextDecoration {
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
        color: '#008B6C',
        border: '1px solid rgba(0, 139, 108, 0.2)',
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
    const activeEditor = window.activeTextEditor!
    const text = activeEditor.document.getText()
    const rangeArr: Range[] = []

    for (const match of text.matchAll(INTL_RE)) {
      const index = match.index!
      const startPos = activeEditor.document.positionAt(index)
      const endPos = activeEditor.document.positionAt(index + match[0].length)
      const range = new Range(startPos, endPos)
      rangeArr.push(range)
    }

    activeEditor?.setDecorations(this.hideTextDecorationType, rangeArr)
    activeEditor?.setDecorations(this.underlineDecorationType, rangeArr)
    // todo：tipTextDecorationType context 需要动态获取
    activeEditor?.setDecorations(this.tipTextDecorationType('前方施工中'), rangeArr)
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
