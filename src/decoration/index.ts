import type { DecorationOptions } from 'vscode'
import { Range, window } from 'vscode'
import { INTL_RE } from '../constants'
import type { IDecorationRecord, IDecorationType } from '../types'
import decorationType from './type'

class TextDecoration {
  #record: IDecorationRecord[] = []
  #type: IDecorationType = {
    hide: decorationType.hide,
    underline: decorationType.underline,
    tip: decorationType.tip,
  }

  #updateRecord(record: IDecorationRecord) {
    this.#record.push(record)
  }

  #clearRecord() {
    this.#record = []
  }

  #createTips(ranges: Range[] /** text */) {
    const editor = window.activeTextEditor

    if (editor) {
      const render: DecorationOptions[] = []

      ranges.forEach((range) => {
        render.push({
          range,
          renderOptions: {
            after: {
              contentText: '前方施工中',
              color: 'red', /** #888888 */
              border: '0.5px solid red',
            },
          },
        })
      })

      editor.setDecorations(this.#type.tip, render)
    }
  }

  #update() {
    const editor = window.activeTextEditor

    if (!editor)
      return

    const text = editor.document.getText()
    const ranges: Range[] = []

    for (const match of text.matchAll(INTL_RE)) {
      const index = match.index!
      const start = editor.document.positionAt(index)
      const end = editor.document.positionAt(index + match[0].length)
      const range = new Range(start, end)
      ranges.push(range)
      this.#updateRecord({ id: match[0], start, end })
    }

    this.#createTips(ranges)
    editor?.setDecorations(this.#type.hide, ranges)
  }

  #check() {
    /** ... */
  }

  #refresh() {
    /** ... */
  }

  #clear() {
    const editor = window.activeTextEditor
    if (editor) {
      Object
        .values(this.#type)
        .forEach(t => editor.setDecorations(t, []))
    }
  }

  public watch() {
    const editor = window.activeTextEditor

    if (!editor || !this.#record.length)
      return

    const { start: selectionStart, end: selectionEnd } = editor.selection
    const currentRanges: Range[] = []
    const otherRanges: Range[] = []
    for (const item of this.#record) {
      const { start: itemStart, end: itemEnd } = item
      const range = new Range(itemStart, itemEnd)
      if (
        (selectionStart.line <= itemStart.line && itemStart.line <= selectionEnd.line)
        || (selectionStart.line <= itemEnd.line && itemEnd.line <= selectionEnd.line)
      )
        currentRanges.push(range)

      else
        otherRanges.push(range)
    }

    this.#clear()

    this.#createTips(otherRanges)
    editor.setDecorations(this.#type.hide, otherRanges)

    editor.setDecorations(this.#type.underline, currentRanges)
  }

  public create() {
    this.#check()
    this.#clearRecord()
    this.#clear()
    this.#update()
  }
}

const customTextDecoration = new TextDecoration()

export default customTextDecoration
