import type { DecorationOptions, Position, TextDocument } from 'vscode'
import { Hover, MarkdownString, Range, languages, window } from 'vscode'
import { INTL_ID_RE, LANGUAGES } from '../constants'
import intl from '../core/intl'
import { uuid } from '../helpers'
import type { IDecorationRecord, IDecorationType, ITipRange, TObj } from '../types'
import decorationType from './type'

class TextDecoration {
  #record: IDecorationRecord[] = []
  #type: IDecorationType = {
    hide: decorationType.hide,
    underline: decorationType.underline,
    tip: decorationType.tip,
  }

  #addRecord(record: IDecorationRecord) {
    this.#record.push(record)
  }

  #updateRecord(data: IDecorationRecord) {
    const record = this.#record
    const index = record.findIndex(item => item.id === data.id)
    if (index > -1)
      this.#record[index] = data
  }

  #resetRecord() {
    this.#record = []
  }

  #createTips(ranges: ITipRange[]) {
    const editor = window.activeTextEditor

    if (editor) {
      const render: DecorationOptions[] = []
      ranges.forEach((info) => {
        const { key, range } = info
        const value = intl.value(key)
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
      const id = uuid()
      const key = match[0]
      const index = match.index!
      const start = editor.document.positionAt(index)
      const end = editor.document.positionAt(index + key.length)
      const range = new Range(start, end)
      ranges.push(range)
      tipsRanges.push({ id, key, range })
      this.#addRecord({ id, key, start, end, state: 'tip' })
    }

    this.#createTips(tipsRanges)
    editor?.setDecorations(this.#type.hide, ranges)
  }

  #clear() {
    const editor = window.activeTextEditor
    if (editor) {
      Object
        .values(this.#type)
        .forEach(t => editor.setDecorations(t, []))
    }
  }

  #watch() {
    const editor = window.activeTextEditor

    if (!editor || !this.#record.length)
      return

    const { start: selectionStart, end: selectionEnd } = editor.selection
    const currentRanges: Range[] = []
    const otherRanges: ITipRange[] = []

    for (const item of this.#record) {
      const { id, key, start: itemStart, end: itemEnd } = item
      const range = new Range(itemStart, itemEnd)
      if (
        selectionStart.isAfterOrEqual(itemStart)
        && selectionEnd.isBeforeOrEqual(itemEnd)
      ) {
        this.#updateRecord({ ...item, state: 'underline' })
        currentRanges.push(range)
      }
      else {
        this.#updateRecord({ ...item, state: 'tip' })
        otherRanges.push({ id, key, range })
      }
    }

    this.#clear()

    this.#createTips(otherRanges)
    editor.setDecorations(this.#type.hide, otherRanges)

    editor.setDecorations(this.#type.underline, currentRanges)
  }

  #hover() {
    const record = this.#record
    const createHover = this.#createHover

    languages.registerHoverProvider(LANGUAGES, {
      provideHover(document: TextDocument, position: Position) {
        const offsetAt = (range: Position) => document.offsetAt(range)
        const offset = offsetAt(position)

        const item = record.find(item =>
          offsetAt(item.start) <= offset
          && offset <= offsetAt(item.end)
          && item.state === 'underline',
        )
        if (!item)
          return

        const values = intl.values(item.key)
        if (!values)
          return

        const content = createHover(values)

        return new Hover(
          content,
          new Range(item.start, item.end),
        )
      },
    })
  }

  #createHover(values: TObj) {
    const text = new MarkdownString()

    let str = ''
    for (const id of Object.keys(values))
      str += `${id} : ${values[id]}\n\n`

    return text.appendMarkdown(str)
  }

  public create() {
    this.#clear()
    this.#resetRecord()

    this.#update()
    this.#hover()
    this.#watch()
  }
}

export default TextDecoration
