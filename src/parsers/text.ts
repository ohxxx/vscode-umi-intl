import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import type { IVariables, TObj } from '../types'
import file from '../core/file'

class TextParser {
  #text = ''

  public parse(text: string, dirname: string): string {
    this.#parseContent(text, dirname, [])
    return this.#text
  }

  #parseContent(text: string, dirname: string, variables: IVariables[] = []) {
    const ast = parse(text, {
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        'typescript',
      ],
    })

    traverse(ast, {
      ImportDeclaration: (path: any) => {
        this.#parseImport(path, dirname)
      },
      ExportDeclaration: (path: any) => {
        this.#text += this.#parseExport(path, variables)
      },
    })
  }

  #parseImport = (path: any, dirname: string) => {
    const names: IVariables[] = []
    const filepath = path.node.source.value

    const specifiers = path.node.specifiers
    for (const specifier of specifiers) {
      const type = specifier.type
      const name = specifier.local.name
      const importedName = specifier?.imported?.name
      const hasReferenced = path.scope.getBinding(name).referenced
      if (hasReferenced)
        names.push({ type, value: importedName ?? name })
    }

    const { dir, path: importPath } = file.createPath(filepath, dirname)
    if (importPath) {
      const importContent = file.readFile(importPath)
      return this.#parseContent(importContent, dir, names)
    }
  }

  #parseExport = (path: any, variables: IVariables[]) => {
    if (variables.length) {
      const container = path.container
      for (const variable of variables) {
        const { type, value } = variable

        if (type === 'ImportSpecifier') {
          const properties = this.#handleImportSpecifier(container, value)
          return this.#extractProperties(properties)
        }

        if (type === 'ImportDefaultSpecifier') {
          const properties = this.#ImportDefaultSpecifier(container)
          return this.#extractProperties(properties)
        }
      }
    }
    else {
      const properties = path.node.declaration?.properties ?? []
      return this.#extractProperties(properties)
    }
  }

  #handleImportSpecifier = (container: TObj[], value: string) => {
    for (const node of container) {
      const { type, declarations, declaration } = node
      if (type === 'VariableDeclaration')
        return this.#extractDeclaration(declarations, type, value)

      if (type === 'ExportNamedDeclaration') {
        const { type, declarations } = declaration
        return this.#extractDeclaration(declarations, type, value)
      }
    }
  }

  #ImportDefaultSpecifier = (container: TObj[]) => {
    return container.find(n => n.type === 'ExportDefaultDeclaration')?.declaration?.properties
  }

  #extractDeclaration = (declarations: TObj[], type: string, value: string) => {
    if (type === 'VariableDeclaration') {
      const declaration = declarations?.find(n => n.id.name === value)
      if (declaration)
        return declaration?.init?.properties ?? []
    }

    /** ... */

    return []
  }

  #extractProperties = (properties: TObj[]) => {
    if (!properties.length)
      return ''

    let text = ''
    for (const property of properties) {
      if (property.type === 'ObjectProperty') {
        const { key, value } = property
        text += JSON.stringify({ [key?.name ?? key?.value]: value?.value })
      }
    }
    return text
  }
}

export default TextParser
