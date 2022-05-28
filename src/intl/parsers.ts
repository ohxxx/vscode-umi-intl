import { extname, join } from 'path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import type { TObj } from '../types'
import file from './file'

class Parsers {
  #text = ''

  public file(text: string, dirname: string): string {
    this.#text += text

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
      /**
       * @todo：import 引用问题，排除不匹配的 name
       */
      // ExportDeclaration: (path: any) => {
      //   this.#text += this.#parseExport(path, variables)
      // },
    })

    return this.#text
  }

  /**
   * import xxx from './xxx'
   * import xxx from '@/xxx'
   * import { xxx } from '@/xxx'
   * import { xxx as yyy } from '@/xxx'
   * import { xxx, yyy >>> 没有被引用 } from '@/xxx'
   */
  #parseImport = (path: any, dirname: string) => {
    const names: TObj[] = []
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
      return this.file(importContent, dir)
    }
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
