import { window, workspace } from 'vscode'
import type { ExtensionContext } from 'vscode'
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
}

export function deactivate() { }
