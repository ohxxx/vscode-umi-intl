import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

class Parsers {
  #text = ''

  public file(text: string): string {
    this.#text = text

    const ast = parse(text, {
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        'typescript',
      ],
    })

    traverse(ast, {
      ImportDefaultSpecifier: (path: any) => {
        this.#parseImport(path)
      },
    })

    return this.#text
  }

  #parseImport = (path: any) => {
    /** ... */
    const value = path.parentPath.node.source.value
    console.warn('xxx#path', path)
    console.warn('xxx#value', value)
    this.#text = 'xxx: \'I am xxx\''
  }
}

const parsers = new Parsers()

export default parsers
