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

export type TObj = Record<string, any>

export interface IVariables {
  type: string
  value: string
}
