import type { DecorationOptions } from 'vscode'
import { Range, window } from 'vscode'
import { INTL_ID_RE } from '../constants'
import intlFile from '../intlFile'
import type { IDecorationRecord, IDecorationType, ITipRange } from '../types'
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

  #createTips(ranges: ITipRange[]) {
    const editor = window.activeTextEditor

    if (editor) {
      const render: DecorationOptions[] = []
      ranges.forEach((info) => {
        const { id, range } = info
        const value = intlFile.value(id)
        render.push({
          range,
          renderOptions: {
            after: {
              contentText: value ?? '暂无匹配',
              color: value ? '#888888' : '#FC5E5C',
              border: `0.5px solid ${value ? '#888888' : '#FC5E5C'}`,
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
    const tipsRanges: ITipRange[] = []

    for (const match of text.matchAll(INTL_ID_RE)) {
      const id = match[0]
      const index = match.index!
      const start = editor.document.positionAt(index)
      const end = editor.document.positionAt(index + id.length)
      const range = new Range(start, end)
      ranges.push(range)
      tipsRanges.push({ id, range })
      this.#updateRecord({ id, start, end })
    }

    this.#createTips(tipsRanges)
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
    const otherRanges: ITipRange[] = []

    for (const item of this.#record) {
      const { id, start: itemStart, end: itemEnd } = item
      const range = new Range(itemStart, itemEnd)
      if (
        (selectionStart.line <= itemStart.line && itemStart.line <= selectionEnd.line)
        || (selectionStart.line <= itemEnd.line && itemEnd.line <= selectionEnd.line)
      )
        currentRanges.push(range)

      else
        otherRanges.push({ id, range })
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
