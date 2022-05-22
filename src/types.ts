import type { Position, Range, TextEditorDecorationType } from 'vscode'

export interface IDecorationRecord {
  id: string
  start: Position
  end: Position
}

export interface IDecorationType {
  hide: TextEditorDecorationType
  underline: TextEditorDecorationType
  tip: TextEditorDecorationType
}

export interface ITipRange {
  id: string
  range: Range
}