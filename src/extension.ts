import path from 'path'
import fs from 'fs'
import { Position, Range, window, workspace } from 'vscode'
import type { ExtensionContext, WorkspaceFolder } from 'vscode'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

export function activate(context: ExtensionContext) {
  console.warn('xxx#context', context)
  window.showInformationMessage('halo xxx')
  /**
   * 测试代码，用于验证思路
   */
  const text = workspace.textDocuments[0].getText()
  console.warn('xxx#workspace.textDocuments\n', workspace.textDocuments[0].getText())

  const ast = parse(text, {
    sourceType: 'unambiguous',
    plugins: [
      'jsx',
      'typescript',
    ],
  })
  const nodes: any = []
  traverse(ast, {
    CallExpression(path: any) {
      const callee = path.get('callee')
      const property = callee.get('property')
      if (callee.isMemberExpression() && property.isIdentifier({ name: 'formatMessage' }))
        nodes.push(path)
    },
  })

  const result: any = []
  nodes.forEach((n: any) => {
    const node = n.get('arguments')
    node.forEach((node: any) => {
      const properties = node.get('properties')[0]
      const key = properties.get('key').node.name
      const value = properties.get('value')
      if (key === 'id') {
        result.push({
          id: value.node.value,
          start: value.node.start,
          end: properties.node.end,
        })
      }
    })
  })

  console.warn('xxx#result', result)
  /**
   * 测试 locales 配置读取
   */
  const workspaceFolders: ReadonlyArray<WorkspaceFolder> | undefined = workspace.workspaceFolders
  console.warn('xxx#workspaceFolders', workspaceFolders)
  // if (workspaceFolders) {
  const root = workspaceFolders![0]
  const filePath = path.join(root.uri.fsPath, 'src/locales/zh-CN.ts')
  const fileData = fs.readFileSync(filePath, 'utf-8')
  const id = result[0].id
  const idRE = new RegExp(`(?<=\\b${id}\\b:\\s*?('|"))(.*)(?='|"$)`, 'gmi')
  const repValue = fileData.match(idRE)?.[0]
  console.warn('xxx#repValue', repValue)
  // }
  /**
   * 测试 TextEditorDecoration 创建
   */
  const activeEditor = window.activeTextEditor
  const textDecoration = window.createTextEditorDecorationType({
    after: {
      contentText: repValue,
      color: '#008B6C',
      border: '1px solid rgba(0, 139, 108, 0.2)',
    },
  })

  const disappearDecorationType = window.createTextEditorDecorationType({
    textDecoration: 'none; display: none;',
  })
  const text2 = activeEditor?.document.getText()
  const nameRE = /'WELCOME'/
  const match = nameRE.exec(text2!)!
  const startPos = activeEditor?.document.positionAt(match!.index)
  const endPos = activeEditor?.document.positionAt(match.index + match[0].length)
  const range = new Range(startPos!, endPos!)

  activeEditor?.setDecorations(disappearDecorationType, [{ range }])
  activeEditor?.setDecorations(textDecoration, [{
    range,
    hoverMessage: ['需要显示当前 id 的所有语言列表', 'xxxxx'],
  }])
}

export function deactivate() { }
