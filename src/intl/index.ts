import { INTL_FILE_RE, INTL_KEY_VALUE_RE } from '../constants'
import Parsers from './parsers'
import file from './file'

class IntlFile {
  #config: Record<string, Record<string, string>> = {}

  constructor() {
    file.init()
    this.#init()
  }

  #updateConfig(key: string, value: Record<string, string>) {
    this.#config[key] = value
  }

  #value(id: string) {
    return this.#config['zh-CN' /** get config */][id]
  }

  #init() {
    this.#readDir(file.rootPath)
  }

  #readDir(path: string) {
    const dir = file.readDir(path)
    const fileNames = dir.filter((item: string) => INTL_FILE_RE.test(item))

    for (const fileName of fileNames) {
      const key = fileName.match(INTL_FILE_RE)![0]
      const values = this.#readFile(`${path}/${fileName}`)
      this.#updateConfig(key, values)
    }
  }

  #readFile(path: string) {
    let text = file.readFile(path)
    const values: Record<string, string> = {}

    if (!path.endsWith('.json'))
      text = new Parsers().file(text, file.rootPath)

    for (const match of text.matchAll(INTL_KEY_VALUE_RE))
      values[match[1]] = match[2]

    return values
  }

  get config() {
    return this.#config
  }

  public value(id: string) {
    return this.#value(id)
  }
}

const intl = new IntlFile()

export default intl
