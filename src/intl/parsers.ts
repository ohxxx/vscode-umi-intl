import { extname, join } from 'path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import type { IVariables } from '../types'
import file from './file'

class Parsers {
  #text = ''

  public file(text: string, dirname: string): string {
    this.#parse(text, dirname, [])

    return this.#text
  }

  #parse(text: string, dirname: string, variables: IVariables[] = []) {
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

    const { dir, path: importPath } = this.#createPath(filepath, dirname)
    if (importPath) {
      const importContent = file.readFile(importPath)
      return this.#parse(importContent, dir, names)
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

  #handleImportSpecifier = (container: [], value: string) => {
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

  #ImportDefaultSpecifier = (container: any[]) => {
    return container.find((n: any) => n.type === 'ExportDefaultDeclaration')?.declaration?.properties
  }

  #extractDeclaration = (declarations: [], type: string, value: string) => {
    if (type === 'VariableDeclaration') {
      const declaration: any = declarations?.find((n: any) => n.id.name === value)
      if (declaration)
        return declaration?.init?.properties ?? []
    }
    /** ... */
    return []
  }

  #extractProperties = (properties: any[] /** type */) => {
    if (!properties.length)
      return ''

    let text = ''
    for (const property of properties) {
      if (property.type === 'ObjectProperty') {
        const key = property.key.name
        const value = property.value.value
        const result = JSON.stringify({ [key]: value })
        text += result
      }
    }
    return text
  }

  #createPath = (relpath: string, dirname: string) => {
    let abspath = relpath
    if (/^./.test(relpath))
      abspath = join(dirname, relpath)

    return this.#revisePath(abspath)
  }

  #revisePath = (abspath: string) => {
    if (extname(abspath) && file.exists(abspath))
      return { dir: abspath.substring(0, abspath.lastIndexOf('.')), path: abspath }

    const suffixSet = ['.ts', '.js', '.json', '/index.ts', '/index.js']
    const idx = suffixSet.findIndex((suffix: string) => file.exists(`${abspath}${suffix}`))
    const fullpath = idx > -1 ? `${abspath}${suffixSet[idx]}` : null

    return {
      dir: abspath,
      path: fullpath,
    }
  }
}

const parsers = new Parsers()

export default parsers
