import type { Position, TextEditorDecorationType } from 'vscode'

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
