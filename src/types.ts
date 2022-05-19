import type { Position } from 'vscode'

/**
 * 装饰记录
 */
export interface IDecorationRecord {
  /** 多语言 id */
  id: string
  /** 开始位置 */
  start: Position
  /** 结束位置 */
  end: Position
}
