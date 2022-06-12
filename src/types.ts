import type { Position, Range, TextEditorDecorationType } from 'vscode'

export interface IDecorationRecord {
  id: string
  state: 'tip' | 'underline'
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

export interface IUserConfig {
  autoDetection: Boolean
  localesPath: string
  displayLanguage: string
}
